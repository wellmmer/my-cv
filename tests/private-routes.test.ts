import { readFileSync } from "node:fs";
import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { POST as lockPost } from "@/app/api/private/lock/route";
import { GET as cvGet } from "@/app/api/private/cv/route";
import { GET as stepGet } from "@/app/api/private/step/route";
import { POST as unlockPost } from "@/app/api/private/unlock/route";
import { hashCode } from "@/lib/private/code";
import { setMinDelay } from "@/lib/private/session";

const BASE = "http://localhost:3100";
const CODE = "test-brick-code-four";
const saved = { ...process.env };

function unlockReq(body: string) {
  return new NextRequest(`${BASE}/api/private/unlock`, { method: "POST", body, headers: { "content-type": "application/json" } });
}
function get(path: string, cookie?: string) {
  return new NextRequest(`${BASE}${path}`, { headers: cookie ? { cookie } : {} });
}
async function cookieFromUnlock(): Promise<string> {
  const res = await unlockPost(unlockReq(JSON.stringify({ code: CODE })));
  return (res.headers.get("set-cookie") ?? "").split(";")[0];
}
function expectPrivateHeaders(res: Response) {
  expect(res.headers.get("x-robots-tag")).toBe("noindex");
  expect(res.headers.get("cache-control")).toBe("private, no-store");
}

beforeEach(() => {
  setMinDelay(0);
  process.env.PRIVATE_STEPS_JSON = readFileSync("tests/fixtures/private/steps.json", "utf8");
  process.env.PRIVATE_CODE_HASH = hashCode(CODE);
  process.env.UNLOCK_SECRET = "s".repeat(40);
  process.env.PRIVATE_FILES_DIR = "tests/fixtures/private";
});
afterEach(() => {
  process.env = { ...saved };
});

describe("private routes", () => {
  it("answers 404 to step and cv without a cookie", async () => {
    for (const res of [await stepGet(get("/api/private/step")), await cvGet(get("/api/private/cv?kind=designed&locale=en"))]) {
      expect(res.status).toBe(404);
      expectPrivateHeaders(res);
    }
  });

  it("rejects a wrong code with 401 and no cookie", async () => {
    const res = await unlockPost(unlockReq(JSON.stringify({ code: "nope" })));
    expect(res.status).toBe(401);
    expect(res.headers.get("set-cookie")).toBeNull();
    expectPrivateHeaders(res);
  });

  it("rejects odd bodies with 400", async () => {
    for (const body of ["not json", JSON.stringify({ code: 42 }), JSON.stringify({ code: "x".repeat(2000) }), ""]) {
      const res = await unlockPost(unlockReq(body));
      expect(res.status, body.slice(0, 20)).toBe(400);
      expect(res.headers.get("set-cookie")).toBeNull();
    }
  });

  it("rejects an oversized body by its declared length and by streaming", async () => {
    const declared = new NextRequest(`${BASE}/api/private/unlock`, {
      method: "POST",
      body: JSON.stringify({ code: CODE }),
      headers: { "content-type": "application/json", "content-length": "999999" },
    });
    expect((await unlockPost(declared)).status).toBe(400);
    let pulled = 0;
    const endless = new ReadableStream<Uint8Array>({
      pull(c) {
        pulled += 1;
        if (pulled > 1000) return c.close();
        c.enqueue(new Uint8Array(512).fill(97));
      },
    });
    const streamed = new NextRequest(`${BASE}/api/private/unlock`, { method: "POST", body: endless, duplex: "half" } as unknown as ConstructorParameters<typeof NextRequest>[1]);
    expect((await unlockPost(streamed)).status).toBe(400);
    expect(pulled).toBeLessThan(10);
  });

  it("sets a strict 30-day cookie for the right code", async () => {
    const res = await unlockPost(unlockReq(JSON.stringify({ code: CODE })));
    expect(res.status).toBe(204);
    const c = res.headers.get("set-cookie") ?? "";
    for (const part of ["cv_private=", "HttpOnly", "Secure", "Max-Age=2592000", "Path=/"]) expect(c).toContain(part);
    expect(c.toLowerCase()).toContain("samesite=lax");
    expectPrivateHeaders(res);
  });

  it("serves the step and the PDFs with the cookie", async () => {
    const cookie = await cookieFromUnlock();
    const step = await stepGet(get("/api/private/step", cookie));
    expect(step.status).toBe(200);
    expect(await step.text()).toContain("Acme Test Co");
    expectPrivateHeaders(step);

    const pdf = await cvGet(get("/api/private/cv?kind=ats&locale=pt", cookie));
    expect(pdf.status).toBe(200);
    expect(pdf.headers.get("content-type")).toBe("application/pdf");
    expect(pdf.headers.get("content-disposition")).toBe('attachment; filename="Wellmmer-Lucas-CV-ATS-PT.pdf"');
    expectPrivateHeaders(pdf);

    expect((await cvGet(get("/api/private/cv?kind=evil&locale=en", cookie))).status).toBe(404);
    expect((await cvGet(get("/api/private/cv?kind=designed&locale=fr", cookie))).status).toBe(404);
  });

  it("falls back to the public PDF when the private file cannot be read", async () => {
    const cookie = await cookieFromUnlock();
    process.env.PRIVATE_FILES_DIR = "tests/fixtures/does-not-exist";
    const res = await cvGet(get("/api/private/cv?kind=ats&locale=pt", cookie));
    expect(res.status).toBe(302);
    expect(res.headers.get("location")).toBe(`${BASE}/cv/Wellmmer-Lucas-CV-ATS-PT.pdf`);
  });

  it("lock clears the cookie", async () => {
    const res = await lockPost();
    expect(res.status).toBe(204);
    expect(res.headers.get("set-cookie")).toContain("Max-Age=0");
    expectPrivateHeaders(res);
  });

  it("a cookie from an old code stops working", async () => {
    const cookie = await cookieFromUnlock();
    process.env.PRIVATE_CODE_HASH = hashCode("a-brand-new-code");
    expect((await stepGet(get("/api/private/step", cookie))).status).toBe(404);
  });

  it("answers 404 everywhere when private mode is not configured", async () => {
    delete process.env.PRIVATE_STEPS_JSON;
    expect((await unlockPost(unlockReq(JSON.stringify({ code: CODE })))).status).toBe(404);
    expect((await stepGet(get("/api/private/step"))).status).toBe(404);
  });

  it("every unlock attempt takes at least a second", async () => {
    setMinDelay(1000);
    const t = Date.now();
    await unlockPost(unlockReq(JSON.stringify({ code: "nope" })));
    expect(Date.now() - t).toBeGreaterThanOrEqual(1000);
  });
});
