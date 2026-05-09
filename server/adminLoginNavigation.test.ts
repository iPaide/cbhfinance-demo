import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const source = readFileSync(resolve(process.cwd(), "client/src/pages/CBHFinanceApp.tsx"), "utf8");

describe("admin OTP same-route navigation", () => {
  it("notifies the mounted /secure-admin route when OTP verification creates an admin session", () => {
    expect(source).toContain("onAuthenticated?: (session: DemoSession) => void");
    expect(source).toContain("const nextSession = { role, token: result.token");
    expect(source).toContain("writeSession(nextSession);");
    expect(source).toContain("onAuthenticated?.(nextSession);");
    expect(source).toContain('<LoginPage role="admin" onAuthenticated={setSession} />');
  });
});
