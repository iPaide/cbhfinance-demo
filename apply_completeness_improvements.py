from pathlib import Path

project = Path('/home/ubuntu/cbhfinance-demo')
data_path = project / 'server/bankingData.ts'
router_path = project / 'server/routers.ts'
app_path = project / 'client/src/pages/CBHFinanceApp.tsx'
test_path = project / 'server/bankingData.test.ts'

def replace_once(text: str, old: str, new: str, label: str) -> str:
    if old not in text:
        raise RuntimeError(f'Missing {label}')
    return text.replace(old, new, 1)

# Backend data layer.
data = data_path.read_text()
data = replace_once(data, 'export type TransactionDirection = "credit" | "debit";\n', 'export type TransactionDirection = "credit" | "debit";\nexport type SupportCaseStatus = "New" | "In Review" | "Closed";\n', 'support status type')
data = replace_once(data, '''export type Statement = {
  id: string;
  accountId: string;
  accountType: AccountType;
  period: string;
  periodStart: string;
  periodEnd: string;
  fileUrl: string;
  generatedAt: string;
};
''', '''export type Statement = {
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
''', 'statement type block')
data = replace_once(data, '''let auditLogs: AuditLog[] = [
  { id: "audit_1", adminId: admin.id, actionType: "SEED", targetUserId: customer.id, details: "Seeded Emily Ann Johnson banking profile and starting transaction ledger.", ipAddress: "127.0.0.1", createdAt: new Date("2025-01-01T00:00:00.000Z").toISOString() },
];

function createStatements(): Statement[] {
''', '''let auditLogs: AuditLog[] = [
  { id: "audit_1", adminId: admin.id, actionType: "SEED", targetUserId: customer.id, details: "Seeded Emily Ann Johnson banking profile and starting transaction ledger.", ipAddress: "127.0.0.1", createdAt: new Date("2025-01-01T00:00:00.000Z").toISOString() },
];
let supportCases: SupportCase[] = [];

function pdfEscape(value: string) {
  return value.replace(/[\\()]/g, "\\$&").replace(/[^\\x20-\\x7E]/g, "-");
}

function createPdfDataUrl(lines: string[]) {
  const content = ["BT", "/F1 18 Tf", "72 742 Td", ...lines.flatMap((line, index) => [index === 0 ? "" : "0 -24 Td", `(${pdfEscape(line)}) Tj`]).filter(Boolean), "ET"].join("\\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${Buffer.byteLength(content, "binary")} >>\\nstream\\n${content}\\nendstream`,
  ];
  let body = "%PDF-1.4\\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(body, "binary"));
    body += `${index + 1} 0 obj\\n${object}\\nendobj\\n`;
  });
  const xrefOffset = Buffer.byteLength(body, "binary");
  body += `xref\\n0 ${objects.length + 1}\\n0000000000 65535 f \\n`;
  body += offsets.slice(1).map(offset => `${String(offset).padStart(10, "0")} 00000 n \\n`).join("");
  body += `trailer\\n<< /Size ${objects.length + 1} /Root 1 0 R >>\\nstartxref\\n${xrefOffset}\\n%%EOF`;
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
''', 'pdf helper insertion')
data = replace_once(data, '      fileUrl: `/statements/${account.number}-${period}.pdf`,', '      fileUrl: createStatementPdfUrl(account, period, start.toISOString(), end.toISOString()),', 'statement url')
data = replace_once(data, '''export function getAdminOverview() {
  return {
    totalUsers: 1,
    totalDeposits: Number(accounts.reduce((sum, account) => sum + account.balance, 0).toFixed(2)),
    totalTransactionsToday: transactions.filter(t => t.createdAt.slice(0, 10) === new Date().toISOString().slice(0, 10)).length,
    pendingReviews: transactions.filter(t => t.status === "Pending").length,
''', '''export function getAdminOverview() {
  return {
    totalUsers: 1,
    totalDeposits: Number(accounts.reduce((sum, account) => sum + account.balance, 0).toFixed(2)),
    totalTransactionsToday: transactions.filter(t => t.createdAt.slice(0, 10) === new Date().toISOString().slice(0, 10)).length,
    pendingReviews: transactions.filter(t => t.status === "Pending").length + supportCases.filter(ticket => ticket.status !== "Closed").length,
    openSupportCases: supportCases.filter(ticket => ticket.status !== "Closed").length,
''', 'overview stats')
data = replace_once(data, '      { label: "Statement archive", status: "Available" },\n', '      { label: "Statement archive", status: "PDF downloads available" },\n      { label: "Support cases", status: supportCases.length ? `${supportCases.length} captured` : "Ready" },\n', 'system status')
data = replace_once(data, '''export function getAuditLogs() {
  return auditLogs.map(log => ({ ...log }));
}
''', '''export function getAuditLogs() {
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
''', 'support functions')
data = replace_once(data, '''  notifications = initialNotifications.map(notification => ({ ...notification }));
  auditLogs = auditLogs.slice(-1);
  statements = createStatements();
''', '''  notifications = initialNotifications.map(notification => ({ ...notification }));
  auditLogs = auditLogs.slice(-1);
  supportCases = [];
  statements = createStatements();
''', 'reset support')
data_path.write_text(data)

