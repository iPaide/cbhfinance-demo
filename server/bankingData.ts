export const BRAND_NAME = "CBHfinance";
export const PAYMENT_BLOCK_MESSAGE = "Unable to complete transaction. Please contact support.";
export const TRANSACTIONS_PER_PAGE = 25;
export const SESSION_WARNING_MINUTES = 13;
export const SESSION_TIMEOUT_MINUTES = 15;
export const FAILED_LOGIN_LOCKOUT_ATTEMPTS = 5;

export type AccountType = "Checking" | "Savings" | "IRA";
export type PaymentMethod = "ACH" | "Wire" | "Zelle" | "Bill Pay" | "Internal" | "Interest" | "Investment" | "Admin";
export type TransactionStatus = "Completed" | "Pending" | "Failed";
export type TransactionDirection = "credit" | "debit";
export type SupportCaseStatus = "New" | "In Review" | "Closed";

export type Account = {
  id: string;
  userId: string;
  type: AccountType;
  number: string;
  balance: number;
  openedAt: string;
  status: "Active" | "Suspended";
  apy?: number;
  ytdPerformance?: number;
};

export type Transaction = {
  id: string;
  accountId: string;
  accountType: AccountType;
  createdAt: string;
  description: string;
  method: PaymentMethod;
  referenceId: string;
  direction: TransactionDirection;
  amount: number;
  balanceAfter: number;
  status: TransactionStatus;
  initiatedBy: "seed" | "user" | "admin" | "system";
  adminId?: string;
};

export type Notification = {
  id: string;
  userId: string;
  message: string;
  type: "security" | "credit" | "statement" | "otp" | "session" | "system";
  read: boolean;
  createdAt: string;
};

export type AuditLog = {
  id: string;
  adminId: string;
  actionType: string;
  targetUserId: string;
  details: string;
  ipAddress: string;
  createdAt: string;
};

export type Statement = {
  id: string;
  accountId: string;
  accountType: AccountType;
  period: string;
  periodStart: string;
  periodEnd: string;
  fileUrl: string;
  generatedAt: string;
};

export type SupportCase = {
  id: string;
  caseNumber: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  status: SupportCaseStatus;
  createdAt: string;
  updatedAt: string;
};

export type DemoUser = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  mailingAddress: string;
  memberSince: string;
  routingNumber: string;
  status: "Active" | "Suspended" | "Locked";
  twoFaEnabled: boolean;
  failedLoginAttempts: number;
  lastLoginAt: string;
  lastLoginLocation: string;
};

export type AdminUser = {
  id: string;
  fullName: string;
  email: string;
  role: "admin";
};

export const demoCredentials = {
  userEmail: "emilyajohnson196@gmail.com",
  userPassword: "9233W@de1313",
  adminEmail: "admin@cbhfinance.online",
  adminPassword: "CBHAdmin!2026",
  otp: "246810",
};

const customer: DemoUser = {
  id: "usr_emily_ann_johnson",
  fullName: "Emily Ann Johnson",
  email: demoCredentials.userEmail,
  phone: "+1 (415) 555-0198",
  mailingAddress: "2128 Pacific Heights Avenue, San Francisco, CA 94115",
  memberSince: "March 2019",
  routingNumber: "121000248",
  status: "Active",
  twoFaEnabled: true,
  failedLoginAttempts: 0,
  lastLoginAt: new Date("2026-05-09T14:18:00.000Z").toISOString(),
  lastLoginLocation: "San Francisco, CA",
};

const admin: AdminUser = {
  id: "adm_primary",
  fullName: "CBHfinance Operations Admin",
  email: demoCredentials.adminEmail,
  role: "admin",
};

const accounts: Account[] = [
  { id: "acc_checking", userId: customer.id, type: "Checking", number: "CHK-483100", balance: 62288.72, openedAt: "2019-03-12", status: "Active" },
  { id: "acc_savings", userId: customer.id, type: "Savings", number: "SAV-720400", balance: 116039.59, openedAt: "2019-03-12", status: "Active", apy: 3.85 },
  { id: "acc_ira", userId: customer.id, type: "IRA", number: "IRA-931700", balance: 436892.55, openedAt: "2019-03-12", status: "Active", ytdPerformance: 7.42 },
];

