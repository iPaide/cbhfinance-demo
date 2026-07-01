import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, cbhAccounts, cbhTransactions } from "../drizzle/schema.js";
import { ENV } from './_core/env.js';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.

export async function getAccountsByUser(userId: string) {
  const db = await getDb();

  if (!db) {
    throw new Error("Database unavailable");
  }

  return await db
    .select()
    .from(cbhAccounts)
    .where(eq(cbhAccounts.userId, userId));
}

export async function getTransactionsByAccount(accountId: string) {
  const db = await getDb();

  if (!db) {
    throw new Error("Database unavailable");
  }

  return await db
    .select()
    .from(cbhTransactions)
    .where(eq(cbhTransactions.accountId, accountId));
}

export async function transferFunds({
  fromAccountId,
  toAccountId,
  amount,
  initiatedBy,
}: {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  initiatedBy: string;
}) {
  const db = await getDb();

  if (!db) {
    throw new Error("Database unavailable");
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

  if (!sender[0] || !receiver[0]) {
    throw new Error("Account not found");
  }

  const senderBalance = Number(sender[0].balance);

  if (senderBalance < amount) {
    throw new Error("Insufficient funds");
  }

  const updatedSenderBalance = senderBalance - amount;
  const updatedReceiverBalance =
    Number(receiver[0].balance) + amount;

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

  const referenceId = crypto.randomUUID();

  await db.insert(cbhTransactions).values([
    {
      id: crypto.randomUUID(),
      accountId: fromAccountId,
      accountType: sender[0].accountType,
      amount: amount.toFixed(2),
      direction: "debit",
      method: "Internal",
      description: `Transfer to ${receiver[0].accountNumber}`,
      referenceId: `${referenceId}-debit`,
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
      description: `Transfer from ${sender[0].accountNumber}`,
      referenceId: `${referenceId}-credit`,
      balanceAfter: updatedReceiverBalance.toFixed(2),
      initiatedBy,
      status: "Completed",
    },
  ]);

  return {
    success: true,
    referenceId,
  };
}