# Router procedures.
router = router_path.read_text()
router = replace_once(router, '  adminAdjustBalance,\n  attemptCredentialLogin,\n  blockOutgoingPayment,\n', '  adminAdjustBalance,\n  attemptCredentialLogin,\n  blockOutgoingPayment,\n  createSupportCase,\n', 'router create import')
router = replace_once(router, '  getSeedCoverage,\n  getStatements,\n  getTransactions,\n', '  getSeedCoverage,\n  getStatements,\n  getSupportCases,\n  getTransactions,\n', 'router get support import')
router = replace_once(router, '  setCustomerStatus,\n  verifyOtp,\n', '  setCustomerStatus,\n  updateSupportCaseStatus,\n  verifyOtp,\n', 'router update import')
router = replace_once(router, 'const statusSchema = z.enum(["All", "Completed", "Pending", "Failed"]);\n', 'const statusSchema = z.enum(["All", "Completed", "Pending", "Failed"]);\nconst supportCaseStatusSchema = z.enum(["New", "In Review", "Closed"]);\n', 'router status schema')
router = replace_once(router, '''    statements: publicProcedure.query(() => getStatements()),
    recordSessionWarning: publicProcedure.mutation(() => recordSessionWarningNotification()),
''', '''    statements: publicProcedure.query(() => getStatements()),
    createSupportCase: publicProcedure
      .input(z.object({ fullName: z.string().min(2), email: z.string().email(), subject: z.string().min(3), message: z.string().min(10) }))
      .mutation(({ input }) => createSupportCase(input)),
    supportCases: publicProcedure
      .input(z.object({ token: z.string().optional() }))
      .query(({ input }) => {
        requireAdminToken(input.token);
        return getSupportCases();
      }),
    updateSupportCaseStatus: publicProcedure
      .input(z.object({ token: z.string().optional(), id: z.string().min(1), status: supportCaseStatusSchema }))
      .mutation(({ input, ctx }) => {
        requireAdminToken(input.token);
        return updateSupportCaseStatus({ id: input.id, status: input.status, ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || "127.0.0.1" });
      }),
    recordSessionWarning: publicProcedure.mutation(() => recordSessionWarningNotification()),
''', 'router support procedures')
router_path.write_text(router)

