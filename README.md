# CBHfinance Banking Portal

CBHfinance is a full-stack retirement savings and wealth account portal that combines a public retirement-focused website, a protected client portal, and a back-office operations panel at `/secure-admin`. The application is branded with the CBHfinance palette of navy `#0a1f44`, gold `#c9a84c`, off-white `#f8f6f1`, Playfair Display headings, and DM Sans body text.

## Important Scope

This project is implemented as a controlled portfolio environment and is not connected to live custodial, brokerage, custodial transfer, ACH, wire, tax-reporting, or investment execution systems. External contribution, rollover, withdrawal, and restricted transfer actions are routed through review controls and display:

> Unable to complete transaction. Please contact support.

Admin balance adjustments are recorded inside the controlled activity ledger and append-only audit log. Before any real financial use, this codebase would require formal security, legal, compliance, banking, fraud, AML/KYC, privacy, resilience, and regulatory review.

## Implemented Application Surfaces

| Area | Route | Implemented Capabilities |
|---|---:|---|
| Public marketing site | `/` | CBHfinance branded landing page, service positioning, security controls, Login CTA, footer navigation. |
| User login | `/login` | Separate user credential page, OTP step, lockout simulation, session constants. |
| User portal | `/portal` | Account cards, total net worth, recent transactions, quick actions, alerts, notifications, statements, settings. |
| Admin panel | `/secure-admin` | Separate admin login, dashboard, user/account view, transaction table, admin credit/debit tool, immutable audit log. |
| Terms | `/terms` | CBHfinance terms page. |
| Privacy | `/privacy` | CBHfinance privacy page. |
| Contact | `/contact` | Branded contact support support form. |

## Seeded Customer

| Field | Value |
|---|---:|
| Customer | Emily Ann Johnson |
| Checking balance | `$62,288.72` |
| Savings balance | `$116,039.59` |
| IRA balance | `$436,892.55` |
| Total net worth | `$615,220.86` |
| Transaction history | Starts January 2025 and runs through the current date. |
| Statement history | Begins January 2025. |

## Credentials

| Role | Route | Email | Password | OTP |
|---|---|---|---|---:|
| User | `/login` | `emilyajohnson196@gmail.com` | `9233W@de1313` | `246810` |
| Admin | `/secure-admin` | `admin@cbhfinance.online` | `CBHAdmin!2026` | `246810` |

## Security and Banking Behaviors

The application includes controlled authentication, OTP, timeout, lockout, and audit behavior for a portfolio-grade retirement portal experience. The constants are implemented and tested as follows.

| Requirement | Implemented Value |
|---|---:|
| Session warning | Exactly 13 minutes of inactivity. |
| Session hard timeout | Exactly 15 minutes of inactivity. |
| Account lockout | Exactly 5 failed login attempts. |
| Transaction pagination | Exactly 25 records per page. |
| Admin route | Exactly `/secure-admin`. |
| Audit log | Append-only interface; no edit or delete procedure is exposed. |

## Development Commands

```bash
pnpm test
pnpm check
pnpm build
pnpm dev
```

## Validation Status

The implementation was validated with unit tests, TypeScript checking, and a production build.

```text
Test Files: 2 passed
Tests: 8 passed
TypeScript: passed
Production build: passed
```

## Architecture Notes

The project uses the scaffolded React, Express, tRPC, Drizzle, and database stack. Banking data is held in deterministic server-side state for immediate execution and testability, while schema tables are defined for customers, accounts, transactions, statements, notifications, and immutable admin logs. The generated database migration has been applied to the managed project database.