const finalBalances: Record<AccountType, number> = {
  Checking: 62288.72,
  Savings: 116039.59,
  IRA: 436892.55,
};

function monthRange(startYear: number, startMonthZeroBased: number, end: Date) {
  const months: { year: number; month: number }[] = [];
  const cursor = new Date(Date.UTC(startYear, startMonthZeroBased, 1));
  const stop = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 1));
  while (cursor <= stop) {
    months.push({ year: cursor.getUTCFullYear(), month: cursor.getUTCMonth() + 1 });
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }
  return months;
}

function ref(prefix: string, index: number) {
  return `${prefix}-${String(index).padStart(6, "0")}`;
}

function makeSeedTransactions() {
  const now = new Date();
  const months = monthRange(2024, 0, now);
  const entries: Omit<Transaction, "balanceAfter">[] = [];
  let i = 1;
  for (const { year, month } of months) {
    const mm = String(month).padStart(2, "0");
    const daysInMonth = new Date(year, month, 0).getDate();
    
    // Generate ~25 transactions per month for 5+ pages (125+ records)
    for (let day = 1; day <= daysInMonth; day += 2) {
      const dd = String(day).padStart(2, "0");
      const hour = 8 + (day % 16);
      const minute = (day * 7) % 60;
      
      // Payroll deposits (twice monthly)
      if (day === 1 || day === 15) {
        entries.push({ id: `txn_${i}`, accountId: "acc_checking", accountType: "Checking", createdAt: `${year}-${mm}-${dd}T${String(hour).padStart(2, "0")}:15:00.000Z`, description: "ACH Payroll Direct Deposit — Northstar Design Group", method: "ACH", referenceId: ref("ACH", i++), direction: "credit", amount: 8420.18, status: "Completed", initiatedBy: "seed" });
      }
      
      // Rent payment
      if (day === 3) {
        entries.push({ id: `txn_${i}`, accountId: "acc_checking", accountType: "Checking", createdAt: `${year}-${mm}-${dd}T16:20:00.000Z`, description: "Bill Pay — Pacific Heights Rent", method: "Bill Pay", referenceId: ref("BILL", i++), direction: "debit", amount: 3925.00, status: "Completed", initiatedBy: "seed" });
      }
      
      // Groceries and shopping
      entries.push({ id: `txn_${i}`, accountId: "acc_checking", accountType: "Checking", createdAt: `${year}-${mm}-${dd}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00.000Z`, description: day % 3 === 0 ? "Whole Foods Market" : day % 3 === 1 ? "Target Purchase" : "Trader Joe's", method: "Bill Pay", referenceId: ref("SHOP", i++), direction: "debit", amount: 45.50 + (day * 3.2), status: "Completed", initiatedBy: "seed" });
      
      // Utilities and subscriptions
      if (day % 7 === 0) {
        entries.push({ id: `txn_${i}`, accountId: "acc_checking", accountType: "Checking", createdAt: `${year}-${mm}-${dd}T15:04:00.000Z`, description: "Utility Payment — City Power and Water", method: "Bill Pay", referenceId: ref("UTIL", i++), direction: "debit", amount: 246.81, status: "Completed", initiatedBy: "seed" });
      }
      
      // Transfers to savings
      if (day % 9 === 0) {
        entries.push({ id: `txn_${i}`, accountId: "acc_checking", accountType: "Checking", createdAt: `${year}-${mm}-${dd}T20:12:00.000Z`, description: "Internal Transfer to Savings", method: "Internal", referenceId: ref("INT", i++), direction: "debit", amount: 1800.00, status: "Completed", initiatedBy: "seed" });
        entries.push({ id: `txn_${i}`, accountId: "acc_savings", accountType: "Savings", createdAt: `${year}-${mm}-${dd}T20:12:05.000Z`, description: "Internal Transfer from Checking", method: "Internal", referenceId: ref("INT", i++), direction: "credit", amount: 1800.00, status: "Completed", initiatedBy: "seed" });
      }
      
      // Wire transfers
      if (day % 11 === 0) {
        entries.push({ id: `txn_${i}`, accountId: "acc_checking", accountType: "Checking", createdAt: `${year}-${mm}-${dd}T17:35:00.000Z`, description: "Wire Transfer Outbound — Escrow Services", method: "Wire", referenceId: ref("WIRE", i++), direction: "debit", amount: 1250.00 + (day * 50), status: "Completed", initiatedBy: "seed" });
      }
      
      // Zelle transfers
      if (day % 13 === 0) {
        entries.push({ id: `txn_${i}`, accountId: "acc_checking", accountType: "Checking", createdAt: `${year}-${mm}-${dd}T19:42:00.000Z`, description: "Zelle Sent — Friend Payment", method: "Zelle", referenceId: ref("ZEL", i++), direction: "debit", amount: 50.00 + (day * 2), status: "Completed", initiatedBy: "seed" });
      }
    }
    
    // Monthly interest and investment credits
    entries.push({ id: `txn_${i}`, accountId: "acc_savings", accountType: "Savings", createdAt: `${year}-${mm}-28T09:00:00.000Z`, description: "Savings Interest Credit", method: "Interest", referenceId: ref("INTCR", i++), direction: "credit", amount: 285.34 + month, status: "Completed", initiatedBy: "system" });
    entries.push({ id: `txn_${i}`, accountId: "acc_ira", accountType: "IRA", createdAt: `${year}-${mm}-28T21:30:00.000Z`, description: month % 3 === 0 ? "IRA Dividend Reinvestment" : "IRA Market Gain Entry", method: "Investment", referenceId: ref("IRA", i++), direction: "credit", amount: 2140.75 + month * 14, status: "Completed", initiatedBy: "system" });
  }

  const grouped: Record<AccountType, Omit<Transaction, "balanceAfter">[]> = { Checking: [], Savings: [], IRA: [] };
  entries.forEach(entry => grouped[entry.accountType].push(entry));
  const completed: Transaction[] = [];
  for (const type of Object.keys(grouped) as AccountType[]) {
    const accountEntries = grouped[type].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    const net = accountEntries.reduce((sum, entry) => sum + (entry.direction === "credit" ? entry.amount : -entry.amount), 0);
    let running = Number((finalBalances[type] - net).toFixed(2));
    for (const entry of accountEntries) {
      running = Number((running + (entry.direction === "credit" ? entry.amount : -entry.amount)).toFixed(2));
      completed.push({ ...entry, balanceAfter: running });
    }
  }
  const sorted = completed.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  console.log(`[Banking] Generated ${sorted.length} seeded transactions`);
  return sorted;
}