# Frontend.
app = app_path.read_text()
app = replace_once(app, '    ["/secure-admin", "Admin Dashboard"], ["/secure-admin?tab=users", "Users"], ["/secure-admin?tab=transactions", "Transactions"], ["/secure-admin?tab=payments", "Payment Settings"], ["/secure-admin?tab=audit", "Audit Log"]\n', '    ["/secure-admin", "Admin Dashboard"], ["/secure-admin?tab=users", "Users"], ["/secure-admin?tab=transactions", "Transactions"], ["/secure-admin?tab=support", "Support Cases"], ["/secure-admin?tab=payments", "Payment Settings"], ["/secure-admin?tab=audit", "Audit Log"]\n', 'admin nav')
app = replace_once(app, '''  const [email, setEmail] = useState(role === "admin" ? "admin@cbhfinance.online" : "emily.johnson@cbhfinance.online");
  const [password, setPassword] = useState(role === "admin" ? "CBHAdmin!2026" : "CBHUser!2026");
  const [otp, setOtp] = useState("246810");
''', '''  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showTestAccess, setShowTestAccess] = useState(false);
''', 'login state')
app = replace_once(app, '      setMessage("OTP sent by email. Use 246810 to continue.");\n', '      setMessage("OTP sent by email. Enter the six-digit verification code to continue.");\n', 'otp message')
app = replace_once(app, '''          <div className="mt-8 rounded-2xl border border-[#c9a84c]/40 bg-white p-5 text-sm text-slate-700"><strong>Access credentials:</strong><br />{role === "admin" ? "admin@cbhfinance.online / CBHAdmin!2026" : "emily.johnson@cbhfinance.online / CBHUser!2026"}<br />OTP: 246810</div>
''', '''          <div className="mt-8 rounded-2xl border border-[#c9a84c]/40 bg-white p-5 text-sm text-slate-700"><strong>Testing access:</strong><p className="mt-2">Credentials are hidden by default for a more realistic public experience.</p><button type="button" onClick={() => setShowTestAccess(!showTestAccess)} className="mt-4 rounded-full border border-[#0a1f44]/20 px-4 py-2 font-semibold">{showTestAccess ? "Hide test access" : "Show test access"}</button>{showTestAccess && <div className="mt-4 rounded-2xl bg-[#f8f6f1] p-4"><strong>Access credentials:</strong><br />{role === "admin" ? "admin@cbhfinance.online / CBHAdmin!2026" : "emily.johnson@cbhfinance.online / CBHUser!2026"}<br />OTP: 246810<button type="button" onClick={() => { setEmail(role === "admin" ? "admin@cbhfinance.online" : "emily.johnson@cbhfinance.online"); setPassword(role === "admin" ? "CBHAdmin!2026" : "CBHUser!2026"); setOtp("246810"); }} className="mt-3 block rounded-full bg-[#0a1f44] px-4 py-2 text-xs font-semibold text-white">Fill test credentials</button></div>}</div>
''', 'credential reveal block')
app = replace_once(app, '''function Statements({ rows }: { rows: any[] }) {
  return <Panel title="Monthly Statements"><p className="mb-5 text-slate-600">Monthly PDF statement records are available from January 2025 onward for each account. Download links are secure placeholders for the current environment.</p><div className="grid gap-3 md:grid-cols-3">{rows.slice(0, 36).map(row => <a key={row.id} href={row.fileUrl} className="flex items-center gap-3 rounded-2xl bg-[#f8f6f1] p-4 font-semibold"><FileText className="h-5 w-5 text-[#c9a84c]" />{row.accountType} · {row.period}</a>)}</div></Panel>;
}
''', '''function Statements({ rows }: { rows: any[] }) {
  return <Panel title="Monthly Statements"><p className="mb-5 text-slate-600">Monthly branded PDF statements are generated for each seeded account from January 2025 onward. Each link downloads a statement with account details, period totals, and transaction preview lines.</p><div className="grid gap-3 md:grid-cols-3">{rows.slice(0, 36).map(row => <a key={row.id} download={`CBHfinance-${row.accountType}-${row.period}.pdf`} href={row.fileUrl} className="flex items-center gap-3 rounded-2xl bg-[#f8f6f1] p-4 font-semibold"><FileText className="h-5 w-5 text-[#c9a84c]" />{row.accountType} · {row.period}</a>)}</div></Panel>;
}
''', 'statements component')
app = replace_once(app, '  const paymentSettings = trpc.banking.paymentSettings.useQuery();\n', '  const paymentSettings = trpc.banking.paymentSettings.useQuery();\n  const supportCases = trpc.banking.supportCases.useQuery({ token }, { enabled: Boolean(session && session.role === "admin") });\n', 'support query')
app = replace_once(app, '  const setStatus = trpc.banking.adminSetCustomerStatus.useMutation({ onSuccess: async () => { await utils.banking.adminOverview.invalidate(); await utils.banking.auditLogs.invalidate(); } });\n', '  const setStatus = trpc.banking.adminSetCustomerStatus.useMutation({ onSuccess: async () => { await utils.banking.adminOverview.invalidate(); await utils.banking.auditLogs.invalidate(); } });\n  const updateSupport = trpc.banking.updateSupportCaseStatus.useMutation({ onSuccess: async () => { await utils.banking.supportCases.invalidate(); await utils.banking.adminOverview.invalidate(); await utils.banking.auditLogs.invalidate(); } });\n', 'support mutation')
app = replace_once(app, '}{tab === "transactions" && <Panel title="Global Transaction Management">', '} {tab === "support" && <Panel title="Support Case Review"><p className="mb-5 text-slate-600">Submitted Contact Support requests are captured by the backend and exposed here for operational review.</p><div className="grid gap-3">{supportCases.data?.length ? supportCases.data.map(ticket => <div key={ticket.id} className="rounded-2xl bg-[#f8f6f1] p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="text-xs font-bold uppercase tracking-widest text-[#c9a84c]">{ticket.caseNumber} · {ticket.status}</div><h3 className="mt-2 font-serif text-xl font-semibold">{ticket.subject}</h3><p className="mt-1 text-sm text-slate-600">{ticket.fullName} · {ticket.email} · {new Date(ticket.createdAt).toLocaleString()}</p></div><div className="flex gap-2"><button onClick={() => updateSupport.mutate({ token, id: ticket.id, status: "In Review" })} className="rounded-full border px-3 py-2 text-sm font-semibold">Review</button><button onClick={() => updateSupport.mutate({ token, id: ticket.id, status: "Closed" })} className="rounded-full bg-[#0a1f44] px-3 py-2 text-sm font-semibold text-white">Close</button></div></div><p className="mt-4 text-sm leading-6 text-slate-700">{ticket.message}</p></div>) : <div className="rounded-2xl bg-[#f8f6f1] p-5 text-sm text-slate-600">No support cases have been submitted yet.</div>}</div></Panel>}{tab === "transactions" && <Panel title="Global Transaction Management">', 'support admin tab')
app = replace_once(app, '''function LegalPage({ type }: { type: "terms" | "privacy" | "contact" }) {
  const title = type === "terms" ? "Terms of Service" : type === "privacy" ? "Privacy Policy" : "Contact Support";
  return (
''', '''function LegalPage({ type }: { type: "terms" | "privacy" | "contact" }) {
  const title = type === "terms" ? "Terms of Service" : type === "privacy" ? "Privacy Policy" : "Contact Support";
  const support = trpc.banking.createSupportCase.useMutation();
  const [supportForm, setSupportForm] = useState({ fullName: "", email: "", subject: "", message: "" });
  const [supportMessage, setSupportMessage] = useState("");
  async function submitSupport(event: FormEvent) {
    event.preventDefault();
    setSupportMessage("");
    try {
      const ticket = await support.mutateAsync(supportForm);
      setSupportMessage(`Support case ${ticket.caseNumber} has been submitted for CBHfinance review.`);
      setSupportForm({ fullName: "", email: "", subject: "", message: "" });
    } catch (error: any) {
      setSupportMessage(error.message ?? "Unable to submit support request.");
    }
  }
  return (
''', 'legal state')
app = replace_once(app, '''            <form className="mt-8 grid gap-4">
              <input placeholder="Full name" className="rounded-2xl border px-4 py-3" />
              <input placeholder="Email" className="rounded-2xl border px-4 py-3" />
              <textarea placeholder="How can CBHfinance support you?" className="min-h-36 rounded-2xl border px-4 py-3" />
              <button type="button" className="rounded-full bg-[#0a1f44] px-6 py-4 font-semibold text-white">Submit support request</button>
              <p className="text-sm text-slate-500">This support form is a frontend-only placeholder for this build.</p>
            </form>
''', '''            <form onSubmit={submitSupport} className="mt-8 grid gap-4">
              <input value={supportForm.fullName} onChange={event => setSupportForm({ ...supportForm, fullName: event.target.value })} placeholder="Full name" className="rounded-2xl border px-4 py-3" required />
              <input value={supportForm.email} onChange={event => setSupportForm({ ...supportForm, email: event.target.value })} placeholder="Email" type="email" className="rounded-2xl border px-4 py-3" required />
              <input value={supportForm.subject} onChange={event => setSupportForm({ ...supportForm, subject: event.target.value })} placeholder="Subject" className="rounded-2xl border px-4 py-3" required />
              <textarea value={supportForm.message} onChange={event => setSupportForm({ ...supportForm, message: event.target.value })} placeholder="How can CBHfinance support you?" className="min-h-36 rounded-2xl border px-4 py-3" required />
              <button disabled={support.isPending} className="rounded-full bg-[#0a1f44] px-6 py-4 font-semibold text-white disabled:opacity-60">{support.isPending ? "Submitting..." : "Submit support request"}</button>
              {supportMessage && <p className="rounded-2xl bg-[#f8f6f1] p-4 text-sm text-[#0a1f44]">{supportMessage}</p>}
              <p className="text-sm text-slate-500">Support requests are captured for admin review inside the secure CBHfinance operations panel.</p>
            </form>
''', 'support contact form')
app_path.write_text(app)

