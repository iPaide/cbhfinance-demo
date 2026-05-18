import { AlertCircle, ArrowRight, Bell, Building2, CheckCircle2, Download, Eye, FileText, Landmark, Lock, Moon, Search, ShieldCheck, Sun, UserRound } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

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
    <nav className="sticky top-0 z-40 border-b border-[#0a1f44]/10 bg-[#f8f6f1]/90 px-5 py-4 backdrop-blur lg:px-10">
      <div className="flex items-center justify-between gap-6">
        <BrandMark />
        <div className="hidden gap-8 lg:flex">
          {[["Services", "#services"], ["Security", "#security"], ["Terms", "/terms"], ["Privacy", "/privacy"], ["Contact", "/contact"]].map(([label, href]) =>
            href.startsWith("/") ? (
              <Link key={href} href={href} className="text-sm font-semibold text-[#0a1f44] transition hover:text-[#c9a84c]">
                {label}
              </Link>
            ) : (
              <a key={href} href={href} className="text-sm font-semibold text-[#0a1f44] transition hover:text-[#c9a84c]">
                {label}
              </a>
            )
          )}
        </div>
        <div className="flex gap-3">
          <Link href="/contact" className="rounded-full border border-[#0a1f44]/20 px-5 py-2 text-sm font-semibold text-[#0a1f44] transition hover:border-[#c9a84c]">
            Contact Support
          </Link>
          <Link href="/login" className="rounded-full bg-[#0a1f44] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#09285d]">
            Client Login
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#0a1f44]/10 bg-white py-12 text-slate-600">
      <div className="container grid gap-8 md:grid-cols-4">
        <div>
          <BrandMark compact />
          <p className="mt-4 text-sm">Secure banking platform for modern financial operations.</p>
        </div>
        {([
          ["Product", ["Services", "Security", "Statements"]],
          ["Company", ["About", "Contact", "Careers"]],
          ["Legal", ["Terms", "Privacy", "Compliance"]],
        ] as const).map(([category, items]) => (
          <div key={category}>
            <h3 className="font-semibold text-[#0a1f44]">{category}</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {items.map((item: string) => (
                <li key={item}>
                  <a href="#" className="transition hover:text-[#0a1f44]">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container mt-8 border-t border-[#0a1f44]/10 pt-8 text-center text-sm">© 2026 CBHfinance. All rights reserved.</div>
    </footer>
  );
}

function LandingPage() {
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
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-white/60">Client privacy first</p>
                    <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight">Account details stay behind secure sign-in.</h2>
                    <p className="mt-4 text-sm leading-6 text-white/70">Balances, account numbers, statements, and transaction history are only presented after client authentication and OTP verification.</p>
                  </div>
                  <ShieldCheck className="h-10 w-10 shrink-0 text-[#c9a84c]" />
                </div>
                <div className="mt-8 grid gap-3">
                  {[
                    ["Protected dashboard", "Sensitive account data is not shown on public pages."],
                    ["Verified access", "Client sign-in uses password and OTP verification controls."],
                    ["Controlled payments", "Payment requests are routed through support safeguards."],
                  ].map(([title, copy]) => (
                    <div key={title} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                      <div className="flex items-center gap-3 text-[#c9a84c]"><Lock className="h-4 w-4" /><span className="font-semibold">{title}</span></div>
                      <p className="mt-2 text-sm leading-6 text-white/70">{copy}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 text-center text-sm">
                <div className="rounded-2xl bg-[#f8f6f1] p-4"><div className="font-semibold">Private</div><div className="text-slate-500">Balances</div></div>
                <div className="rounded-2xl bg-[#f8f6f1] p-4"><div className="font-semibold">Secure</div><div className="text-slate-500">Sign-in</div></div>
                <div className="rounded-2xl bg-[#f8f6f1] p-4"><div className="font-semibold">Verified</div><div className="text-slate-500">OTP</div></div>
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

function LoginPage({ role, onAuthenticated }: { role: "user" | "admin"; onAuthenticated?: (session: DemoSession) => void }) {
  const [, setLocation] = useLocation();
  const login = trpc.banking.login.useMutation();
  const verify = trpc.banking.verifyOtp.useMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showTestAccess, setShowTestAccess] = useState(false);
  const [otpReady, setOtpReady] = useState(false);
  const [message, setMessage] = useState("");

  async function submitCredentials(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    const result = await login.mutateAsync({ email, password, role });
    if (result.success) {
      setOtpReady(true);
      setMessage("OTP sent by email. Enter the six-digit verification code to continue.");
    } else {
      setMessage(result.message);
    }
  }

  async function submitOtp(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    const result = await verify.mutateAsync({ otp, role });
    if (result.success) {
      const nextSession = { role, token: result.token, userName: email, startedAt: Date.now(), lastActivityAt: Date.now() };
      writeSession(nextSession);
      onAuthenticated?.(nextSession);
      setLocation(role === "admin" ? "/secure-admin" : "/portal");
    } else {
      setMessage(result.message);
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f6f1] text-[#0a1f44]">
      <nav className="border-b border-[#0a1f44]/10 bg-white px-5 py-4 lg:px-10">
        <BrandMark />
      </nav>
      <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-[2rem] border border-[#0a1f44]/10 bg-white p-8 shadow-sm">
          <h1 className="font-serif text-3xl font-semibold">{role === "admin" ? "Admin Access" : "Client Sign In"}</h1>
          <p className="mt-2 text-sm text-slate-600">{role === "admin" ? "Secure admin console access" : "Access your accounts securely"}</p>
          {!otpReady ? (
            <form onSubmit={submitCredentials} className="mt-8 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#c9a84c]" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#c9a84c]" required />
              </div>
              {message && <div className="rounded-2xl bg-red-50 p-3 text-sm text-red-700">{message}</div>}
              <button type="submit" className="w-full rounded-full bg-[#0a1f44] px-5 py-3 font-semibold text-white transition hover:bg-[#09285d]">
                Continue
              </button>
            </form>
          ) : (
            <form onSubmit={submitOtp} className="mt-8 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">OTP Code</label>
                <input type="text" value={otp} onChange={e => setOtp(e.target.value)} placeholder="000000" maxLength={6} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-center font-mono text-lg outline-none focus:border-[#c9a84c]" required />
              </div>
              {message && <div className="rounded-2xl bg-red-50 p-3 text-sm text-red-700">{message}</div>}
              <button type="submit" className="w-full rounded-full bg-[#0a1f44] px-5 py-3 font-semibold text-white transition hover:bg-[#09285d]">
                Verify
              </button>
              <button type="button" onClick={() => { setOtpReady(false); setOtp(""); }} className="w-full text-xs text-slate-500 underline">
                Back to credentials
              </button>
            </form>
          )}
        </div>
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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const nav: [string, string][] = role === "admin" ? [
    ["/secure-admin", "Dashboard"], ["/secure-admin?tab=users", "Users"], ["/secure-admin?tab=transactions", "Transactions"], ["/secure-admin?tab=support", "Support"], ["/secure-admin?tab=payments", "Payments"], ["/secure-admin?tab=audit", "Audit"]
  ] : [
    ["/portal", "Dashboard"], ["/portal?tab=transactions", "Transactions"], ["/portal?tab=payments", "Payments"], ["/portal?tab=statements", "Statements"], ["/portal?tab=settings", "Settings"]
  ];
  return (
    <div className="min-h-screen bg-[#f8f6f1] text-[#0a1f44]">
      {warning && <div className="fixed inset-x-0 top-0 z-50 bg-[#c9a84c] px-4 py-3 text-center font-semibold text-[#0a1f44] shadow-lg">Session timeout warning: inactivity has reached exactly 13 minutes. <button onClick={dismissWarning} className="ml-4 underline">Continue session</button></div>}
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-[#0a1f44]/20 bg-[#0a1f44] p-6 text-white lg:block">
        <div className="font-serif text-3xl font-semibold text-[#c9a84c]">CBHfinance</div>
        <div className="mt-2 text-xs uppercase tracking-[0.28em] text-white/50">{role === "admin" ? "Admin console" : "User portal"}</div>
        <nav className="mt-10 grid gap-2">
          {nav.map(([href, label]) => <Link key={href} href={href} className="rounded-2xl px-4 py-3 text-sm font-semibold text-white/75 transition hover:bg-white/10 hover:text-white">{label}</Link>)}
        </nav>
        <button onClick={logout} className="absolute bottom-6 left-6 right-6 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white/80 hover:bg-white/10">Sign out</button>
      </aside>
      {mobileNavOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileNavOpen(false)} />}
      <aside className="fixed inset-y-0 left-0 z-40 w-64 border-r border-[#0a1f44]/20 bg-[#0a1f44] p-6 text-white transition-transform lg:hidden" style={{ transform: mobileNavOpen ? "translateX(0)" : "translateX(-100%)" }}>
        <div className="flex items-center justify-between mb-6">
          <div className="font-serif text-2xl font-semibold text-[#c9a84c]">CBHfinance</div>
          <button onClick={() => setMobileNavOpen(false)} className="text-white/75 hover:text-white">✕</button>
        </div>
        <nav className="grid gap-2">
          {nav.map(([href, label]) => <Link key={href} href={href} className="rounded-2xl px-4 py-3 text-sm font-semibold text-white/75 transition hover:bg-white/10 hover:text-white" onClick={() => setMobileNavOpen(false)}>{label}</Link>)}
        </nav>
        <button onClick={() => { logout(); setMobileNavOpen(false); }} className="mt-8 w-full rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white/80 hover:bg-white/10">Sign out</button>
      </aside>
      <main className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-[#0a1f44]/10 bg-[#f8f6f1] px-5 py-5 lg:px-10">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <button onClick={() => setMobileNavOpen(true)} className="rounded-full border border-[#0a1f44]/20 px-3 py-2 text-sm font-semibold lg:hidden">☰</button>
              <div><div className="text-xs uppercase tracking-[0.3em] text-[#c9a84c]">CBHfinance</div><h1 className="font-serif text-2xl lg:text-3xl font-semibold">{title}</h1></div>
            </div>
            <button onClick={logout} className="rounded-full border border-[#0a1f44]/20 px-4 py-2 text-sm font-semibold lg:hidden">Sign out</button>
          </div>
        </header>
        <div className="p-4 sm:p-6 lg:p-10">{children}</div>
      </main>
    </div>
  );
}

function UserPortal() {
  const [tab, setTab] = useState("dashboard");
  const dashboard = trpc.banking.dashboard.useQuery();
  const statements = trpc.banking.statements.useQuery();

  const navItems = [
    ["Overview", "dashboard"],
    ["Retirement Accounts", "dashboard"],
    ["Investments", "dashboard"],
    ["Contributions", "payments"],
    ["Activity", "transactions"],
    ["Statements", "statements"],
    ["Beneficiaries", "settings"],
    ["Profile & Security", "settings"],
  ];

  const quickActions = [
    {
      icon: "CON",
      label: "Make Contribution",
      desc: "Schedule a one-time or recurring retirement contribution.",
      target: "payments",
    },
    {
      icon: "ROL",
      label: "Start Rollover",
      desc: "Begin a rollover request from another retirement provider.",
      target: "payments",
    },
    {
      icon: "INV",
      label: "Change Investments",
      desc: "Review allocations and adjust future contribution elections.",
      target: "settings",
    },
    {
      icon: "BEN",
      label: "Update Beneficiaries",
      desc: "Review beneficiary information for your retirement account.",
      target: "settings",
    },
    {
      icon: "PDF",
      label: "View Statements",
      desc: "Download monthly and annual account documents.",
      target: "statements",
    },
    {
      icon: "ACT",
      label: "Account Activity",
      desc: "Search contributions, dividends, fees, and transfers.",
      target: "transactions",
    },
  ];

  function logout() {
    localStorage.removeItem("cbh_session");
    window.location.href = "/";
  }

  const accounts = dashboard.data?.accounts ?? [];
  const recentTransactions = dashboard.data?.recentTransactions ?? [];
  const totalRetirementSavings = dashboard.data?.totalNetWorth ?? 0;

  const retirementAccounts = accounts.map((account: any) => {
    const displayName =
      account.type === "Checking"
        ? "Traditional Retirement Savings"
        : account.type === "Savings"
          ? "High-Yield Cash Reserve"
          : account.type === "IRA"
            ? "Individual Retirement Account"
            : `${account.type} Account`;

    const accountNote =
      account.type === "Savings"
        ? `${account.apy}% APY cash reserve`
        : account.type === "IRA"
          ? `${account.ytdPerformance}% YTD investment performance`
          : "Core retirement contribution account";

    return { ...account, displayName, accountNote };
  });

  const estimatedVestedBalance = totalRetirementSavings * 0.92;
  const estimatedYtdContributions = recentTransactions
    .filter((row: any) => row.direction === "credit")
    .slice(0, 8)
    .reduce((sum: number, row: any) => sum + Number(row.amount ?? 0), 0);

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-[#071f46]">
      <aside className="fixed left-0 top-0 hidden h-screen w-72 bg-[#071f46] p-6 text-white shadow-2xl lg:block">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="font-serif text-3xl font-bold leading-none text-white">
            CBHfinance
          </div>
          <div className="mt-2 text-[10px] uppercase tracking-[0.35em] text-[#d6ad42]">
            Retirement Portal
          </div>
        </div>

        <nav className="mt-8 grid gap-2">
          {navItems.map(([label, value]) => (
            <button
              key={`${label}-${value}`}
              type="button"
              onClick={() => setTab(value)}
              className={`rounded-2xl px-5 py-3.5 text-left text-sm font-semibold transition ${
                tab === value
                  ? "bg-[#d6ad42] text-white shadow-lg shadow-black/20"
                  : "text-white/75 hover:bg-white/10 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-24 left-6 right-6 rounded-3xl bg-white/5 p-5 text-sm text-white/75">
          <div className="font-semibold text-white">Retirement readiness</div>
          <div className="mt-3 h-2 rounded-full bg-white/10">
            <div className="h-2 w-[72%] rounded-full bg-[#d6ad42]" />
          </div>
          <p className="mt-3 text-xs leading-5">
            Your projected savings profile is on track based on current account activity.
          </p>
        </div>

        <button
          type="button"
          onClick={logout}
          className="absolute bottom-7 left-8 right-8 rounded-2xl border border-white/25 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
        >
          Sign out
        </button>
      </aside>

      <main className="lg:ml-72">
        <header className="border-b border-slate-200 bg-white px-5 py-6 lg:px-10">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <div className="text-xs uppercase tracking-[0.35em] text-[#d6ad42]">
                Retirement Savings
              </div>
              <h1 className="mt-1 font-serif text-3xl font-semibold text-[#071f46]">
                Emily Ann Johnson
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Last login:{" "}
                {dashboard.data?.customer.lastLoginAt
                  ? new Date(dashboard.data.customer.lastLoginAt).toLocaleString()
                  : "Loading"}{" "}
                · {dashboard.data?.customer.lastLoginLocation ?? "San Francisco, CA"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden rounded-2xl bg-[#f6f7fb] px-5 py-3 text-sm font-semibold text-[#071f46] sm:block">
                Secure session active
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#071f46] text-sm font-bold text-white">
                EJ
              </div>
            </div>

            <div className="flex w-full flex-wrap gap-2 lg:hidden">
              {navItems.slice(0, 5).map(([label, value]) => (
                <button
                  key={`${label}-${value}-mobile`}
                  type="button"
                  onClick={() => setTab(value)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    tab === value ? "bg-[#071f46] text-white" : "border bg-white text-[#071f46]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="p-5 lg:p-10">
          {tab === "dashboard" && (
            <div className="grid gap-6">
              <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                <section className="overflow-hidden rounded-[2rem] bg-[#071f46] p-8 text-white shadow-xl">
                  <div className="flex flex-wrap items-start justify-between gap-5">
                    <div>
                      <p className="text-white/60">Total retirement savings</p>
                      <div className="mt-3 text-5xl font-bold tracking-tight text-[#d6ad42]">
                        {dashboard.data ? money(totalRetirementSavings) : "Loading"}
                      </div>
                      <p className="mt-4 max-w-xl text-sm leading-6 text-white/70">
                        Includes retirement savings, cash reserve, and investment account values
                        available through CBHfinance.
                      </p>
                    </div>

                    <div className="rounded-3xl border border-white/15 bg-white/5 p-5 text-sm">
                      <div className="text-white/55">Projected status</div>
                      <div className="mt-2 text-2xl font-semibold text-white">On track</div>
                      <div className="mt-4 h-2 w-48 rounded-full bg-white/10">
                        <div className="h-2 w-[72%] rounded-full bg-[#d6ad42]" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl bg-white/8 p-5">
                      <div className="text-xs uppercase tracking-widest text-white/45">
                        Vested balance
                      </div>
                      <div className="mt-2 text-2xl font-semibold">
                        {money(estimatedVestedBalance)}
                      </div>
                    </div>
                    <div className="rounded-2xl bg-white/8 p-5">
                      <div className="text-xs uppercase tracking-widest text-white/45">
                        YTD contributions
                      </div>
                      <div className="mt-2 text-2xl font-semibold">
                        {money(estimatedYtdContributions)}
                      </div>
                    </div>
                    <div className="rounded-2xl bg-white/8 p-5">
                      <div className="text-xs uppercase tracking-widest text-white/45">
                        Investment profile
                      </div>
                      <div className="mt-2 text-2xl font-semibold">Balanced</div>
                    </div>
                  </div>
                </section>

                <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h2 className="font-serif text-2xl font-semibold">Allocation snapshot</h2>
                    <button
                      type="button"
                      onClick={() => setTab("settings")}
                      className="text-sm font-semibold text-[#003d8f] hover:underline"
                    >
                      Review elections
                    </button>
                  </div>

                  <div className="mt-6 grid gap-4">
                    {[
                      ["Target date strategy", "48%"],
                      ["US equity index", "24%"],
                      ["Bond income fund", "18%"],
                      ["Cash reserve", "10%"],
                    ].map(([label, percent]) => (
                      <div key={label}>
                        <div className="mb-2 flex justify-between text-sm">
                          <span className="font-medium">{label}</span>
                          <span className="text-slate-500">{percent}</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-100">
                          <div
                            className="h-2 rounded-full bg-[#d6ad42]"
                            style={{ width: percent }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h2 className="font-serif text-2xl font-semibold">Retirement accounts</h2>
                  <button
                    type="button"
                    onClick={() => setTab("transactions")}
                    className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-[#003d8f] hover:bg-slate-50"
                  >
                    View activity
                  </button>
                </div>

                <div className="mt-5 grid gap-5 md:grid-cols-3">
                  {retirementAccounts.map((account: any) => (
                    <div
                      key={account.id}
                      className="rounded-2xl border border-slate-200 bg-[#fbfcfe] p-6"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-semibold">{account.displayName}</div>
                          <div className="mt-1 text-sm text-slate-500">{mask(account.number)}</div>
                        </div>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500">
                          {account.type}
                        </span>
                      </div>
                      <div className="mt-6 text-3xl font-bold tracking-tight">
                        {money(account.balance)}
                      </div>
                      <p className="mt-3 text-sm text-slate-500">{account.accountNote}</p>
                      <button
                        type="button"
                        onClick={() => setTab("transactions")}
                        className="mt-6 text-sm font-semibold text-[#003d8f] hover:underline"
                      >
                        View account details →
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="font-serif text-2xl font-semibold">What would you like to do?</h2>
                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {quickActions.map((action) => (
                    <button
                      key={action.label}
                      type="button"
                      onClick={() => setTab(action.target)}
                      className="group rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-[#d6ad42] hover:shadow-md"
                    >
                      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#071f46]/5 text-sm font-black text-[#071f46]">
                        {action.icon}
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-bold">{action.label}</div>
                        <ArrowRight className="h-4 w-4 text-[#071f46] transition group-hover:translate-x-1" />
                      </div>
                      <p className="mt-3 text-sm leading-5 text-slate-600">{action.desc}</p>
                    </button>
                  ))}
                </div>
              </section>

              <div className="grid gap-6 xl:grid-cols-[1.55fr_0.85fr]">
                <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-serif text-2xl font-semibold">Recent retirement activity</h2>
                    <button
                      type="button"
                      onClick={() => setTab("transactions")}
                      className="text-sm font-semibold text-[#003d8f] hover:underline"
                    >
                      View all
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] text-left text-sm">
                      <thead className="border-b text-xs uppercase tracking-widest text-slate-500">
                        <tr>
                          <th className="py-3">Date</th>
                          <th>Activity</th>
                          <th>Account</th>
                          <th>Amount</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentTransactions.slice(0, 6).map((row: any) => (
                          <tr key={row.id} className="border-b border-slate-100 last:border-0">
                            <td className="py-4">{new Date(row.createdAt).toLocaleDateString()}</td>
                            <td className="font-medium">{row.description}</td>
                            <td>{row.accountType}</td>
                            <td
                              className={
                                row.direction === "credit"
                                  ? "font-semibold text-emerald-700"
                                  : "font-semibold text-[#071f46]"
                              }
                            >
                              {row.direction === "credit" ? "+" : "-"}
                              {money(row.amount)}
                            </td>
                            <td>
                              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                {row.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="font-serif text-2xl font-semibold">Guidance & alerts</h2>
                  <div className="mt-5 grid gap-3">
                    <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900">
                      <ShieldCheck className="mr-2 inline h-4 w-4" />
                      Your secure email OTP protection is active.
                    </div>
                    <div className="rounded-2xl bg-blue-50 p-4 text-sm text-blue-900">
                      <Bell className="mr-2 inline h-4 w-4" />
                      {dashboard.data?.unreadNotifications ?? 0} unread account notifications.
                    </div>
                    <div className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">
                      <AlertCircle className="mr-2 inline h-4 w-4" />
                      Withdrawal and rollover requests require review before processing.
                    </div>
                  </div>
                </section>
              </div>
            </div>
          )}

          {tab === "transactions" && <TransactionHistory />}
          {tab === "payments" && <Payments />}
          {tab === "statements" && <Statements rows={statements.data ?? []} />}
          {tab === "settings" && (
            <Panel title="Profile, Beneficiaries & Security">
              <div className="grid gap-5 md:grid-cols-2">
                <Setting label="Full name" value="Emily Ann Johnson" />
                <Setting label="Email" value="emily.johnson@cbhfinance.online" />
                <Setting label="Phone" value="+1 (415) 555-0198" />
                <Setting label="Mailing address" value="2128 Pacific Heights Avenue, San Francisco, CA 94115" />
                <Setting label="Primary beneficiary" value="Not displayed in portal preview" />
                <Setting label="Security" value="Email OTP verification active" />
              </div>
            </Panel>
          )}
        </div>
      </main>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-[1.5rem] border border-[#0a1f44]/10 bg-white p-6 shadow-sm"><h2 className="mb-5 font-serif text-2xl font-semibold">{title}</h2>{children}</section>;
}

function Setting({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-[#f8f6f1] p-4"><div className="text-xs font-bold uppercase tracking-widest text-slate-500">{label}</div><div className="mt-1 font-semibold">{value}</div></div>;
}

function formatSafeDate(value: string) {
  const date = new Date(value);
  const today = new Date();

  if (Number.isNaN(date.getTime())) return "Pending";
  if (date.getTime() > today.getTime()) return today.toLocaleDateString();

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function retirementActivityLabel(row: any) {
  const text = `${row.description ?? ""} ${row.method ?? ""}`.toLowerCase();

  if (text.includes("dividend") || text.includes("market gain") || text.includes("investment")) {
    return "Dividend Reinvestment";
  }

  if (text.includes("interest")) {
    return "Cash Reserve Interest";
  }

  if (text.includes("payroll") || text.includes("direct deposit") || text.includes("contribution")) {
    return "Employee Contribution";
  }

  if (text.includes("admin credit")) {
    return "Plan Contribution Adjustment";
  }

  if (text.includes("transfer from")) {
    return "Transfer In";
  }

  if (text.includes("transfer to")) {
    return "Transfer Out";
  }

  if (text.includes("wire")) {
    return "Rollover / Transfer Review";
  }

  if (text.includes("fee")) {
    return "Plan Administration Fee";
  }

  if (row.direction === "credit") {
    return "Retirement Account Credit";
  }

  return "Account Activity";
}

function retirementActivityType(row: any) {
  const label = retirementActivityLabel(row).toLowerCase();

  if (label.includes("contribution")) return "Contribution";
  if (label.includes("dividend")) return "Investment";
  if (label.includes("interest")) return "Interest";
  if (label.includes("transfer")) return "Transfer";
  if (label.includes("fee")) return "Fee";

  return "Activity";
}

function retirementAccountName(accountType: string) {
  if (accountType === "Checking") return "Traditional Retirement Savings";
  if (accountType === "Savings") return "High-Yield Cash Reserve";
  if (accountType === "IRA") return "Individual Retirement Account";
  return accountType;
}

function TransactionTable({ rows }: { rows: any[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="bg-[#f8fafc] text-xs uppercase tracking-widest text-slate-500">
            <tr>
              <th className="px-5 py-4">Date</th>
              <th className="px-5 py-4">Activity</th>
              <th className="px-5 py-4">Type</th>
              <th className="px-5 py-4">Account</th>
              <th className="px-5 py-4 text-right">Amount</th>
              <th className="px-5 py-4 text-right">Balance</th>
              <th className="px-5 py-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => {
              const activity = retirementActivityLabel(row);
              const type = retirementActivityType(row);
              const isCredit = row.direction === "credit";

              return (
                <tr key={row.id} className="border-t border-slate-100 hover:bg-[#fbfcfe]">
                  <td className="px-5 py-4 font-medium text-slate-700">
                    {formatSafeDate(row.createdAt)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-[#071f46]">{activity}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      Ref {row.referenceId} · {row.method}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-[#071f46]/5 px-3 py-1 text-xs font-semibold text-[#071f46]">
                      {type}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {retirementAccountName(row.accountType)}
                  </td>
                  <td
                    className={`px-5 py-4 text-right font-semibold ${
                      isCredit ? "text-emerald-700" : "text-[#071f46]"
                    }`}
                  >
                    {isCredit ? "+" : "-"}
                    {money(row.amount)}
                  </td>
                  <td className="px-5 py-4 text-right font-medium text-slate-700">
                    {money(row.balanceAfter)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        row.status === "Completed"
                          ? "bg-emerald-50 text-emerald-700"
                          : row.status === "Pending"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              );
            })}

            {!rows.length && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-sm text-slate-500">
                  No retirement activity matched your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TransactionHistory() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [method, setMethod] = useState<any>("All");
  const [accountType, setAccountType] = useState<any>("All");

  const query = trpc.banking.transactions.useQuery({
    page,
    search,
    method,
    accountType,
    status: "All",
  });

  const rows = query.data?.rows ?? [];

  const csv = useMemo(
    () =>
      rows
        .map((r: any) =>
          [
            formatSafeDate(r.createdAt),
            retirementActivityLabel(r),
            retirementActivityType(r),
            retirementAccountName(r.accountType),
            r.method,
            r.referenceId,
            r.direction,
            r.amount,
            r.balanceAfter,
            r.status,
          ].join(",")
        )
        .join("\n"),
    [rows]
  );

  return (
    <div className="grid gap-6">
      <section className="rounded-[2rem] bg-[#071f46] p-8 text-white shadow-xl">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <div className="text-xs uppercase tracking-[0.35em] text-[#d6ad42]">
              Retirement Account Activity
            </div>
            <h2 className="mt-2 font-serif text-4xl font-semibold">Activity & Transactions</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
              Review contributions, transfers, dividend reinvestments, interest credits,
              plan adjustments, and retirement account activity.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = "cbhfinance-retirement-activity.csv";
              document.body.appendChild(link);
              link.click();
              link.remove();
              URL.revokeObjectURL(url);
            }}
            className="rounded-full bg-[#d6ad42] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-black/10"
          >
            Export activity
          </button>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
          <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              placeholder="Search activity, reference, contribution, rollover..."
              className="w-full outline-none"
            />
          </label>

          <select
            value={accountType}
            onChange={(e) => {
              setPage(1);
              setAccountType(e.target.value);
            }}
            className="rounded-2xl border border-slate-200 px-4 py-3"
          >
            <option>All</option>
            <option>Checking</option>
            <option>Savings</option>
            <option>IRA</option>
          </select>

          <select
            value={method}
            onChange={(e) => {
              setPage(1);
              setMethod(e.target.value);
            }}
            className="rounded-2xl border border-slate-200 px-4 py-3"
          >
            <option>All</option>
            <option>ACH</option>
            <option>Internal</option>
            <option>Interest</option>
            <option>Investment</option>
            <option>Wire</option>
            <option>Admin</option>
          </select>
        </div>

        <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
          {["Contributions", "Transfers", "Investment Activity", "Interest", "Fees"].map((chip) => (
            <span key={chip} className="rounded-full bg-[#f6f7fb] px-3 py-1 text-slate-600">
              {chip}
            </span>
          ))}
        </div>
      </section>

      <TransactionTable rows={rows} />

      <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
        <span className="text-slate-600">
          Page {query.data?.page ?? page} of {query.data?.pageCount ?? 1} · 25 records per page
        </span>

        <div className="flex gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={page >= (query.data?.pageCount ?? 1)}
            onClick={() => setPage(page + 1)}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

function Payments() {
  const utils = trpc.useUtils();
  const block = trpc.banking.blockPayment.useMutation();
  const transfer = trpc.banking.transfer.useMutation({
    onSuccess: async () => {
      await utils.banking.dashboard.invalidate();
      await utils.banking.accounts.invalidate();
      await utils.banking.transactions.invalidate();
    },
  });

  const accounts = trpc.banking.accounts.useQuery();
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [formData, setFormData] = useState({ fromAccount: "", toAccount: "", amount: "", memo: "" });
  const [submitting, setSubmitting] = useState(false);
  const [reviewNotice, setReviewNotice] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const contributionActions = [
    {
      name: "One-Time Contribution",
      desc: "Add funds to your retirement savings profile.",
      icon: "CON",
      type: "review",
    },
    {
      name: "Recurring Contribution",
      desc: "Set up a scheduled retirement contribution.",
      icon: "REC",
      type: "review",
    },
    {
      name: "Internal Transfer",
      desc: "Move funds between eligible CBHfinance accounts.",
      icon: "TRN",
      type: "transfer",
    },
    {
      name: "Rollover Request",
      desc: "Start a rollover from another retirement provider.",
      icon: "ROL",
      type: "review",
    },
    {
      name: "Withdrawal Review",
      desc: "Request a distribution or withdrawal review.",
      icon: "WDR",
      type: "review",
    },
    {
      name: "Contribution Limits",
      desc: "Review annual limits and account guidance.",
      icon: "LIM",
      type: "info",
    },
  ];

  const accountLabel = (account: any) => {
    const name =
      account.type === "Checking"
        ? "Traditional Retirement Savings"
        : account.type === "Savings"
          ? "High-Yield Cash Reserve"
          : account.type === "IRA"
            ? "Individual Retirement Account"
            : account.type;

    return `${name} · ${account.number} · ${money(account.balance)}`;
  };

  function resetForm(actionName?: string) {
    setActiveForm(actionName ?? null);
    setFormData({ fromAccount: "", toAccount: "", amount: "", memo: "" });
    setReviewNotice(null);
    setSuccess(false);
  }

  async function submitContributionAction(e: FormEvent) {
    e.preventDefault();

    if (!activeForm) return;

    setSubmitting(true);
    setReviewNotice(null);
    setSuccess(false);

    try {
      if (activeForm === "Internal Transfer") {
        if (!formData.fromAccount || !formData.toAccount) {
          throw new Error("Please select both source and destination accounts.");
        }

        if (formData.fromAccount === formData.toAccount) {
          throw new Error("Source and destination accounts must be different.");
        }

        await transfer.mutateAsync({
          fromAccountId: formData.fromAccount,
          toAccountId: formData.toAccount,
          amount: Number(formData.amount) || 100,
          memo: formData.memo || "Retirement account transfer",
        });

        setSuccess(true);
        return;
      }

      if (activeForm === "Contribution Limits") {
        setReviewNotice(
          "Contribution limits are displayed for planning guidance. Final eligibility depends on account type, age, tax year, income, and plan rules."
        );
        return;
      }

      await block.mutateAsync({
        paymentType: "ACH",
        amount: Number(formData.amount) || 100,
        memo: formData.memo || `${activeForm} submitted for review`,
      });

      setReviewNotice(
        `${activeForm} has been captured for review. Retirement contributions, rollovers, and distributions require plan-level verification before processing.`
      );
    } catch (err: any) {
      setReviewNotice(err?.message || "This request could not be completed online. Please contact support.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-6">
      <section className="rounded-[2rem] bg-[#071f46] p-8 text-white shadow-xl">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <div className="text-xs uppercase tracking-[0.35em] text-[#d6ad42]">
              Contributions & Transfers
            </div>
            <h2 className="mt-2 font-serif text-4xl font-semibold">
              Manage retirement money movement
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/70">
              Submit contribution, transfer, rollover, and withdrawal review requests.
              Internal transfers between eligible CBHfinance accounts may process immediately;
              other retirement requests require review before completion.
            </p>
          </div>

          <div className="rounded-3xl border border-white/15 bg-white/5 p-5 text-sm">
            <div className="text-white/55">Online request status</div>
            <div className="mt-2 text-2xl font-semibold">Review required</div>
            <p className="mt-2 max-w-xs text-xs leading-5 text-white/60">
              Rollovers, withdrawals, and new external contributions are reviewed for plan compliance.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {contributionActions.map((action) => (
          <button
            key={action.name}
            type="button"
            onClick={() => resetForm(action.name)}
            className={`rounded-2xl border bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#d6ad42] hover:shadow-md ${
              activeForm === action.name ? "border-[#d6ad42]" : "border-slate-200"
            }`}
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#071f46]/5 text-sm font-black text-[#071f46]">
              {action.icon}
            </div>
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-serif text-xl font-semibold text-[#071f46]">{action.name}</h3>
              <ArrowRight className="h-4 w-4 text-[#071f46]" />
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{action.desc}</p>
          </button>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="font-serif text-2xl font-semibold">
                {activeForm ?? "Select a request type"}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {activeForm
                  ? "Complete the details below. Some requests are submitted for review instead of immediate processing."
                  : "Choose one of the retirement actions above to begin."}
              </p>
            </div>
            {activeForm && (
              <button
                type="button"
                onClick={() => resetForm()}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-[#071f46] hover:bg-slate-50"
              >
                Clear
              </button>
            )}
          </div>

          {activeForm ? (
            <form onSubmit={submitContributionAction} className="grid gap-4">
              {activeForm === "Internal Transfer" ? (
                <>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      From account
                    </label>
                    <select
                      value={formData.fromAccount}
                      onChange={(e) =>
                        setFormData({ ...formData, fromAccount: e.target.value, toAccount: "" })
                      }
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#d6ad42]"
                      required
                    >
                      <option value="">Select source account</option>
                      {accounts.data?.map((account: any) => (
                        <option key={account.id} value={account.id}>
                          {accountLabel(account)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      To account
                    </label>
                    <select
                      value={formData.toAccount}
                      onChange={(e) => setFormData({ ...formData, toAccount: e.target.value })}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#d6ad42]"
                      required
                    >
                      <option value="">Select destination account</option>
                      {accounts.data
                        ?.filter((account: any) => account.id !== formData.fromAccount)
                        .map((account: any) => (
                          <option key={account.id} value={account.id}>
                            {accountLabel(account)}
                          </option>
                        ))}
                    </select>
                  </div>
                </>
              ) : (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Destination / request details
                  </label>
                  <input
                    type="text"
                    placeholder={
                      activeForm === "Rollover Request"
                        ? "Current provider or plan name"
                        : activeForm === "Withdrawal Review"
                          ? "Reason for distribution review"
                          : activeForm === "Recurring Contribution"
                            ? "Contribution schedule, e.g. monthly"
                            : "Contribution or request details"
                    }
                    value={formData.fromAccount}
                    onChange={(e) => setFormData({ ...formData, fromAccount: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#d6ad42]"
                  />
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Amount
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#d6ad42]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Memo / notes
                </label>
                <input
                  type="text"
                  placeholder="Optional note for retirement services"
                  value={formData.memo}
                  onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#d6ad42]"
                />
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-[#071f46] px-7 py-3 font-semibold text-white transition disabled:opacity-50"
                >
                  {submitting
                    ? "Processing..."
                    : activeForm === "Internal Transfer"
                      ? "Submit transfer"
                      : "Submit for review"}
                </button>

                <button
                  type="button"
                  onClick={() => resetForm()}
                  className="rounded-full border border-slate-200 px-7 py-3 font-semibold text-[#071f46] hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="rounded-2xl bg-[#f6f7fb] p-6 text-sm text-slate-600">
              Select a contribution, rollover, transfer, or review option above.
            </div>
          )}

          {success && (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900">
              <div className="font-serif text-xl font-semibold">Transfer completed</div>
              <p className="mt-2 text-sm leading-6">
                Your internal transfer of {money(Number(formData.amount || 0))} has been processed,
                and your account balances have been updated.
              </p>
            </div>
          )}

          {reviewNotice && (
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
              <AlertCircle className="mr-2 inline h-4 w-4" />
              <span className="text-sm leading-6">{reviewNotice}</span>
            </div>
          )}
        </section>

        <aside className="grid gap-6">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-serif text-2xl font-semibold">Contribution guidance</h3>
            <div className="mt-5 grid gap-4 text-sm text-slate-600">
              <div className="rounded-2xl bg-[#f6f7fb] p-4">
                <div className="font-semibold text-[#071f46]">Annual limits</div>
                <p className="mt-2 leading-6">
                  Contribution eligibility can vary by account type, tax year, age, income,
                  and plan rules.
                </p>
              </div>
              <div className="rounded-2xl bg-[#f6f7fb] p-4">
                <div className="font-semibold text-[#071f46]">Rollovers</div>
                <p className="mt-2 leading-6">
                  Rollover requests require provider verification before assets are accepted.
                </p>
              </div>
              <div className="rounded-2xl bg-[#f6f7fb] p-4">
                <div className="font-semibold text-[#071f46]">Withdrawals</div>
                <p className="mt-2 leading-6">
                  Withdrawals and distributions may require review, documentation, and tax reporting.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-serif text-2xl font-semibold">Eligible accounts</h3>
            <div className="mt-5 grid gap-3">
              {accounts.data?.map((account: any) => (
                <div key={account.id} className="rounded-2xl bg-[#f6f7fb] p-4">
                  <div className="font-semibold text-[#071f46]">
                    {account.type === "Checking"
                      ? "Traditional Retirement Savings"
                      : account.type === "Savings"
                        ? "High-Yield Cash Reserve"
                        : account.type === "IRA"
                          ? "Individual Retirement Account"
                          : account.type}
                  </div>
                  <div className="mt-1 text-sm text-slate-500">{account.number}</div>
                  <div className="mt-2 font-semibold">{money(account.balance)}</div>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function Statements({ rows }: { rows: any[] }) {
  const [documentType, setDocumentType] = useState("All");

  const documentGroups = [
    {
      type: "Statements",
      title: "Account Statements",
      desc: "Monthly retirement account statements and balance summaries.",
      count: rows.length,
    },
    {
      type: "Tax Forms",
      title: "Tax Forms",
      desc: "Annual tax documents including contribution and distribution records.",
      count: 4,
    },
    {
      type: "Confirmations",
      title: "Contribution Confirmations",
      desc: "Records for contributions, transfers, and rollover review requests.",
      count: 9,
    },
    {
      type: "Plan Notices",
      title: "Plan Notices",
      desc: "Disclosures, fee notices, and plan communication documents.",
      count: 6,
    },
  ];

  const supplementalDocs = [
    {
      id: "tax-2025-5498",
      type: "Tax Forms",
      title: "2025 Form 5498 IRA Contribution Information",
      date: "Jan 31, 2026",
      status: "Available",
    },
    {
      id: "tax-2025-1099r",
      type: "Tax Forms",
      title: "2025 Form 1099-R Distribution Information",
      date: "Jan 31, 2026",
      status: "Not issued",
    },
    {
      id: "confirm-rollover",
      type: "Confirmations",
      title: "Rollover Request Confirmation",
      date: "May 12, 2026",
      status: "Available",
    },
    {
      id: "confirm-contribution",
      type: "Confirmations",
      title: "Contribution Election Confirmation",
      date: "May 1, 2026",
      status: "Available",
    },
    {
      id: "notice-fee",
      type: "Plan Notices",
      title: "Annual Plan Fee Disclosure",
      date: "Apr 15, 2026",
      status: "Available",
    },
    {
      id: "notice-beneficiary",
      type: "Plan Notices",
      title: "Beneficiary Review Reminder",
      date: "Mar 28, 2026",
      status: "Available",
    },
  ];

  const monthlyDocs = rows.slice(0, 36).map((row: any) => ({
    id: row.id,
    type: "Statements",
    title: `${retirementAccountName(row.accountType)} Statement`,
    accountType: row.accountType,
    period: row.period,
    date: row.generatedAt ? formatSafeDate(row.generatedAt) : row.period,
    status: "Available",
    fileUrl: row.fileUrl,
    fileName: `CBHfinance-${row.accountType}-${row.period}.pdf`,
  }));

  const allDocuments = [...monthlyDocs, ...supplementalDocs];

  const filteredDocuments =
    documentType === "All"
      ? allDocuments
      : allDocuments.filter((document: any) => document.type === documentType);

  return (
    <div className="grid gap-6">
      <section className="rounded-[2rem] bg-[#071f46] p-8 text-white shadow-xl">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <div className="text-xs uppercase tracking-[0.35em] text-[#d6ad42]">
              Statements & Documents
            </div>
            <h2 className="mt-2 font-serif text-4xl font-semibold">
              Retirement document center
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/70">
              Access retirement account statements, tax forms, contribution confirmations,
              rollover records, plan notices, and secure disclosures.
            </p>
          </div>

          <div className="rounded-3xl border border-white/15 bg-white/5 p-5 text-sm">
            <div className="text-white/55">Document delivery</div>
            <div className="mt-2 text-2xl font-semibold">Electronic</div>
            <p className="mt-2 max-w-xs text-xs leading-5 text-white/60">
              New documents are posted to your secure portal when available.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {documentGroups.map((group) => (
          <button
            key={group.type}
            type="button"
            onClick={() => setDocumentType(group.type)}
            className={`rounded-2xl border bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#d6ad42] hover:shadow-md ${
              documentType === group.type ? "border-[#d6ad42]" : "border-slate-200"
            }`}
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#071f46]/5 text-sm font-black text-[#071f46]">
              {group.type === "Statements"
                ? "PDF"
                : group.type === "Tax Forms"
                  ? "TAX"
                  : group.type === "Confirmations"
                    ? "CNF"
                    : "DOC"}
            </div>
            <div className="font-serif text-xl font-semibold text-[#071f46]">{group.title}</div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{group.desc}</p>
            <div className="mt-5 text-xs font-bold uppercase tracking-widest text-slate-400">
              {group.count} documents
            </div>
          </button>
        ))}
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-2xl font-semibold">Available documents</h3>
            <p className="mt-2 text-sm text-slate-600">
              Filter by document category or download records directly from the portal.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {["All", "Statements", "Tax Forms", "Confirmations", "Plan Notices"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setDocumentType(type)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  documentType === type
                    ? "bg-[#071f46] text-white"
                    : "border border-slate-200 bg-white text-[#071f46] hover:bg-slate-50"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-[#f8fafc] text-xs uppercase tracking-widest text-slate-500">
                <tr>
                  <th className="px-5 py-4">Document</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Period / Date</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredDocuments.map((document: any) => (
                  <tr key={document.id} className="border-t border-slate-100 hover:bg-[#fbfcfe]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#071f46]/5">
                          <FileText className="h-5 w-5 text-[#d6ad42]" />
                        </div>
                        <div>
                          <div className="font-semibold text-[#071f46]">{document.title}</div>
                          <div className="mt-1 text-xs text-slate-500">
                            {document.accountType ? retirementAccountName(document.accountType) : "CBHfinance record"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-[#071f46]/5 px-3 py-1 text-xs font-semibold text-[#071f46]">
                        {document.type}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {document.period ?? document.date}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          document.status === "Available"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {document.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {document.fileUrl ? (
                        <a
                          download={document.fileName}
                          href={document.fileUrl}
                          className="rounded-full bg-[#071f46] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0b2d63]"
                        >
                          Download
                        </a>
                      ) : (
                        <button
                          type="button"
                          className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-[#071f46] hover:bg-slate-50"
                        >
                          View details
                        </button>
                      )}
                    </td>
                  </tr>
                ))}

                {!filteredDocuments.length && (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-sm text-slate-500">
                      No documents matched this category.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-serif text-xl font-semibold">Tax form timing</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Tax documents are posted when available based on account activity and reporting requirements.
          </p>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-serif text-xl font-semibold">Secure delivery</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Electronic statements and notices are delivered through your protected CBHfinance portal.
          </p>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-serif text-xl font-semibold">Record retention</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Keep copies of statements, confirmations, and tax forms with your retirement records.
          </p>
        </div>
      </section>
    </div>
  );
}

function AdminPanel() {
  const [session, setSession] = useState<DemoSession | null>(() => readSession());
  const [location] = useLocation();
  const tab = new URLSearchParams(location.split("?")[1] ?? "").get("tab") ?? "dashboard";
  const token = session?.token ?? "";
  const overview = trpc.banking.adminOverview.useQuery({ token }, { enabled: Boolean(session && session.role === "admin") });
  const audit = trpc.banking.auditLogs.useQuery({ token }, { enabled: Boolean(session && session.role === "admin") });
  const paymentSettings = trpc.banking.paymentSettings.useQuery();
  const supportCases = trpc.banking.supportCases.useQuery({ token }, { enabled: Boolean(session && session.role === "admin") });
  const [adminPage, setAdminPage] = useState(1); const [adminSearch, setAdminSearch] = useState(""); const [adminMethod, setAdminMethod] = useState<any>("All"); const [adminStatus, setAdminStatus] = useState<any>("All");
  const txns = trpc.banking.transactions.useQuery({ page: adminPage, accountType: "All", method: adminMethod, status: adminStatus, search: adminSearch }, { enabled: Boolean(session && session.role === "admin") });
  const utils = trpc.useUtils();
  const adjust = trpc.banking.adminAdjustBalance.useMutation({ onSuccess: async () => { await utils.banking.adminOverview.invalidate(); await utils.banking.transactions.invalidate(); await utils.banking.auditLogs.invalidate(); } });
  const setStatus = trpc.banking.adminSetCustomerStatus.useMutation({ onSuccess: async () => { await utils.banking.adminOverview.invalidate(); await utils.banking.auditLogs.invalidate(); } });
  const updateSupport = trpc.banking.updateSupportCaseStatus.useMutation({ onSuccess: async () => { await utils.banking.supportCases.invalidate(); await utils.banking.adminOverview.invalidate(); await utils.banking.auditLogs.invalidate(); } });
  const [accountId, setAccountId] = useState("acc_checking"); const [action, setAction] = useState<"Credit" | "Debit">("Credit"); const [amount, setAmount] = useState(100); const [description, setDescription] = useState("Manual account review adjustment"); const [message, setMessage] = useState("");
  const adminCsv = useMemo(() => (txns.data?.rows ?? []).map((r: any) => [r.createdAt, r.description, r.accountType, r.method, r.referenceId, r.direction, r.amount, r.balanceAfter, r.status].join(",")).join("\n"), [txns.data]);
  if (!session || session.role !== "admin") return <LoginPage role="admin" onAuthenticated={setSession} />;
  async function submitAdjustment(e: FormEvent) { e.preventDefault(); setMessage(""); try { await adjust.mutateAsync({ token, accountId, action, amount, description }); setMessage("Adjustment posted, transaction created, and immutable audit log recorded."); } catch (err: any) { setMessage(err.message); } }
  return <PortalLayout title="Secure Admin Panel" role="admin">{tab === "dashboard" && <div className="grid gap-6"><div className="grid gap-5 md:grid-cols-4">{[["Total Users", overview.data?.totalUsers], ["Total Deposits", overview.data ? money(overview.data.totalDeposits) : "Loading"], ["Transactions Today", overview.data?.totalTransactionsToday], ["Pending Reviews", overview.data?.pendingReviews]].map(([k, v]) => <div key={k as string} className="rounded-[1.5rem] bg-white p-6 shadow-sm"><div className="text-sm text-slate-500">{k}</div><div className="mt-2 font-serif text-3xl font-semibold">{v}</div></div>)}</div><Panel title="Admin Credit & Debit Control"><form onSubmit={submitAdjustment} className="grid gap-4 md:grid-cols-5"><select value={accountId} onChange={e => setAccountId(e.target.value)} className="rounded-2xl border px-4 py-3">{overview.data?.accounts.map(a => <option key={a.id} value={a.id}>{a.type} · {a.number}</option>)}</select><select value={action} onChange={e => setAction(e.target.value as any)} className="rounded-2xl border px-4 py-3"><option>Credit</option><option>Debit</option></select><input type="number" min="0.01" step="0.01" value={amount} onChange={e => setAmount(Number(e.target.value))} className="rounded-2xl border px-4 py-3" /><input value={description} onChange={e => setDescription(e.target.value)} className="rounded-2xl border px-4 py-3 md:col-span-1" required /><button className="rounded-full bg-[#0a1f44] px-5 py-3 font-semibold text-white">Post</button></form>{message && <div className="mt-4 rounded-2xl bg-[#f8f6f1] p-4 text-sm">{message}</div>}</Panel><Panel title="Recent Admin Activity"><div className="grid gap-3">{overview.data?.recentActivity.map(log => <div key={log.id} className="rounded-2xl bg-[#f8f6f1] p-4 text-sm"><strong>{log.actionType}</strong> · {log.details}</div>)}</div></Panel></div>}{tab === "users" && <Panel title="User Management"><div className="rounded-2xl bg-[#f8f6f1] p-5"><UserRound className="mb-3 h-7 w-7 text-[#c9a84c]" /><div className="font-serif text-2xl font-semibold">Emily Ann Johnson</div><p className="mt-2 text-sm text-slate-600">{overview.data?.customer.status ?? "Active"} · Member since March 2019 · Routing 121000248</p><div className="mt-5 flex flex-wrap gap-3"><button onClick={() => setStatus.mutate({ token, status: "Active" })} className="rounded-full border px-4 py-2 font-semibold">Mark Active</button><button onClick={() => setStatus.mutate({ token, status: "Suspended" })} className="rounded-full border px-4 py-2 font-semibold">Suspend</button><button onClick={() => setStatus.mutate({ token, status: "Locked" })} className="rounded-full bg-[#0a1f44] px-4 py-2 font-semibold text-white">Lock</button></div><div className="mt-5 grid gap-3 md:grid-cols-3">{overview.data?.accounts.map(a => <div key={a.id} className="rounded-2xl bg-white p-4"><div className="font-semibold">{a.type}</div><div>{a.number}</div><div>{money(a.balance)}</div></div>)}</div><div className="mt-6"><h3 className="mb-3 font-serif text-xl font-semibold">User Transaction View</h3><TransactionTable rows={txns.data?.rows.slice(0, 5) ?? []} /></div></div></Panel>} {tab === "support" && <Panel title="Support Case Review"><p className="mb-5 text-slate-600">Submitted Contact Support requests are captured by the backend and exposed here for operational review.</p><div className="grid gap-3">{supportCases.isLoading ? <div className="rounded-2xl bg-[#f8f6f1] p-5 text-sm text-slate-600">Loading support cases...</div> : supportCases.isError ? <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">Unable to load support cases. Please refresh the admin panel.</div> : supportCases.data?.length ? supportCases.data.map(ticket => <div key={ticket.id} className="rounded-2xl bg-[#f8f6f1] p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="text-xs font-bold uppercase tracking-widest text-[#c9a84c]">{ticket.caseNumber} · {ticket.status}</div><h3 className="mt-2 font-serif text-xl font-semibold">{ticket.subject}</h3><p className="mt-1 text-sm text-slate-600">{ticket.fullName} · {ticket.email} · {new Date(ticket.createdAt).toLocaleString()}</p></div><div className="flex gap-2"><button onClick={() => updateSupport.mutate({ token, id: ticket.id, status: "In Review" })} className="rounded-full border px-3 py-2 text-sm font-semibold">Review</button><button onClick={() => updateSupport.mutate({ token, id: ticket.id, status: "Closed" })} className="rounded-full bg-[#0a1f44] px-3 py-2 text-sm font-semibold text-white">Close</button></div></div><p className="mt-4 text-sm leading-6 text-slate-700">{ticket.message}</p></div>) : <div className="rounded-2xl bg-[#f8f6f1] p-5 text-sm text-slate-600">No support cases have been submitted yet.</div>}</div></Panel>}{tab === "transactions" && <Panel title="Global Transaction Management"><div className="mb-5 grid gap-3 md:grid-cols-5"><input value={adminSearch} onChange={e => { setAdminPage(1); setAdminSearch(e.target.value); }} placeholder="Search" className="rounded-2xl border px-4 py-3" /><select value={adminMethod} onChange={e => { setAdminPage(1); setAdminMethod(e.target.value); }} className="rounded-2xl border px-4 py-3"><option>All</option><option>ACH</option><option>Wire</option><option>Zelle</option><option>Bill Pay</option><option>Internal</option><option>Interest</option><option>Investment</option><option>Admin</option></select><select value={adminStatus} onChange={e => { setAdminPage(1); setAdminStatus(e.target.value); }} className="rounded-2xl border px-4 py-3"><option>All</option><option>Completed</option><option>Pending</option><option>Failed</option></select><button type="button" className="rounded-full border border-[#0a1f44]/20 px-5 py-3 font-semibold">Approve pending</button><a download="cbhfinance-admin-transactions.csv" href={`data:text/csv;charset=utf-8,${encodeURIComponent(adminCsv)}`} className="rounded-full bg-[#0a1f44] px-5 py-3 text-center font-semibold text-white">Export CSV</a></div><TransactionTable rows={txns.data?.rows ?? []} /><div className="mt-5 flex items-center justify-between text-sm"><span>Page {txns.data?.page ?? adminPage} of {txns.data?.pageCount ?? 1} · exactly 25 records per page</span><div className="flex gap-2"><button disabled={adminPage <= 1} onClick={() => setAdminPage(adminPage - 1)} className="rounded-full border px-4 py-2 disabled:opacity-40">Previous</button><button disabled={adminPage >= (txns.data?.pageCount ?? 1)} onClick={() => setAdminPage(adminPage + 1)} className="rounded-full border px-4 py-2 disabled:opacity-40">Next</button></div></div></Panel>}{tab === "payments" && <Panel title="Payment Settings"><div className="grid gap-4 md:grid-cols-2"><Setting label="Global outgoing payments" value={paymentSettings.data?.globalOutgoingPaymentsEnabled ? "Enabled" : "Disabled"} /><Setting label="Per-user outgoing payments" value={paymentSettings.data?.perUserOutgoingPaymentsEnabled ? "Enabled" : "Disabled"} /><Setting label="Daily transfer limit" value={money(paymentSettings.data?.dailyTransferLimit ?? 0)} /><Setting label="Maintenance notice" value={paymentSettings.data?.maintenanceNotice ?? "Loading"} /></div><p className="mt-5 rounded-2xl bg-[#f8f6f1] p-4 text-sm text-slate-700">Controls are visible and locked to disabled so all outgoing user payments remain blocked.</p></Panel>}{tab === "audit" && <Panel title="Immutable Audit Log"><p className="mb-5 text-slate-600">Audit records are append-only. No edit or delete action is exposed in the UI or server procedures.</p><div className="grid gap-3">{audit.data?.map(log => <div key={log.id} className="rounded-2xl bg-[#f8f6f1] p-4 text-sm"><strong>{log.actionType}</strong> · {new Date(log.createdAt).toLocaleString()} · {log.details} · IP {log.ipAddress}</div>)}</div></Panel>}</PortalLayout>;
}

function LegalPage({ type }: { type: "terms" | "privacy" | "contact" }) {
  const title = type === "terms" ? "Terms of Service" : type === "privacy" ? "Privacy Policy" : "Contact Support";
  const support = trpc.banking.createSupportCase.useMutation();
  const [supportForm, setSupportForm] = useState({ fullName: "", email: "", subject: "", message: "" });
  const [supportMessage, setSupportMessage] = useState("");
  async function submitSupport(event: FormEvent) {
    event.preventDefault();
    setSupportMessage("");
    try {
      await support.mutateAsync(supportForm);
      setSupportMessage("Thank you for contacting us. We'll respond within 24 hours.");
      setSupportForm({ fullName: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      setSupportMessage(err.message);
    }
  }
  return (
    <div className="min-h-screen bg-[#f8f6f1] text-[#0a1f44]">
      <MarketingNav />
      <main className="container py-20">
        {type === "contact" ? (
          <div className="max-w-2xl">
            <h1 className="font-serif text-5xl font-semibold">Contact Support</h1>
            <p className="mt-4 text-slate-600">Have a question or need assistance? We're here to help.</p>
            <form onSubmit={submitSupport} className="mt-10 space-y-5 rounded-[2rem] border border-[#0a1f44]/10 bg-white p-8">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                <input type="text" value={supportForm.fullName} onChange={e => setSupportForm({ ...supportForm, fullName: e.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#c9a84c]" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                <input type="email" value={supportForm.email} onChange={e => setSupportForm({ ...supportForm, email: e.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#c9a84c]" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
                <input type="text" value={supportForm.subject} onChange={e => setSupportForm({ ...supportForm, subject: e.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#c9a84c]" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                <textarea value={supportForm.message} onChange={e => setSupportForm({ ...supportForm, message: e.target.value })} rows={6} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#c9a84c]" required />
              </div>
              {supportMessage && <div className={`rounded-2xl p-4 text-sm ${supportMessage.includes("Thank") ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{supportMessage}</div>}
              <button type="submit" className="w-full rounded-full bg-[#0a1f44] px-5 py-3 font-semibold text-white transition hover:bg-[#09285d]">
                Send Message
              </button>
            </form>
          </div>
        ) : (
          <div className="max-w-3xl">
            <h1 className="font-serif text-5xl font-semibold">{title}</h1>
            <div className="mt-10 space-y-6 text-slate-700">
              <p>This is a demonstration banking portal built to showcase a professional financial application interface.</p>
              <h2 className="font-serif text-2xl font-semibold text-[#0a1f44]">Key Features</h2>
              <ul className="space-y-3 list-disc list-inside">
                <li>Secure client authentication with OTP verification</li>
                <li>Protected account dashboard with real transaction history</li>
                <li>Monthly statement generation and download</li>
                <li>Admin panel with user management and audit controls</li>
                <li>Session timeout and security warnings</li>
              </ul>
              <h2 className="font-serif text-2xl font-semibold text-[#0a1f44]">Demo Limitations</h2>
              <p>This is a demonstration environment. All transactions are simulated, and no real financial operations occur. User payments are intentionally blocked through security controls.</p>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen bg-[#f8f6f1] text-[#0a1f44]">
      <MarketingNav />
      <main className="container flex min-h-[calc(100vh-80px)] flex-col items-center justify-center text-center">
        <h1 className="font-serif text-6xl font-semibold">404</h1>
        <p className="mt-4 text-xl text-slate-600">Page not found</p>
        <Link href="/" className="mt-8 rounded-full bg-[#0a1f44] px-8 py-3 font-semibold text-white transition hover:bg-[#09285d]">
          Return home
        </Link>
      </main>
    </div>
  );
}

export { LandingPage, LoginPage, UserPortal, AdminPanel, LegalPage, NotFound };

export function CBHFinanceApp() {
  const [location] = useLocation();
  const session = useMemo(() => readSession(), []);

  if (location === "/") return <LandingPage />;
  if (location === "/login") return <LoginPage role="user" />;
  if (location === "/portal" || location.startsWith("/portal?")) return <UserPortal />;
  if (location === "/secure-admin" || location.startsWith("/secure-admin?")) return <AdminPanel />;
  if (location === "/terms") return <LegalPage type="terms" />;
  if (location === "/privacy") return <LegalPage type="privacy" />;
  if (location === "/contact") return <LegalPage type="contact" />;
  return <NotFound />;
}