let transactions: Transaction[] = makeSeedTransactions();
const initialNotifications: Notification[] = [
  { id: "not_1", userId: customer.id, message: "Email OTP delivered for secure sign-in.", type: "otp", read: false, createdAt: new Date().toISOString() },
  { id: "not_2", userId: customer.id, message: "New January 2025 through current statements are available.", type: "statement", read: false, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "not_3", userId: customer.id, message: "Session timeout warning is configured for 13 minutes of inactivity.", type: "session", read: true, createdAt: new Date(Date.now() - 172800000).toISOString() },
  { id: "not_4", userId: customer.id, message: "Password change confirmation recorded for the profile security center.", type: "security", read: true, createdAt: new Date(Date.now() - 259200000).toISOString() },
  { id: "not_5", userId: customer.id, message: "Failed login attempt detected and reviewed by CBHfinance security controls.", type: "security", read: true, createdAt: new Date(Date.now() - 345600000).toISOString() },
  { id: "not_6", userId: customer.id, message: "Incoming admin credit notification channel is enabled for ledger updates.", type: "credit", read: true, createdAt: new Date(Date.now() - 432000000).toISOString() },
];
let notifications: Notification[] = initialNotifications.map(notification => ({ ...notification }));
let auditLogs: AuditLog[] = [
  { id: "audit_1", adminId: admin.id, actionType: "SEED", targetUserId: customer.id, details: "Seeded Emily Ann Johnson banking profile and starting transaction ledger.", ipAddress: "127.0.0.1", createdAt: new Date("2025-01-01T00:00:00.000Z").toISOString() },
];
let supportCases: SupportCase[] = [];

