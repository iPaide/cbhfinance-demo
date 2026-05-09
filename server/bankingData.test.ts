import { describe, expect, it, beforeEach } from "vitest";
import {
  FAILED_LOGIN_LOCKOUT_ATTEMPTS,
  PAYMENT_BLOCK_MESSAGE,
  SESSION_TIMEOUT_MINUTES,
  SESSION_WARNING_MINUTES,
  TRANSACTIONS_PER_PAGE,
  adminAdjustBalance,
  attemptCredentialLogin,
  blockOutgoingPayment,
  getAccounts,
  getAuditLogs,
  getDashboardSummary,
  getTransactions,
  resetDemoStateForTests,
} from "./bankingData";

describe("CBHfinance banking data", () => {
  beforeEach(() => resetDemoStateForTests());

  it("uses the exact seeded account balances and net worth", () => {
    const accounts = getAccounts();
    expect(accounts.find(account => account.type === "Checking")?.balance).toBe(62288.72);
    expect(accounts.find(account => account.type === "Savings")?.balance).toBe(116039.59);
    expect(accounts.find(account => account.type === "IRA")?.balance).toBe(436892.55);
    expect(getDashboardSummary().totalNetWorth).toBe(615220.86);
  });

  it("blocks outgoing payments with the required exact modal message and without ledger mutation", () => {
    const before = getTransactions({ page: 1 }).total;
    const result = blockOutgoingPayment();
    const after = getTransactions({ page: 1 }).total;
    expect(result).toEqual({ blocked: true, message: PAYMENT_BLOCK_MESSAGE });
    expect(PAYMENT_BLOCK_MESSAGE).toBe("Unable to complete transaction. Please contact support.");
    expect(after).toBe(before);
  });

  it("paginates transactions at exactly 25 records per page", () => {
    const result = getTransactions({ page: 1 });
    expect(result.pageSize).toBe(TRANSACTIONS_PER_PAGE);
    expect(result.rows).toHaveLength(25);
  });

  it("creates a transaction and immutable-style append-only audit record for admin credit", () => {
    const beforeAudit = getAuditLogs().length;
    const result = adminAdjustBalance({ accountId: "acc_checking", action: "Credit", amount: 125.25, description: "Bonus Deposit" });
    expect(result.account.balance).toBe(62413.97);
    expect(result.transaction.description).toBe("Admin Credit — Bonus Deposit");
    expect(getAuditLogs()).toHaveLength(beforeAudit + 1);
    expect(getAuditLogs()[0].actionType).toBe("CREDIT");
  });

  it("prevents admin debit beyond the current account balance", () => {
    expect(() => adminAdjustBalance({ accountId: "acc_checking", action: "Debit", amount: 999999, description: "Invalid debit" })).toThrow("Admin debit cannot exceed the current account balance.");
  });

  it("uses exact security constants for session warning, timeout, and failed-login lockout", () => {
    expect(SESSION_WARNING_MINUTES).toBe(13);
    expect(SESSION_TIMEOUT_MINUTES).toBe(15);
    expect(FAILED_LOGIN_LOCKOUT_ATTEMPTS).toBe(5);
  });

  it("locks the customer account after exactly five failed user login attempts", () => {
    let locked = false;
    for (let index = 0; index < FAILED_LOGIN_LOCKOUT_ATTEMPTS; index += 1) {
      const result = attemptCredentialLogin({ role: "user", email: "emily.johnson@cbhfinance.online", password: "wrong" });
      locked = result.locked;
    }
    expect(locked).toBe(true);
  });
});
