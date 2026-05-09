import { trpc } from "@/lib/trpc";
import { AlertCircle, ArrowRight, Bell, Building2, CheckCircle2, Download, Eye, FileText, Landmark, Lock, Moon, Search, ShieldCheck, Sun, UserRound } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";

type DemoSession = {
  role: "user" | "admin";
  token: string;
  userName: string;
  startedAt: number;
  lastActivityAt: number;
};

const SESSION_KEY = "cbhfinance-demo-session";
const navy = "#0a1f44";
const gold = "#c9a84c";
const offWhite = "#f8f6f1";

function money(value: number) {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function mask(accountNumber: string) {
  return `•••• ${accountNumber.slice(-4)}`;
}

function readSession(): DemoSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeSession(session: DemoSession | null) {
  if (!session) localStorage.removeItem(SESSION_KEY);
  else localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3">
      <span className="grid h-11 w-11 place-items-center rounded-2xl border border-[#c9a84c]/50 bg-[#0a1f44] text-[#c9a84c] shadow-lg shadow-[#0a1f44]/20">
        <Landmark className="h-5 w-5" />
      </span>
      {!compact && (
        <span className="leading-none">
          <span className="font-serif text-2xl font-semibold tracking-tight text-[#0a1f44]">CBHfinance</span>
          <span className="block text-xs uppercase tracking-[0.32em] text-slate-500">Online Banking</span>
        </span>
      )}
    </Link>
  );
}

function MarketingNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#0a1f44]/10 bg-[#f8f6f1]/90 backdrop-blur-xl">
      <div className="container flex h-20 items-center justify-between">
        <BrandMark />
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-700 md:flex">
          <a href="/#services" className="hover:text-[#0a1f44]">Services</a>
          <a href="/#security" className="hover:text-[#0a1f44]">Security</a>
          <Link href="/terms" className="hover:text-[#0a1f44]">Terms</Link>
          <Link href="/privacy" className="hover:text-[#0a1f44]">Privacy</Link>
          <Link href="/contact" className="hover:text-[#0a1f44]">Contact</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/contact" className="hidden rounded-full border border-[#0a1f44]/20 px-5 py-2.5 text-sm font-semibold text-[#0a1f44] transition hover:border-[#0a1f44] md:inline-flex">Contact Support</Link>
          <Link href="/login" className="rounded-full bg-[#0a1f44] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0a1f44]/20 transition hover:bg-[#09285d]">Client Login</Link>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#0a1f44]/10 bg-[#0a1f44] text-white">
      <div className="container grid gap-10 py-12 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <div className="font-serif text-2xl font-semibold text-[#c9a84c]">CBHfinance</div>
          <p className="mt-4 max-w-md text-sm leading-6 text-white/70">CBHfinance provides a polished banking experience with professional account workflows, protected customer access, and secure payment review controls.</p>
        </div>
        <div>
          <h3 className="font-semibold text-[#c9a84c]">Pages</h3>
          <div className="mt-4 grid gap-2 text-sm text-white/70">
            <Link href="/login">Client login</Link>
            <Link href="/contact">Contact support</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/privacy">Privacy Policy</Link>
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-[#c9a84c]">Security Model</h3>
          <p className="mt-4 text-sm leading-6 text-white/70">Outgoing user payments are intentionally blocked and never change balances. Admin balance adjustments require a secure admin session and are written to an immutable audit trail.</p>
        </div>
      </div>
    </footer>
  );
}

function LandingPage() {
  const dashboard = trpc.banking.dashboard.useQuery();
  return (
    <div className="min-h-screen bg-[#f8f6f1] text-[#0a1f44]">
      <MarketingNav />
      <main>
        <section className="relative overflow-hidden border-b border-[#0a1f44]/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,168,76,0.24),transparent_32%),linear-gradient(135deg,rgba(10,31,68,0.08),transparent_45%)]" />
          <div className="container relative grid min-h-[680px] items-center gap-12 py-20 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="mb-5 inline-flex rounded-full border border-[#c9a84c]/50 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-[#0a1f44]">Secure banking platform</p>
              <h1 className="font-serif text-5xl font-semibold leading-[1.04] tracking-tight md:text-7xl">Private banking clarity for modern financial operations.</h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-700">CBHfinance combines a polished public presence, protected customer access, realistic transaction visibility, statement access, and disciplined account-service controls in one cohesive application.</p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a href="#services" className="inline-flex items-center justify-center rounded-full bg-[#0a1f44] px-7 py-4 font-semibold text-white shadow-xl shadow-[#0a1f44]/20 transition hover:bg-[#09285d]">Explore Services <ArrowRight className="ml-2 h-4 w-4" /></a>
                <Link href="/contact" className="inline-flex items-center justify-center rounded-full border border-[#0a1f44]/20 bg-white/70 px-7 py-4 font-semibold text-[#0a1f44] transition hover:border-[#c9a84c]">Contact Support</Link>
              </div>
              <p className="mt-5 text-sm text-slate-600">Secure client access is available through the sign-in area after identity verification.</p>
            </div>
            <div className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-2xl shadow-[#0a1f44]/20 backdrop-blur">
              <div className="rounded-[1.5rem] bg-[#0a1f44] p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/60">Total net worth</p>
                    <p className="mt-2 font-balance text-4xl font-semibold tracking-tight">{dashboard.data ? money(dashboard.data.totalNetWorth) : "Loading"}</p>
                  </div>
                  <ShieldCheck className="h-10 w-10 text-[#c9a84c]" />
                </div>
                <div className="mt-8 grid gap-3">
                  {(dashboard.data?.accounts ?? []).map(account => (
                    <div key={account.id} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                      <div className="flex items-center justify-between text-sm text-white/70"><span>{account.type}</span><span>{mask(account.number)}</span></div>
                      <div className="mt-2 text-2xl font-semibold text-[#c9a84c]">{money(account.balance)}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 text-center text-sm">
                <div className="rounded-2xl bg-[#f8f6f1] p-4"><div className="font-semibold">2FA</div><div className="text-slate-500">Email OTP</div></div>
                <div className="rounded-2xl bg-[#f8f6f1] p-4"><div className="font-semibold">13 min</div><div className="text-slate-500">Warning</div></div>
                <div className="rounded-2xl bg-[#f8f6f1] p-4"><div className="font-semibold">15 min</div><div className="text-slate-500">Timeout</div></div>
              </div>
            </div>
          </div>
        </section>
        <section id="services" className="container py-20">
          <div className="max-w-3xl"><h2 className="font-serif text-4xl font-semibold">A complete CBHfinance application surface.</h2><p className="mt-4 text-slate-700">The implementation includes the public website, protected client access, transaction ledger, statements, in-app notifications, and secure operational controls.</p></div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {["Account visibility", "Secure payment review", "Ledger governance"].map((title, index) => (
              <div key={title} className="rounded-[1.5rem] border border-[#0a1f44]/10 bg-white p-6 shadow-sm">
                <div className="mb-8 grid h-12 w-12 place-items-center rounded-2xl bg-[#0a1f44] text-[#c9a84c]">{index === 0 ? <Eye /> : index === 1 ? <Lock /> : <Building2 />}</div>
                <h3 className="font-serif text-2xl font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{index === 0 ? "Client accounts show balances, recent transactions, monthly statements, and filtered transaction history through a protected experience." : index === 1 ? "Transfer, Wire, ACH, Zelle, and Bill Pay requests are routed through controlled support messaging and do not alter balances from the public interface." : "Operational ledger tools use reason capture, overdraft prevention, and immutable audit entries for controlled account maintenance."}</p>
              </div>
            ))}
          </div>
        </section>
        <section id="security" className="bg-white py-20">
          <div className="container grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div><p className="text-sm font-bold uppercase tracking-[0.3em] text-[#c9a84c]">Security controls</p><h2 className="mt-4 font-serif text-4xl font-semibold">Credential, OTP, timeout, lockout, and audit controls support a more disciplined digital banking experience.</h2></div>
            <div className="grid gap-4 md:grid-cols-2">
              {["Separated access controls", "Email OTP verification simulation", "Warning at exactly 13 minutes", "Timeout at exactly 15 minutes", "Lockout after exactly 5 failed attempts", "Immutable audit log"].map(item => <div key={item} className="flex items-center gap-3 rounded-2xl bg-[#f8f6f1] p-4"><CheckCircle2 className="h-5 w-5 text-[#c9a84c]" /><span className="font-medium">{item}</span></div>)}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function LoginPage({ role }: { role: "user" | "admin" }) {
  const [, setLocation] = useLocation();
  const login = trpc.banking.login.useMutation();
  const verify = trpc.banking.verifyOtp.useMutation();
  const [email, setEmail] = useState(role === "admin" ? "admin@cbhfinance.online" : "emily.johnson@cbhfinance.online");
  const [password, setPassword] = useState(role === "admin" ? "CBHAdmin!2026" : "CBHUser!2026");
  const [otp, setOtp] = useState("246810");
  const [otpReady, setOtpReady] = useState(false);
  const [message, setMessage] = useState("");

  async function submitCredentials(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    const result = await login.mutateAsync({ email, password, role });
    if (result.success) {
      setOtpReady(true);
      setMessage("OTP sent by email. Use 246810 to continue.");
    } else {
      setMessage(result.message);
    }
  }

  async function submitOtp(event: FormEvent) {
    event.preventDefault();
    const result = await verify.mutateAsync({ role, otp });
    if (result.success) {
      writeSession({ role, token: result.token, userName: role === "admin" ? "CBHfinance Operations Admin" : "Emily Ann Johnson", startedAt: Date.now(), lastActivityAt: Date.now() });
      setLocation(role === "admin" ? "/secure-admin" : "/portal");
    } else setMessage(result.message);
  }

  return (
    <div className="min-h-screen bg-[#f8f6f1] text-[#0a1f44]">
      <MarketingNav />
      <main className="container grid min-h-[calc(100vh-5rem)] items-center gap-10 py-16 lg:grid-cols-[0.9fr_1.1fr]">
        <section>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#c9a84c]">{role === "admin" ? "Back-office access" : "Customer access"}</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold">{role === "admin" ? "Secure admin sign-in" : "Welcome to your CBHfinance portal"}</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-700">This separated login flow demonstrates password verification, email OTP delivery, 13-minute timeout warning, 15-minute hard timeout, and five-attempt lockout behavior.</p>
          <div className="mt-8 rounded-2xl border border-[#c9a84c]/40 bg-white p-5 text-sm text-slate-700"><strong>Access credentials:</strong><br />{role === "admin" ? "admin@cbhfinance.online / CBHAdmin!2026" : "emily.johnson@cbhfinance.online / CBHUser!2026"}<br />OTP: 246810</div>
        </section>
        <section className="rounded-[2rem] border border-[#0a1f44]/10 bg-white p-8 shadow-2xl shadow-[#0a1f44]/10">
          <BrandMark />
          {!otpReady ? (
            <form onSubmit={submitCredentials} className="mt-8 grid gap-5">
              <label className="grid gap-2 text-sm font-semibold">Email<input value={email} onChange={e => setEmail(e.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#c9a84c]" /></label>
              <label className="grid gap-2 text-sm font-semibold">Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#c9a84c]" /></label>
              <button className="rounded-full bg-[#0a1f44] px-6 py-4 font-semibold text-white" disabled={login.isPending}>Continue to OTP</button>
            </form>
          ) : (
            <form onSubmit={submitOtp} className="mt-8 grid gap-5">
              <label className="grid gap-2 text-sm font-semibold">Email OTP<input value={otp} onChange={e => setOtp(e.target.value)} maxLength={6} className="rounded-2xl border border-slate-200 px-4 py-3 text-center text-2xl tracking-[0.4em] outline-none focus:border-[#c9a84c]" /></label>
              <button className="rounded-full bg-[#0a1f44] px-6 py-4 font-semibold text-white" disabled={verify.isPending}>Verify and enter</button>
            </form>
          )}
          {message && <div className="mt-5 rounded-2xl bg-[#f8f6f1] p-4 text-sm text-[#0a1f44]"><AlertCircle className="mr-2 inline h-4 w-4 text-[#c9a84c]" />{message}</div>}
        </section>
      </main>
    </div>
  );
}

function useDemoSession(requiredRole?: "user" | "admin") {
  const [, setLocation] = useLocation();
  const policy = trpc.banking.securityPolicy.useQuery();
  const [session, setSession] = useState<DemoSession | null>(() => readSession());
  const [warning, setWarning] = useState(false);

  useEffect(() => {
    if (!session || (requiredRole && session.role !== requiredRole)) {
      setLocation(requiredRole === "admin" ? "/secure-admin" : "/login");
      return;
    }
    const update = () => {
      const latest = readSession();
      if (!latest) return;
      latest.lastActivityAt = Date.now();
      writeSession(latest);
      setSession(latest);
      setWarning(false);
    };
    window.addEventListener("click", update);
    window.addEventListener("keydown", update);
    return () => {
      window.removeEventListener("click", update);
      window.removeEventListener("keydown", update);
    };
  }, [requiredRole, session?.role, setLocation]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const latest = readSession();
      if (!latest) return;
      const elapsedMinutes = (Date.now() - latest.lastActivityAt) / 60000;
      if (elapsedMinutes >= (policy.data?.sessionTimeoutMinutes ?? 15)) {
        writeSession(null);
        setSession(null);
        setLocation(requiredRole === "admin" ? "/secure-admin" : "/login");
      } else if (elapsedMinutes >= (policy.data?.sessionWarningMinutes ?? 13)) {
        setWarning(true);
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [policy.data, requiredRole, setLocation]);

  function logout() {
    writeSession(null);
    setSession(null);
    setLocation("/");
  }
  return { session, warning, logout, dismissWarning: () => setWarning(false) };
}

function PortalLayout({ children, title, role = "user" }: { children: React.ReactNode; title: string; role?: "user" | "admin" }) {
  const { warning, logout, dismissWarning } = useDemoSession(role);
  const nav = role === "admin" ? [
    ["/secure-admin", "Admin Dashboard"], ["/secure-admin?tab=users", "Users"], ["/secure-admin?tab=transactions", "Transactions"], ["/secure-admin?tab=payments", "Payment Settings"], ["/secure-admin?tab=audit", "Audit Log"]
  ] : [["/portal", "Dashboard"], ["/portal?tab=transactions", "Transactions"], ["/portal?tab=payments", "Payments"], ["/portal?tab=statements", "Statements"], ["/portal?tab=settings", "Settings"]];
  return (
    <div className="min-h-screen bg-[#f8f6f1] text-[#0a1f44]">
      {warning && <div className="fixed inset-x-0 top-0 z-50 bg-[#c9a84c] px-4 py-3 text-center font-semibold text-[#0a1f44] shadow-lg">Session timeout warning: inactivity has reached exactly 13 minutes. <button onClick={dismissWarning} className="ml-4 underline">Continue session</button></div>}
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-white/70 bg-[#0a1f44] p-6 text-white lg:block">
        <div className="font-serif text-3xl font-semibold text-[#c9a84c]">CBHfinance</div>
        <div className="mt-2 text-xs uppercase tracking-[0.28em] text-white/50">{role === "admin" ? "Admin console" : "User portal"}</div>
        <nav className="mt-10 grid gap-2">
          {nav.map(([href, label]) => <Link key={href} href={href} className="rounded-2xl px-4 py-3 text-sm font-semibold text-white/75 transition hover:bg-white/10 hover:text-white">{label}</Link>)}
        </nav>
        <button onClick={logout} className="absolute bottom-6 left-6 right-6 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white/80 hover:bg-white/10">Sign out</button>
      </aside>
      <main className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-[#0a1f44]/10 bg-[#f8f6f1]/90 px-5 py-5 backdrop-blur lg:px-10">
          <div className="flex items-center justify-between gap-4">
            <div><div className="text-xs uppercase tracking-[0.3em] text-[#c9a84c]">CBHfinance</div><h1 className="font-serif text-3xl font-semibold">{title}</h1></div>
            <button onClick={logout} className="rounded-full border border-[#0a1f44]/20 px-4 py-2 text-sm font-semibold lg:hidden">Sign out</button>
          </div>
        </header>
        <div className="p-5 lg:p-10">{children}</div>
      </main>
    </div>
  );
}

function UserPortal() {
  const [location, setLocation] = useLocation();
  const tab = new URLSearchParams(location.split("?")[1] ?? "").get("tab") ?? "dashboard";
  const dashboard = trpc.banking.dashboard.useQuery();
  const statements = trpc.banking.statements.useQuery();
  const passwordNotice = trpc.banking.recordPasswordChange.useMutation();
  const [dark, setDark] = useState(false);
  const [twoFaEnabled, setTwoFaEnabled] = useState(true);

  return (
    <PortalLayout title="Emily Ann Johnson" role="user">
      {tab === "dashboard" && (
        <div className="grid gap-6">
          <div className="rounded-[2rem] bg-[#0a1f44] p-8 text-white shadow-xl shadow-[#0a1f44]/20"><p className="text-white/60">Total net worth</p><div className="mt-2 font-balance text-5xl font-semibold tracking-tight text-[#c9a84c]">{dashboard.data ? money(dashboard.data.totalNetWorth) : "Loading"}</div><p className="mt-4 text-sm text-white/65">Last login: {dashboard.data?.customer.lastLoginAt ? new Date(dashboard.data.customer.lastLoginAt).toLocaleString() : "Loading"} · {dashboard.data?.customer.lastLoginLocation}</p></div>
          <div className="grid gap-5 md:grid-cols-3">{dashboard.data?.accounts.map(account => <div key={account.id} className="rounded-[1.5rem] border border-[#0a1f44]/10 bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><span className="rounded-full bg-[#f8f6f1] px-3 py-1 text-xs font-bold uppercase tracking-widest">{account.type}</span><span className="text-sm text-slate-500">{mask(account.number)}</span></div><div className="mt-6 font-serif text-3xl font-semibold">{money(account.balance)}</div><p className="mt-3 text-sm text-slate-500">{account.type === "Savings" ? `${account.apy}% APY displayed` : account.type === "IRA" ? `${account.ytdPerformance}% YTD performance` : "Day-to-day transaction access"}</p></div>)}</div>
          <Panel title="Quick Actions"><div className="grid gap-4 md:grid-cols-5">{[["Transfer", "payments"], ["Wire", "payments"], ["Zelle", "payments"], ["Bill Pay", "payments"], ["Statements", "statements"]].map(([label, target]) => <button key={label} onClick={() => setLocation(`/portal?tab=${target}`)} className="rounded-2xl border border-[#0a1f44]/10 bg-[#f8f6f1] px-5 py-4 text-left font-semibold text-[#0a1f44] transition hover:border-[#c9a84c] hover:bg-white">{label}<ArrowRight className="mt-3 h-4 w-4 text-[#c9a84c]" /></button>)}</div></Panel>
          <Panel title="Alerts"><div className="grid gap-3 md:grid-cols-3"><div className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-900"><AlertCircle className="mr-2 inline h-4 w-4" />Outgoing payment rails are blocked by policy.</div><div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900"><ShieldCheck className="mr-2 inline h-4 w-4" />Email OTP 2FA is enabled.</div><div className="rounded-2xl bg-slate-100 p-4 text-sm text-slate-700"><Bell className="mr-2 inline h-4 w-4" />{dashboard.data?.unreadNotifications ?? 0} unread notifications.</div></div></Panel>
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]"><Panel title="Recent Transactions"><TransactionTable rows={dashboard.data?.recentTransactions ?? []} /></Panel><Panel title="Notifications"><div className="grid gap-3">{dashboard.data?.notifications.slice(0, 6).map(n => <div key={n.id} className="rounded-2xl bg-[#f8f6f1] p-4 text-sm"><Bell className="mr-2 inline h-4 w-4 text-[#c9a84c]" />{n.message}</div>)}</div></Panel></div>
        </div>
      )}
      {tab === "transactions" && <TransactionHistory />}
      {tab === "payments" && <Payments />}
      {tab === "statements" && <Statements rows={statements.data ?? []} />}
      {tab === "settings" && <Panel title="Profile & Settings"><div className="grid gap-5 md:grid-cols-2"><Setting label="Full name" value="Emily Ann Johnson" /><Setting label="Email" value="emily.johnson@cbhfinance.online" /><Setting label="Phone" value="+1 (415) 555-0198" /><Setting label="Mailing address" value="2128 Pacific Heights Avenue, San Francisco, CA 94115" /></div><div className="mt-6 grid gap-4 md:grid-cols-2"><div className="rounded-2xl bg-[#f8f6f1] p-5"><div className="text-xs font-bold uppercase tracking-widest text-slate-500">Email OTP 2FA</div><button onClick={() => setTwoFaEnabled(!twoFaEnabled)} className="mt-3 rounded-full bg-[#0a1f44] px-5 py-3 font-semibold text-white">{twoFaEnabled ? "Enabled" : "Disabled"}</button><p className="mt-2 text-sm text-slate-600">Visible 2FA toggle state for security settings.</p></div><div className="rounded-2xl bg-[#f8f6f1] p-5"><div className="text-xs font-bold uppercase tracking-widest text-slate-500">Password Security</div><button onClick={() => passwordNotice.mutate()} className="mt-3 rounded-full border border-[#0a1f44]/20 px-5 py-3 font-semibold">Record password change notification</button></div></div><div className="mt-6 flex flex-wrap gap-4"><button onClick={() => setDark(!dark)} className="rounded-full bg-[#0a1f44] px-5 py-3 font-semibold text-white">{dark ? <Sun className="mr-2 inline h-4 w-4" /> : <Moon className="mr-2 inline h-4 w-4" />}Toggle dark mode state</button><button className="rounded-full border border-[#0a1f44]/20 px-5 py-3 font-semibold"><Download className="mr-2 inline h-4 w-4" />Download account summary</button><label className="rounded-full border border-[#0a1f44]/20 px-5 py-3 font-semibold"><input type="file" className="hidden" />KYC upload placeholder</label></div></Panel>}
    </PortalLayout>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-[1.5rem] border border-[#0a1f44]/10 bg-white p-6 shadow-sm"><h2 className="mb-5 font-serif text-2xl font-semibold">{title}</h2>{children}</section>;
}

function Setting({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-[#f8f6f1] p-4"><div className="text-xs font-bold uppercase tracking-widest text-slate-500">{label}</div><div className="mt-1 font-semibold">{value}</div></div>;
}

function TransactionTable({ rows }: { rows: any[] }) {
  return <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="text-xs uppercase tracking-widest text-slate-500"><tr><th className="py-3">Date</th><th>Description</th><th>Account</th><th>Method</th><th>Reference</th><th>Amount</th><th>Balance After</th><th>Status</th></tr></thead><tbody>{rows.map(row => <tr key={row.id} className="border-t border-slate-100"><td className="py-3">{new Date(row.createdAt).toLocaleDateString()}</td><td>{row.description}</td><td>{row.accountType}</td><td>{row.method}</td><td>{row.referenceId}</td><td className={row.direction === "credit" ? "text-emerald-700" : "text-rose-700"}>{row.direction === "credit" ? "+" : "-"}{money(row.amount)}</td><td>{money(row.balanceAfter)}</td><td><span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">{row.status}</span></td></tr>)}</tbody></table></div>;
}

function TransactionHistory() {
  const [page, setPage] = useState(1); const [search, setSearch] = useState(""); const [method, setMethod] = useState<any>("All"); const [accountType, setAccountType] = useState<any>("All");
  const query = trpc.banking.transactions.useQuery({ page, search, method, accountType, status: "All" });
  const csv = useMemo(() => (query.data?.rows ?? []).map((r: any) => [r.createdAt, r.description, r.accountType, r.method, r.referenceId, r.direction, r.amount, r.balanceAfter, r.status].join(",")).join("\n"), [query.data]);
  return <Panel title="Transaction History"><div className="mb-5 grid gap-3 md:grid-cols-4"><label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3"><Search className="h-4 w-4 text-slate-400" /><input value={search} onChange={e => { setPage(1); setSearch(e.target.value); }} placeholder="Search description or reference" className="w-full outline-none" /></label><select value={accountType} onChange={e => setAccountType(e.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3"><option>All</option><option>Checking</option><option>Savings</option><option>IRA</option></select><select value={method} onChange={e => setMethod(e.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3"><option>All</option><option>ACH</option><option>Wire</option><option>Zelle</option><option>Bill Pay</option><option>Internal</option><option>Interest</option><option>Investment</option><option>Admin</option></select><a download="cbhfinance-transactions.csv" href={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`} className="rounded-full bg-[#0a1f44] px-5 py-3 text-center font-semibold text-white">Export CSV</a></div><TransactionTable rows={query.data?.rows ?? []} /><div className="mt-5 flex items-center justify-between text-sm"><span>Page {query.data?.page ?? page} of {query.data?.pageCount ?? 1} · exactly 25 records per page</span><div className="flex gap-2"><button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded-full border px-4 py-2 disabled:opacity-40">Previous</button><button disabled={page >= (query.data?.pageCount ?? 1)} onClick={() => setPage(page + 1)} className="rounded-full border px-4 py-2 disabled:opacity-40">Next</button></div></div></Panel>;
}

function Payments() {
  const block = trpc.banking.blockPayment.useMutation();
  const [modal, setModal] = useState(false);
  async function submit(type: any) { await block.mutateAsync({ paymentType: type, amount: 100, memo: "Outgoing payment request" }); setModal(true); }
  return <Panel title="Outgoing Payments"><p className="mb-6 text-slate-600">All outgoing user-initiated payment workflows are intentionally blocked. The modal text below is exact, and no transaction record is created.</p><div className="grid gap-4 md:grid-cols-5">{["Transfer", "Wire", "ACH", "Zelle", "Bill Pay"].map(type => <button key={type} onClick={() => submit(type)} className="rounded-2xl bg-[#0a1f44] px-5 py-5 font-semibold text-white shadow-lg shadow-[#0a1f44]/10">{type}</button>)}</div>{modal && <div className="fixed inset-0 z-50 grid place-items-center bg-[#0a1f44]/70 p-4"><div className="max-w-md rounded-[2rem] bg-white p-8 text-center shadow-2xl"><AlertCircle className="mx-auto h-12 w-12 text-[#c9a84c]" /><h3 className="mt-5 font-serif text-2xl font-semibold">Unable to complete transaction. Please contact support.</h3><button onClick={() => setModal(false)} className="mt-8 rounded-full bg-[#0a1f44] px-8 py-3 font-semibold text-white">Close</button></div></div>}</Panel>;
}

function Statements({ rows }: { rows: any[] }) {
  return <Panel title="Monthly Statements"><p className="mb-5 text-slate-600">Monthly PDF statement records are available from January 2025 onward for each account. Download links are secure placeholders for the current environment.</p><div className="grid gap-3 md:grid-cols-3">{rows.slice(0, 36).map(row => <a key={row.id} href={row.fileUrl} className="flex items-center gap-3 rounded-2xl bg-[#f8f6f1] p-4 font-semibold"><FileText className="h-5 w-5 text-[#c9a84c]" />{row.accountType} · {row.period}</a>)}</div></Panel>;
}

function AdminPanel() {
  const session = readSession();
  const [location] = useLocation();
  const tab = new URLSearchParams(location.split("?")[1] ?? "").get("tab") ?? "dashboard";
  const token = session?.token ?? "";
  const overview = trpc.banking.adminOverview.useQuery({ token }, { enabled: Boolean(session && session.role === "admin") });
  const audit = trpc.banking.auditLogs.useQuery({ token }, { enabled: Boolean(session && session.role === "admin") });
  const paymentSettings = trpc.banking.paymentSettings.useQuery();
  const [adminPage, setAdminPage] = useState(1); const [adminSearch, setAdminSearch] = useState(""); const [adminMethod, setAdminMethod] = useState<any>("All"); const [adminStatus, setAdminStatus] = useState<any>("All");
  const txns = trpc.banking.transactions.useQuery({ page: adminPage, accountType: "All", method: adminMethod, status: adminStatus, search: adminSearch }, { enabled: Boolean(session && session.role === "admin") });
  const utils = trpc.useUtils();
  const adjust = trpc.banking.adminAdjustBalance.useMutation({ onSuccess: async () => { await utils.banking.adminOverview.invalidate(); await utils.banking.transactions.invalidate(); await utils.banking.auditLogs.invalidate(); } });
  const setStatus = trpc.banking.adminSetCustomerStatus.useMutation({ onSuccess: async () => { await utils.banking.adminOverview.invalidate(); await utils.banking.auditLogs.invalidate(); } });
  const [accountId, setAccountId] = useState("acc_checking"); const [action, setAction] = useState<"Credit" | "Debit">("Credit"); const [amount, setAmount] = useState(100); const [description, setDescription] = useState("Manual account review adjustment"); const [message, setMessage] = useState("");
  const adminCsv = useMemo(() => (txns.data?.rows ?? []).map((r: any) => [r.createdAt, r.description, r.accountType, r.method, r.referenceId, r.direction, r.amount, r.balanceAfter, r.status].join(",")).join("\n"), [txns.data]);
  if (!session || session.role !== "admin") return <LoginPage role="admin" />;
  async function submitAdjustment(e: FormEvent) { e.preventDefault(); setMessage(""); try { await adjust.mutateAsync({ token, accountId, action, amount, description }); setMessage("Adjustment posted, transaction created, and immutable audit log recorded."); } catch (err: any) { setMessage(err.message); } }
  return <PortalLayout title="Secure Admin Panel" role="admin">{tab === "dashboard" && <div className="grid gap-6"><div className="grid gap-5 md:grid-cols-4">{[["Total Users", overview.data?.totalUsers], ["Total Deposits", overview.data ? money(overview.data.totalDeposits) : "Loading"], ["Transactions Today", overview.data?.totalTransactionsToday], ["Pending Reviews", overview.data?.pendingReviews]].map(([k, v]) => <div key={k as string} className="rounded-[1.5rem] bg-white p-6 shadow-sm"><div className="text-sm text-slate-500">{k}</div><div className="mt-2 font-serif text-3xl font-semibold">{v}</div></div>)}</div><Panel title="Admin Credit & Debit Control"><form onSubmit={submitAdjustment} className="grid gap-4 md:grid-cols-5"><select value={accountId} onChange={e => setAccountId(e.target.value)} className="rounded-2xl border px-4 py-3">{overview.data?.accounts.map(a => <option key={a.id} value={a.id}>{a.type} · {a.number}</option>)}</select><select value={action} onChange={e => setAction(e.target.value as any)} className="rounded-2xl border px-4 py-3"><option>Credit</option><option>Debit</option></select><input type="number" min="0.01" step="0.01" value={amount} onChange={e => setAmount(Number(e.target.value))} className="rounded-2xl border px-4 py-3" /><input value={description} onChange={e => setDescription(e.target.value)} className="rounded-2xl border px-4 py-3 md:col-span-1" required /><button className="rounded-full bg-[#0a1f44] px-5 py-3 font-semibold text-white">Post</button></form>{message && <div className="mt-4 rounded-2xl bg-[#f8f6f1] p-4 text-sm">{message}</div>}</Panel><Panel title="Recent Admin Activity"><div className="grid gap-3">{overview.data?.recentActivity.map(log => <div key={log.id} className="rounded-2xl bg-[#f8f6f1] p-4 text-sm"><strong>{log.actionType}</strong> · {log.details}</div>)}</div></Panel></div>}{tab === "users" && <Panel title="User Management"><div className="rounded-2xl bg-[#f8f6f1] p-5"><UserRound className="mb-3 h-7 w-7 text-[#c9a84c]" /><div className="font-serif text-2xl font-semibold">Emily Ann Johnson</div><p className="mt-2 text-sm text-slate-600">{overview.data?.customer.status ?? "Active"} · Member since March 2019 · Routing 121000248</p><div className="mt-5 flex flex-wrap gap-3"><button onClick={() => setStatus.mutate({ token, status: "Active" })} className="rounded-full border px-4 py-2 font-semibold">Mark Active</button><button onClick={() => setStatus.mutate({ token, status: "Suspended" })} className="rounded-full border px-4 py-2 font-semibold">Suspend</button><button onClick={() => setStatus.mutate({ token, status: "Locked" })} className="rounded-full bg-[#0a1f44] px-4 py-2 font-semibold text-white">Lock</button></div><div className="mt-5 grid gap-3 md:grid-cols-3">{overview.data?.accounts.map(a => <div key={a.id} className="rounded-2xl bg-white p-4"><div className="font-semibold">{a.type}</div><div>{a.number}</div><div>{money(a.balance)}</div></div>)}</div><div className="mt-6"><h3 className="mb-3 font-serif text-xl font-semibold">User Transaction View</h3><TransactionTable rows={txns.data?.rows.slice(0, 5) ?? []} /></div></div></Panel>}{tab === "transactions" && <Panel title="Global Transaction Management"><div className="mb-5 grid gap-3 md:grid-cols-5"><input value={adminSearch} onChange={e => { setAdminPage(1); setAdminSearch(e.target.value); }} placeholder="Search" className="rounded-2xl border px-4 py-3" /><select value={adminMethod} onChange={e => { setAdminPage(1); setAdminMethod(e.target.value); }} className="rounded-2xl border px-4 py-3"><option>All</option><option>ACH</option><option>Wire</option><option>Zelle</option><option>Bill Pay</option><option>Internal</option><option>Interest</option><option>Investment</option><option>Admin</option></select><select value={adminStatus} onChange={e => { setAdminPage(1); setAdminStatus(e.target.value); }} className="rounded-2xl border px-4 py-3"><option>All</option><option>Completed</option><option>Pending</option><option>Failed</option></select><button type="button" className="rounded-full border border-[#0a1f44]/20 px-5 py-3 font-semibold">Approve pending</button><a download="cbhfinance-admin-transactions.csv" href={`data:text/csv;charset=utf-8,${encodeURIComponent(adminCsv)}`} className="rounded-full bg-[#0a1f44] px-5 py-3 text-center font-semibold text-white">Export CSV</a></div><TransactionTable rows={txns.data?.rows ?? []} /><div className="mt-5 flex items-center justify-between text-sm"><span>Page {txns.data?.page ?? adminPage} of {txns.data?.pageCount ?? 1} · exactly 25 records per page</span><div className="flex gap-2"><button disabled={adminPage <= 1} onClick={() => setAdminPage(adminPage - 1)} className="rounded-full border px-4 py-2 disabled:opacity-40">Previous</button><button disabled={adminPage >= (txns.data?.pageCount ?? 1)} onClick={() => setAdminPage(adminPage + 1)} className="rounded-full border px-4 py-2 disabled:opacity-40">Next</button></div></div></Panel>}{tab === "payments" && <Panel title="Payment Settings"><div className="grid gap-4 md:grid-cols-2"><Setting label="Global outgoing payments" value={paymentSettings.data?.globalOutgoingPaymentsEnabled ? "Enabled" : "Disabled"} /><Setting label="Per-user outgoing payments" value={paymentSettings.data?.perUserOutgoingPaymentsEnabled ? "Enabled" : "Disabled"} /><Setting label="Daily transfer limit" value={money(paymentSettings.data?.dailyTransferLimit ?? 0)} /><Setting label="Maintenance notice" value={paymentSettings.data?.maintenanceNotice ?? "Loading"} /></div><p className="mt-5 rounded-2xl bg-[#f8f6f1] p-4 text-sm text-slate-700">Controls are visible and locked to disabled so all outgoing user payments remain blocked.</p></Panel>}{tab === "audit" && <Panel title="Immutable Audit Log"><p className="mb-5 text-slate-600">Audit records are append-only. No edit or delete action is exposed in the UI or server procedures.</p><div className="grid gap-3">{audit.data?.map(log => <div key={log.id} className="rounded-2xl bg-[#f8f6f1] p-4 text-sm"><strong>{log.actionType}</strong> · {new Date(log.createdAt).toLocaleString()} · {log.details} · IP {log.ipAddress}</div>)}</div></Panel>}</PortalLayout>;
}

function LegalPage({ type }: { type: "terms" | "privacy" | "contact" }) {
  const title = type === "terms" ? "Terms of Service" : type === "privacy" ? "Privacy Policy" : "Contact Support";
  return (
    <div className="min-h-screen bg-[#f8f6f1]">
      <MarketingNav />
      <main className="container py-16">
        <div className="max-w-4xl rounded-[2rem] bg-white p-8 shadow-sm">
          <h1 className="font-serif text-5xl font-semibold text-[#0a1f44]">{title}</h1>
          {type === "contact" ? (
            <form className="mt-8 grid gap-4">
              <input placeholder="Full name" className="rounded-2xl border px-4 py-3" />
              <input placeholder="Email" className="rounded-2xl border px-4 py-3" />
              <textarea placeholder="How can CBHfinance support you?" className="min-h-36 rounded-2xl border px-4 py-3" />
              <button type="button" className="rounded-full bg-[#0a1f44] px-6 py-4 font-semibold text-white">Submit support request</button>
              <p className="text-sm text-slate-500">This support form is a frontend-only placeholder for this build.</p>
            </form>
          ) : (
            <div className="prose prose-slate mt-8 max-w-none">
              <p>These {title.toLowerCase()} describe the CBHfinance online banking environment, including credential and OTP flows, statement records, payment controls, and administrative account oversight.</p>
              <p>No outgoing customer payment is processed by this application. Transfer, Wire, ACH, Zelle, and Bill Pay actions are blocked and display the required support message without changing account balances.</p>
              <p>Administrative balance adjustments are recorded with transaction entries and append-only audit log records. The platform should be connected to formal compliance, legal, security, and banking infrastructure before any real-world financial use.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export function CBHFinanceRouter() {
  return null;
}

export { LandingPage, LoginPage, UserPortal, AdminPanel, LegalPage };
