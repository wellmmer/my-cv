import { describe, expect, it } from "vitest";
import { codeFingerprint, hashCode, isCodeHash, verifyCode } from "@/lib/private/code";
import { signToken, verifyToken } from "@/lib/private/token";

describe("private code", () => {
  it("verifies the right code, ignoring case and spaces", async () => {
    const h = hashCode("Brick-Tango-Lamp-Owl");
    expect(await verifyCode("  brick-tango-lamp-owl ", h)).toBe(true);
    expect(await verifyCode("brick-tango-lamp-owk", h)).toBe(false);
  });

  it("accepts the code typed with spaces or long dashes", async () => {
    const h = hashCode("brick-tango-lamp-owl");
    expect(await verifyCode("Brick Tango  Lamp Owl", h)).toBe(true);
    expect(await verifyCode("brick\u2013tango\u2014lamp\u2011owl", h)).toBe(true);
  });

  it("checks the code without blocking the event loop", () => {
    expect(verifyCode("x", hashCode("x"))).toBeInstanceOf(Promise);
  });

  it("knows a well-formed hash from a broken one", () => {
    expect(isCodeHash(hashCode("a-b-c-d-e"))).toBe(true);
    for (const bad of ["", "nope", "scrypt$$", "scrypt$abc$def", "bcrypt$x$y"]) expect(isCodeHash(bad), bad).toBe(false);
  });

  it("never stores the code in the hash", () => {
    expect(hashCode("brick-tango-lamp-owl")).not.toContain("brick");
  });

  it("rejects a malformed stored hash", async () => {
    expect(await verifyCode("x", "nope")).toBe(false);
    expect(await verifyCode("x", "scrypt$$")).toBe(false);
  });
});

describe("unlock token", () => {
  it("accepts a fresh token and rejects expired, tampered and foreign ones", () => {
    const t = signToken({ exp: 2_000, v: "abc" }, "s3cret");
    expect(verifyToken(t, "s3cret", "abc", 1_000)).toBe(true);
    expect(verifyToken(t, "s3cret", "abc", 2_001)).toBe(false);
    expect(verifyToken(t + "x", "s3cret", "abc", 1_000)).toBe(false);
    expect(verifyToken(t, "other", "abc", 1_000)).toBe(false);
    expect(verifyToken(undefined, "s3cret", "abc", 1_000)).toBe(false);
    expect(verifyToken("garbage", "s3cret", "abc", 1_000)).toBe(false);
  });

  it("token signed under old fingerprint is rejected", () => {
    const old = codeFingerprint(hashCode("old-code-one-two"));
    const now = codeFingerprint(hashCode("new-code-one-two"));
    expect(verifyToken(signToken({ exp: 9e15, v: old }, "s"), "s", now, 0)).toBe(false);
  });
});