# Tests.
test = test_path.read_text()
test = replace_once(test, '''  getDashboardSummary,
  getTransactions,
  resetDemoStateForTests,
''', '''  createSupportCase,
  getDashboardSummary,
  getStatements,
  getSupportCases,
  getTransactions,
  resetDemoStateForTests,
  updateSupportCaseStatus,
''', 'test imports')
test = replace_once(test, '''  it("locks the customer account after exactly five failed user login attempts", () => {
    let locked = false;
    for (let index = 0; index < FAILED_LOGIN_LOCKOUT_ATTEMPTS; index += 1) {
      const result = attemptCredentialLogin({ role: "user", email: "emily.johnson@cbhfinance.online", password: "wrong" });
      locked = result.locked;
    }
    expect(locked).toBe(true);
  });
''', '''  it("locks the customer account after exactly five failed user login attempts", () => {
    let locked = false;
    for (let index = 0; index < FAILED_LOGIN_LOCKOUT_ATTEMPTS; index += 1) {
      const result = attemptCredentialLogin({ role: "user", email: "emily.johnson@cbhfinance.online", password: "wrong" });
      locked = result.locked;
    }
    expect(locked).toBe(true);
  });

  it("captures support cases and lets admin review status change", () => {
    const ticket = createSupportCase({ fullName: "Emily Ann Johnson", email: "emily.johnson@cbhfinance.online", subject: "Statement access", message: "Please review my latest statement download request." });
    expect(ticket.caseNumber).toMatch(/^CBH-\\d{4}-00001$/);
    expect(getSupportCases()).toHaveLength(1);
    const reviewed = updateSupportCaseStatus({ id: ticket.id, status: "In Review" });
    expect(reviewed.status).toBe("In Review");
  });

  it("returns branded PDF data URLs for statements instead of placeholder paths", () => {
    const statement = getStatements()[0];
    expect(statement.fileUrl).toMatch(/^data:application\\/pdf;base64,/);
    const decoded = Buffer.from(statement.fileUrl.split(",")[1], "base64").toString("binary");
    expect(decoded.startsWith("%PDF-1.4")).toBe(true);
    expect(decoded).toContain("CBHfinance Online Banking");
  });
''', 'new tests')
test_path.write_text(test)
