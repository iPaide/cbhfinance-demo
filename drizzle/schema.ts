import {
  decimal,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const cbhCustomers = mysqlTable("cbh_customers", {
  id: varchar("id", { length: 64 }).primaryKey(),
  fullName: varchar("full_name", { length: 160 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 64 }).notNull(),
  mailingAddress: text("mailing_address").notNull(),
  memberSince: varchar("member_since", { length: 64 }).notNull(),
  routingNumber: varchar("routing_number", { length: 32 }).notNull(),
  status: mysqlEnum("status", ["Active", "Suspended", "Locked"]).default("Active").notNull(),
  twoFaEnabled: int("two_fa_enabled").default(1).notNull(),
  failedLoginAttempts: int("failed_login_attempts").default(0).notNull(),
  lastLoginAt: timestamp("last_login_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cbhAccounts = mysqlTable("cbh_accounts", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("user_id", { length: 64 }).notNull(),
  accountType: mysqlEnum("account_type", ["Checking", "Savings", "IRA"]).notNull(),
  accountNumber: varchar("account_number", { length: 32 }).notNull().unique(),
  balance: decimal("balance", { precision: 14, scale: 2 }).notNull(),
  openedAt: timestamp("opened_at").notNull(),
  status: mysqlEnum("account_status", ["Active", "Suspended"]).default("Active").notNull(),
});

export const cbhTransactions = mysqlTable("cbh_transactions", {
  id: varchar("id", { length: 80 }).primaryKey(),
  accountId: varchar("account_id", { length: 64 }).notNull(),
  accountType: mysqlEnum("txn_account_type", ["Checking", "Savings", "IRA"]).notNull(),
  amount: decimal("amount", { precision: 14, scale: 2 }).notNull(),
  direction: mysqlEnum("direction", ["credit", "debit"]).notNull(),
  method: mysqlEnum("method", ["ACH", "Wire", "Zelle", "Bill Pay", "Internal", "Interest", "Investment", "Admin"]).notNull(),
  description: text("description").notNull(),
  referenceId: varchar("reference_id", { length: 64 }).notNull().unique(),
  balanceAfter: decimal("balance_after", { precision: 14, scale: 2 }).notNull(),
  status: mysqlEnum("txn_status", ["Completed", "Pending", "Failed"]).default("Completed").notNull(),
  initiatedBy: varchar("initiated_by", { length: 64 }).notNull(),
  adminId: varchar("admin_id", { length: 64 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cbhAdminLogs = mysqlTable("cbh_admin_logs", {
  id: varchar("id", { length: 80 }).primaryKey(),
  adminId: varchar("admin_id", { length: 64 }).notNull(),
  actionType: varchar("action_type", { length: 64 }).notNull(),
  targetUserId: varchar("target_user_id", { length: 64 }).notNull(),
  details: text("details").notNull(),
  ipAddress: varchar("ip_address", { length: 64 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cbhNotifications = mysqlTable("cbh_notifications", {
  id: varchar("id", { length: 80 }).primaryKey(),
  userId: varchar("user_id", { length: 64 }).notNull(),
  message: text("message").notNull(),
  type: varchar("type", { length: 40 }).notNull(),
  readStatus: int("read_status").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cbhStatements = mysqlTable("cbh_statements", {
  id: varchar("id", { length: 100 }).primaryKey(),
  accountId: varchar("account_id", { length: 64 }).notNull(),
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  fileUrl: text("file_url").notNull(),
  generatedAt: timestamp("generated_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
