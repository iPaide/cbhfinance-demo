# CBHfinance Demo Banking Portal

CBHfinance is a full-stack demo banking web application that combines a public marketing site, a seeded user banking portal, and a back-office admin panel at `/secure-admin`. The application is branded with the CBHfinance palette of navy `#0a1f44`, gold `#c9a84c`, off-white `#f8f6f1`, Playfair Display headings, and DM Sans body text.

## Important Demo Scope

This project is intentionally implemented as a controlled demo. It is not connected to a real bank, payment network, card processor, ACH rail, Zelle network, wire service, or investment custodian. All outgoing user payment actions are silently blocked and display exactly:

> Unable to complete transaction. Please contact support.

Admin balance adjustments are recorded inside the demo ledger and append-only audit log. Before any real financial use, this codebase would require formal security, legal, compliance, banking, fraud, AML/KYC, privacy, resilience, and regulatory review.

## Implemented Application Surfaces

| Area | Route | Implemented Capabilities |
|---|---:|---|
| Public marketing site | `/` | CBHfinance branded landing page, service positioning, security controls, Login CTA, footer navigation. |
| User login | `/login` | Separate user credential page, OTP step, lockout simulation, session constants. |
| User portal | `/portal` | Account cards, total net worth, recent transactions, quick actions, alerts, notifications, statements, settings. |
| Admin panel | `/secure-admin` | Separate admin login, dashboard, user/account view, transaction table, admin credit/debit tool, immutable audit log. |
| Terms | `/terms` | CBHfinance demo terms page. |
| Privacy | `/privacy` | CBHfinance demo privacy page. |
| Contact | `/contact` | Branded contact support placeholder form. |

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

## Demo Credentials

| Role | Route | Email | Password | OTP |
|---|---|---|---|---:|
| User | `/login` | `emily.johnson@cbhfinance.online` | `DemoUser!2026` | `246810` |
| Admin | `/secure-admin` | `admin@cbhfinance.online` | `AdminDemo!2026` | `246810` |

## Security and Banking Behaviors

The application exposes authentication-adjacent security behavior for demonstration purposes. The constants are implemented and tested as follows.

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

The project uses the scaffolded React, Express, tRPC, Drizzle, and database stack. Banking data is held in deterministic server-side demo state for immediate execution and testability, while schema tables are defined for customers, accounts, transactions, statements, notifications, and immutable admin logs. The generated database migration has been applied to the managed project database.
