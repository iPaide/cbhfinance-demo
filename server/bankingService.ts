import crypto from "crypto";
import { eq, desc } from "drizzle-orm";

import { getDb } from "./db.js";

import {
  cbhAccounts,
  cbhTransactions,
  cbhCustomers,
} from "../drizzle/schema.js";

// ===============================
// HELPERS
// ===============================

function maskAccount(accountNumber: string) {
  return `••••${accountNumber.slice(-4)}`;
}

function assertTransferAmount(amount: number) {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Transfer amount must be greater than zero");
  }
}

// ===============================
// DASHBOARD SUMMARY
// ===============================

export async function getDashboardSummary(userId: string) {
  const db = await getDb();

  if (!db) {
    throw new Error("Database unavailable");
  }

  const accounts = await db
    .select()
    .from(cbhAccounts)
    .where(eq(cbhAccounts.userId, userId));

  const totalBalance = accounts.reduce(
    (sum, acc) => sum + Number(acc.balance),
    0
  );

  return {
    totalBalance,
    accounts,
  };
}

// ===============================
// GET ACCOUNTS
// ===============================

export async function getAccounts(userId: string) {
  const db = await getDb();

  if (!db) {
    throw new Error("Database unavailable");
  }

  return await db
    .select()
    .from(cbhAccounts)
    .where(eq(cbhAccounts.userId, userId));
}

// ===============================
// GET TRANSACTIONS
// ===============================

export async function getTransactions(accountId: string) {
  const db = await getDb();

  if (!db) {
    throw new Error("Database unavailable");
  }

  return await db
    .select()
    .from(cbhTransactions)
    .where(eq(cbhTransactions.accountId, accountId))
    .orderBy(desc(cbhTransactions.createdAt));
}

// ===============================
// GET CUSTOMER
// ===============================

export async function getCustomer(userId: string) {
  const db = await getDb();

  if (!db) {
    throw new Error("Database unavailable");
  }

  const result = await db
    .select()
    .from(cbhCustomers)
    .where(eq(cbhCustomers.id, userId))
    .limit(1);

  return result[0] || null;
}

// ===============================
// TRANSFER FUNDS
// ===============================

export async function transferFunds({
  fromAccountId,
  toAccountId,
  amount,
  initiatedBy,
  memo,
}: {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  initiatedBy: string;
  memo?: string;
}) {
  const db = await getDb();

  if (!db) {
    throw new Error("Database unavailable");
  }

  assertTransferAmount(amount);

  if (fromAccountId === toAccountId) {
    throw new Error("Source and destination accounts must be different");
  }

  const sender = await db
    .select()
    .from(cbhAccounts)
    .where(eq(cbhAccounts.id, fromAccountId))
    .limit(1);

  const receiver = await db
    .select()
    .from(cbhAccounts)
    .where(eq(cbhAccounts.id, toAccountId))
    .limit(1);

  if (!sender[0]) {
    throw new Error("Sender account not found");
  }

  if (!receiver[0]) {
    throw new Error("Receiver account not found");
  }

  if (sender[0].userId !== initiatedBy) {
    throw new Error("Unauthorized transfer");
  }

  if (receiver[0].userId !== initiatedBy) {
    throw new Error("Transfers are only allowed between your own accounts");
  }

  const allowedAccountTypes = ["Checking", "Savings"];

  if (
    !allowedAccountTypes.includes(sender[0].accountType) ||
    !allowedAccountTypes.includes(receiver[0].accountType)
  ) {
    throw new Error(
      "Transfers are only allowed between Checking and Savings accounts"
    );
  }

  const senderBalance = Number(sender[0].balance);
  const receiverBalance = Number(receiver[0].balance);

  if (senderBalance < amount) {
    throw new Error("Insufficient funds");
  }

  const updatedSenderBalance = senderBalance - amount;
  const updatedReceiverBalance = receiverBalance + amount;

  await db
    .update(cbhAccounts)
    .set({
      balance: updatedSenderBalance.toFixed(2),
    })
    .where(eq(cbhAccounts.id, fromAccountId));

  await db
    .update(cbhAccounts)
    .set({
      balance: updatedReceiverBalance.toFixed(2),
    })
    .where(eq(cbhAccounts.id, toAccountId));

  const referenceId = `CBH-${crypto.randomUUID()}`;

  await db.insert(cbhTransactions).values([
    {
      id: crypto.randomUUID(),
      accountId: fromAccountId,
      accountType: sender[0].accountType,
      amount: amount.toFixed(2),
      direction: "debit",
      method: "Internal",
      description:
        memo?.trim() || `Transfer to ${maskAccount(receiver[0].accountNumber)}`,
      referenceId,
      balanceAfter: updatedSenderBalance.toFixed(2),
      initiatedBy,
      status: "Completed",
    },
    {
      id: crypto.randomUUID(),
      accountId: toAccountId,
      accountType: receiver[0].accountType,
      amount: amount.toFixed(2),
      direction: "credit",
      method: "Internal",
      description:
        memo?.trim() ||
        `Transfer from ${maskAccount(sender[0].accountNumber)}`,
      referenceId,
      balanceAfter: updatedReceiverBalance.toFixed(2),
      initiatedBy,
      status: "Completed",
    },
  ]);

  return {
    success: true,
    referenceId,
    fromAccountId,
    toAccountId,
    amount: amount.toFixed(2),
    memo: memo?.trim() || null,
    fromBalanceAfter: updatedSenderBalance.toFixed(2),
    toBalanceAfter: updatedReceiverBalance.toFixed(2),
  };
}