import { afterEach, describe, expect, it, vi } from "vitest";
import { unlock } from "@/lib/private/client";

afterEach(() => vi.unstubAllGlobals());

function stubFetch(stepStatus: number) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string) =>
      url.endsWith("/unlock")
        ? new Response(null, { status: 204 })
        : stepStatus === 200
          ? Response.json({ steps: [{ n: 11 }] })
          : new Response("Not found", { status: stepStatus }),
    ),
  );
}

describe("unlock()", () => {
  it("says ok only when private mode really turned on", async () => {
    stubFetch(200);
    expect(await unlock("code")).toBe("ok");
  });

  it("reports an error when the cookie did not stick", async () => {
    stubFetch(404);
    expect(await unlock("code")).toBe("error");
  });
});