function pdfEscape(value: string) {
  return value.replace(/[\()]/g, "\$&").replace(/[^\x20-\x7E]/g, "-");
}

function createPdfDataUrl(lines: string[]) {
  const content = ["BT", "/F1 18 Tf", "72 742 Td", ...lines.flatMap((line, index) => [index === 0 ? "" : "0 -24 Td", `(${pdfEscape(line)}) Tj`]).filter(Boolean), "ET"].join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${Buffer.byteLength(content, "binary")} >>\nstream\n${content}\nendstream`,
  ];
  let body = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(body, "binary"));
    body += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = Buffer.byteLength(body, "binary");
  body += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  body += offsets.slice(1).map(offset => `${String(offset).padStart(10, "0")} 00000 n \n`).join("");
  body += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return `data:application/pdf;base64,${Buffer.from(body, "binary").toString("base64")}`;
}

function createStatementPdfUrl(account: Account, period: string, periodStart: string, periodEnd: string) {
  const monthlyTransactions = transactions
    .filter(transaction => transaction.accountId === account.id && transaction.createdAt >= periodStart && transaction.createdAt <= periodEnd)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const credits = monthlyTransactions.filter(transaction => transaction.direction === "credit").reduce((sum, transaction) => sum + transaction.amount, 0);
  const debits = monthlyTransactions.filter(transaction => transaction.direction === "debit").reduce((sum, transaction) => sum + transaction.amount, 0);
  const openingBalance = monthlyTransactions[0] ? Number((monthlyTransactions[0].balanceAfter - (monthlyTransactions[0].direction === "credit" ? monthlyTransactions[0].amount : -monthlyTransactions[0].amount)).toFixed(2)) : account.balance;
  const closingBalance = monthlyTransactions.at(-1)?.balanceAfter ?? account.balance;
  const preview = monthlyTransactions.slice(0, 6).map(transaction => `${transaction.createdAt.slice(0, 10)} ${transaction.direction === "credit" ? "+" : "-"}$${transaction.amount.toFixed(2)} ${transaction.description.slice(0, 58)}`);
  return createPdfDataUrl([
    "CBHfinance Online Banking",
    `Monthly Statement - ${period}`,
    `Client: ${customer.fullName}`,
    `Account: ${account.type} ${account.number}`,
    `Period: ${periodStart.slice(0, 10)} through ${periodEnd.slice(0, 10)}`,
    `Opening balance: $${openingBalance.toFixed(2)}`,
    `Credits: $${credits.toFixed(2)}   Debits: $${debits.toFixed(2)}`,
    `Closing balance: $${closingBalance.toFixed(2)}`,
    `Transactions shown: ${monthlyTransactions.length}`,
    ...preview,
    "Generated by CBHfinance for secure client review.",
  ]);
}

function createStatements(): Statement[] {
  return accounts.flatMap(account => monthRange(2025, 0, new Date()).map(({ year, month }) => {
    const start = new Date(Date.UTC(year, month - 1, 1));
    const end = new Date(Date.UTC(year, month, 0));
    const period = `${year}-${String(month).padStart(2, "0")}`;
    return {
      id: `stmt_${account.id}_${period}`,
      accountId: account.id,
      accountType: account.type,
      period,
      periodStart: start.toISOString(),
      periodEnd: end.toISOString(),
      fileUrl: createStatementPdfUrl(account, period, start.toISOString(), end.toISOString()),
      generatedAt: new Date(Date.UTC(year, month, 1, 3, 0, 0)).toISOString(),
    };
  }));
}

let statements = createStatements();

export function getSecurityPolicy() {
  return {
    sessionWarningMinutes: SESSION_WARNING_MINUTES,
    sessionTimeoutMinutes: SESSION_TIMEOUT_MINUTES,
    failedLoginLockoutAttempts: FAILED_LOGIN_LOCKOUT_ATTEMPTS,
    paymentBlockMessage: PAYMENT_BLOCK_MESSAGE,
    transactionsPerPage: TRANSACTIONS_PER_PAGE,
  };
}

export function getCustomer() {
  return { ...customer };
}

export function getAdmin() {
  return { ...admin };
}

export function getAccounts() {
  return accounts.map(account => ({ ...account }));
}

export function getTransactions(input?: { page?: number; accountType?: AccountType | "All"; method?: PaymentMethod | "All"; status?: TransactionStatus | "All"; search?: string }) {
  const page = Math.max(1, input?.page ?? 1);
  console.log(`[Banking] getTransactions: page=${page}, total_txns=${transactions.length}`);
  let filtered = transactions.slice();
  if (input?.accountType && input.accountType !== "All") filtered = filtered.filter(t => t.accountType === input.accountType);
  if (input?.method && input.method !== "All") filtered = filtered.filter(t => t.method === input.method);
  if (input?.status && input.status !== "All") filtered = filtered.filter(t => t.status === input.status);
  if (input?.search?.trim()) {
    const q = input.search.trim().toLowerCase();
    filtered = filtered.filter(t => t.description.toLowerCase().includes(q) || t.referenceId.toLowerCase().includes(q));
  }
  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / TRANSACTIONS_PER_PAGE));
  const rows = filtered.slice((page - 1) * TRANSACTIONS_PER_PAGE, page * TRANSACTIONS_PER_PAGE);
  return { rows, total, page, pageCount, pageSize: TRANSACTIONS_PER_PAGE };
}

export function getDashboardSummary() {
  const accountRows = getAccounts();
  const totalNetWorth = Number(accountRows.reduce((sum, account) => sum + account.balance, 0).toFixed(2));
  return {
    brandName: BRAND_NAME,
    customer: getCustomer(),
    accounts: accountRows,
    totalNetWorth,
    recentTransactions: getTransactions({ page: 1 }).rows.slice(0, 5),
    notifications: notifications.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    unreadNotifications: notifications.filter(n => !n.read).length,
    security: getSecurityPolicy(),
  };
}

export function blockOutgoingPayment() {
  return { blocked: true as const, message: PAYMENT_BLOCK_MESSAGE };
}

export function transferBetweenAccounts(input: {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  memo?: string;
}) {
  const fromAccount = accounts.find(row => row.id === input.fromAccountId);
  const toAccount = accounts.find(row => row.id === input.toAccountId);

  if (!fromAccount) throw new Error("Source account not found.");
  if (!toAccount) throw new Error("Destination account not found.");
  if (fromAccount.id === toAccount.id) {
    throw new Error("Source and destination accounts must be different.");
  }

  if (fromAccount.userId !== toAccount.userId) {
    throw new Error("Can only transfer between your own accounts.");
  }

  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    throw new Error("Amount must be greater than zero.");
  }

  if (input.amount > fromAccount.balance) {
    throw new Error("Insufficient funds for transfer.");
  }

  const allowedTypes: AccountType[] = ["Checking", "Savings"];

  if (
    !allowedTypes.includes(fromAccount.type) ||
    !allowedTypes.includes(toAccount.type)
  ) {
    throw new Error(
      "Transfers are only allowed between Checking and Savings accounts."
    );
  }

  const referenceId = ref("INT", transactions.length + 1);
  const now = new Date().toISOString();
  const memo = input.memo?.trim() || "Internal transfer";

  fromAccount.balance = Number(
    (fromAccount.balance - input.amount).toFixed(2)
  );

  toAccount.balance = Number(
    (toAccount.balance + input.amount).toFixed(2)
  );

  finalBalances[fromAccount.type] = fromAccount.balance;
  finalBalances[toAccount.type] = toAccount.balance;

  const debitTxn: Transaction = {
    id: `txn_${Date.now()}_debit`,
    accountId: fromAccount.id,
    accountType: fromAccount.type,
    createdAt: now,
    description: `Internal Transfer to ${toAccount.type} — ${memo}`,
    method: "Internal",
    referenceId,
    direction: "debit",
    amount: Number(input.amount.toFixed(2)),
    balanceAfter: fromAccount.balance,
    status: "Completed",
    initiatedBy: "user",
  };

  const creditTxn: Transaction = {
    id: `txn_${Date.now()}_credit`,
    accountId: toAccount.id,
    accountType: toAccount.type,
    createdAt: now,
    description: `Internal Transfer from ${fromAccount.type} — ${memo}`,
    method: "Internal",
    referenceId,
    direction: "credit",
    amount: Number(input.amount.toFixed(2)),
    balanceAfter: toAccount.balance,
    status: "Completed",
    initiatedBy: "user",
  };

  transactions = [creditTxn, debitTxn, ...transactions];

  notifications = [
    {
      id: `not_${Date.now()}`,
      userId: fromAccount.userId,
      message: `Transfer of $${input.amount.toFixed(
        2
      )} from ${fromAccount.type} to ${toAccount.type} completed.`,
      type: "system",
      read: false,
      createdAt: now,
    },
    ...notifications,
  ];

  return {
    success: true as const,
    referenceId,
    amount: Number(input.amount.toFixed(2)),
    memo,
    fromAccountId: fromAccount.id,
    toAccountId: toAccount.id,
    fromBalanceAfter: fromAccount.balance,
    toBalanceAfter: toAccount.balance,
    debitTransaction: debitTxn,
    creditTransaction: creditTxn,
  };
}

export function adminAdjustBalance(input: { action: "Credit" | "Debit"; accountId: string; amount: number; description: string; adminId?: string; ipAddress?: string }) {
  const account = accounts.find(row => row.id === input.accountId);
  if (!account) throw new Error("Account not found.");
  if (!input.description.trim()) throw new Error("Description is required.");
  if (!Number.isFinite(input.amount) || input.amount <= 0) throw new Error("Amount must be greater than zero.");
  if (input.action === "Debit" && input.amount > account.balance) throw new Error("Admin debit cannot exceed the current account balance.");

  account.balance = Number((account.balance + (input.action === "Credit" ? input.amount : -input.amount)).toFixed(2));
  finalBalances[account.type] = account.balance;
  const id = `txn_admin_${Date.now()}`;
  const transaction: Transaction = {
    id,
    accountId: account.id,
    accountType: account.type,
    createdAt: new Date().toISOString(),
    description: `Admin ${input.action} — ${input.description.trim()}`,
    method: "Admin",
    referenceId: ref(input.action === "Credit" ? "ADMCR" : "ADMDB", transactions.length + 1),
    direction: input.action === "Credit" ? "credit" : "debit",
    amount: Number(input.amount.toFixed(2)),
    balanceAfter: account.balance,
    status: "Completed",
    initiatedBy: "admin",
    adminId: input.adminId ?? admin.id,
  };
  transactions = [transaction, ...transactions];
  const audit: AuditLog = {
    id: `audit_${Date.now()}`,
    adminId: input.adminId ?? admin.id,
    actionType: input.action.toUpperCase(),
    targetUserId: customer.id,
    details: `${input.action} ${account.type} ${account.number} by $${input.amount.toFixed(2)}. Reason: ${input.description.trim()}. New balance: $${account.balance.toFixed(2)}.`,
    ipAddress: input.ipAddress ?? "127.0.0.1",
    createdAt: new Date().toISOString(),
  };
  auditLogs = [audit, ...auditLogs];
  if (input.action === "Credit") {
    notifications = [{ id: `not_${Date.now()}`, userId: customer.id, message: `Incoming admin credit of $${input.amount.toFixed(2)} posted to ${account.type}.`, type: "credit", read: false, createdAt: new Date().toISOString() }, ...notifications];
  }
  return { account: { ...account }, transaction, audit };
}

export function getAdminOverview() {
  return {
    totalUsers: 1,
    totalDeposits: Number(accounts.reduce((sum, account) => sum + account.balance, 0).toFixed(2)),
    totalTransactionsToday: transactions.filter(t => t.createdAt.slice(0, 10) === new Date().toISOString().slice(0, 10)).length,
    pendingReviews: transactions.filter(t => t.status === "Pending").length + supportCases.filter(ticket => ticket.status !== "Closed").length,
    openSupportCases: supportCases.filter(ticket => ticket.status !== "Closed").length,
    customer: getCustomer(),
    accounts: getAccounts(),
    recentActivity: auditLogs.slice(0, 10),
    systemStatus: [
      { label: "Core ledger", status: "Operational" },
      { label: "Outgoing payments", status: "Blocked by policy" },
      { label: "Statement archive", status: "PDF downloads available" },
      { label: "Support cases", status: supportCases.length ? `${supportCases.length} captured` : "Ready" },
    ],
  };
}

export function getAuditLogs() {
  return auditLogs.map(log => ({ ...log }));
}

export function createSupportCase(input: { fullName: string; email: string; subject: string; message: string }) {
  const fullName = input.fullName.trim();
  const email = input.email.trim().toLowerCase();
  const subject = input.subject.trim();
  const message = input.message.trim();
  if (!fullName || !email || !subject || !message) throw new Error("All support case fields are required.");
  const now = new Date().toISOString();
  const ticket: SupportCase = {
    id: `case_${Date.now()}`,
    caseNumber: `CBH-${new Date().getUTCFullYear()}-${String(supportCases.length + 1).padStart(5, "0")}`,
    fullName,
    email,
    subject,
    message,
    status: "New",
    createdAt: now,
    updatedAt: now,
  };
  supportCases = [ticket, ...supportCases];
  auditLogs = [{ id: `audit_support_${Date.now()}`, adminId: "system", actionType: "SUPPORT_CASE_CREATED", targetUserId: customer.id, details: `${ticket.caseNumber} submitted by ${fullName}: ${subject}.`, ipAddress: "127.0.0.1", createdAt: now }, ...auditLogs];
  notifications = [{ id: `not_support_${Date.now()}`, userId: customer.id, message: `Support case ${ticket.caseNumber} has been received by CBHfinance.`, type: "system", read: false, createdAt: now }, ...notifications];
  return { ...ticket };
}

export function getSupportCases() {
  return supportCases.map(ticket => ({ ...ticket }));
}

export function updateSupportCaseStatus(input: { id: string; status: SupportCaseStatus; adminId?: string; ipAddress?: string }) {
  const ticket = supportCases.find(row => row.id === input.id);
  if (!ticket) throw new Error("Support case not found.");
  ticket.status = input.status;
  ticket.updatedAt = new Date().toISOString();
  auditLogs = [{ id: `audit_support_status_${Date.now()}`, adminId: input.adminId ?? admin.id, actionType: `SUPPORT_${input.status.toUpperCase().replace(/ /g, "_")}`, targetUserId: customer.id, details: `${ticket.caseNumber} status changed to ${input.status}.`, ipAddress: input.ipAddress ?? "127.0.0.1", createdAt: ticket.updatedAt }, ...auditLogs];
  return { ...ticket };
}

export function getNotifications() {
  return notifications.map(notification => ({ ...notification }));
}

export function getStatements() {
  return statements.map(statement => ({ ...statement }));
}

export function getPaymentSettings() {
  return {
    globalOutgoingPaymentsEnabled: false,
    perUserOutgoingPaymentsEnabled: false,
    dailyTransferLimit: 0,
    wireLimit: 0,
    zelleLimit: 0,
    billPayLimit: 0,
    maintenanceNotice: PAYMENT_BLOCK_MESSAGE,
  };
}

export function getSeedCoverage() {
  const methods = Array.from(new Set(transactions.map(transaction => transaction.method))).sort();
  const sorted = transactions.slice().sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  return {
    firstTransactionDate: sorted[0]?.createdAt.slice(0, 10),
    latestTransactionDate: sorted[sorted.length - 1]?.createdAt.slice(0, 10),
    methods,
    statementStart: statements.slice().sort((a, b) => new Date(a.periodStart).getTime() - new Date(b.periodStart).getTime())[0]?.period,
    transactionCount: transactions.length,
  };
}

export function setCustomerStatus(input: { status: "Active" | "Suspended" | "Locked"; adminId?: string; ipAddress?: string }) {
  customer.status = input.status;
  const audit: AuditLog = {
    id: `audit_status_${Date.now()}`,
    adminId: input.adminId ?? admin.id,
    actionType: `STATUS_${input.status.toUpperCase()}`,
    targetUserId: customer.id,
    details: `Customer status changed to ${input.status}.`,
    ipAddress: input.ipAddress ?? "127.0.0.1",
    createdAt: new Date().toISOString(),
  };
  auditLogs = [audit, ...auditLogs];
  notifications = [{ id: `not_status_${Date.now()}`, userId: customer.id, message: `Account status changed to ${input.status} by CBHfinance operations.`, type: "security", read: false, createdAt: new Date().toISOString() }, ...notifications];
  return { customer: getCustomer(), audit };
}

export function recordSessionWarningNotification() {
  notifications = [{ id: `not_session_${Date.now()}`, userId: customer.id, message: "Session timeout warning triggered at exactly 13 minutes of inactivity.", type: "session", read: false, createdAt: new Date().toISOString() }, ...notifications];
  return notifications[0];
}

export function recordPasswordChangeNotification() {
  notifications = [{ id: `not_password_${Date.now()}`, userId: customer.id, message: "Password change notification recorded for Emily Ann Johnson.", type: "security", read: false, createdAt: new Date().toISOString() }, ...notifications];
  return notifications[0];
}

export function attemptCredentialLogin(input: { email: string; password: string; role: "user" | "admin" }) {
  const normalized = input.email.trim().toLowerCase();
  const validUser = input.role === "user" && normalized === demoCredentials.userEmail && input.password === demoCredentials.userPassword;
  const validAdmin = input.role === "admin" && normalized === demoCredentials.adminEmail && input.password === demoCredentials.adminPassword;
  if (customer.status === "Locked") {
    return { success: false as const, locked: true, message: "Account locked after 5 failed attempts." };
  }
  if (!validUser && !validAdmin) {
    customer.failedLoginAttempts += input.role === "user" ? 1 : 0;
    if (customer.failedLoginAttempts >= FAILED_LOGIN_LOCKOUT_ATTEMPTS) customer.status = "Locked";
    notifications = [{ id: `not_fail_${Date.now()}`, userId: customer.id, message: "Failed login attempt detected.", type: "security", read: false, createdAt: new Date().toISOString() }, ...notifications];
    return { success: false as const, locked: customer.status === "Locked", message: customer.status === "Locked" ? "Account locked after 5 failed attempts." : "Invalid credentials." };
  }
  if (input.role === "user") customer.failedLoginAttempts = 0;
  notifications = [{ id: `not_otp_${Date.now()}`, userId: customer.id, message: "Email OTP delivered for secure sign-in.", type: "otp", read: false, createdAt: new Date().toISOString() }, ...notifications];
  return { success: true as const, requiresOtp: true, otpDelivery: "email", demoOtp: demoCredentials.otp };
}

export function verifyOtp(input: { role: "user" | "admin"; otp: string }) {
  if (input.otp !== demoCredentials.otp) return { success: false as const, message: "Invalid OTP." };
  customer.lastLoginAt = new Date().toISOString();
  notifications = [{ id: `not_login_${Date.now()}`, userId: customer.id, message: "Successful login recorded for Emily Ann Johnson.", type: "security", read: false, createdAt: new Date().toISOString() }, ...notifications];
  return {
    success: true as const,
    token: input.role === "admin" ? "cbh-admin-demo-token" : "cbh-user-demo-token",
    role: input.role,
    user: input.role === "admin" ? getAdmin() : getCustomer(),
    expiresInMinutes: SESSION_TIMEOUT_MINUTES,
  };
}

export function resetDemoStateForTests() {
  accounts[0].balance = 62288.72;
  accounts[1].balance = 116039.59;
  accounts[2].balance = 436892.55;
  finalBalances.Checking = 62288.72;
  finalBalances.Savings = 116039.59;
  finalBalances.IRA = 436892.55;
  customer.status = "Active";
  customer.failedLoginAttempts = 0;
  transactions = makeSeedTransactions();
  notifications = initialNotifications.map(notification => ({ ...notification }));
  auditLogs = auditLogs.slice(-1);
  supportCases = [];
  statements = createStatements();
}
