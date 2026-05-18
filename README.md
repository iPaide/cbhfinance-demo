# CBHfinance — Retirement Savings & Wealth Portal

CBHfinance is a full-stack retirement savings and wealth account portal designed to feel like a polished digital retirement platform. It combines a public retirement-focused website, protected client login, OTP verification, retirement account dashboard, activity tracking, contribution and rollover workflows, document center, beneficiary/security profile tools, support case intake, admin operations console, and audit controls.

## Live Experience

- Public website: retirement-focused landing page
- Client portal: `/portal`
- Admin operations console: `/secure-admin`
- Support/contact page: `/contact`

## Core Features

### Public Retirement Website

The landing page presents CBHfinance as a retirement savings and wealth account platform, with sections for retirement outlook, secure access, retirement services, document access, rollover support, and client support.

### Secure Client Access

The login flow includes:

- Email/password verification
- One-time passcode verification
- Forgot email flow
- Forgot password flow
- Enroll / request access flow
- Secure session handling
- Timeout warning and automatic logout behavior

### Retirement Dashboard

The client dashboard includes:

- Total retirement savings overview
- Vested balance
- YTD contributions
- Investment profile
- Retirement account cards
- Allocation snapshot
- Quick actions
- Recent retirement activity
- Guidance and alerts

### Retirement Activity

The activity area includes:

- Contribution records
- Employer match records
- Dividend reinvestments
- Cash reserve interest
- Rollover review activity
- Internal transfers
- Plan administration fees
- Search, filters, pagination, and CSV export
- Mobile-friendly activity cards

### Contributions & Transfers

The portal supports realistic retirement request workflows:

- One-time contribution request
- Recurring contribution request
- Internal account transfer
- Rollover request
- Withdrawal review
- Contribution limits guidance

Certain requests are routed through review messaging to reflect realistic retirement-service controls.

### Statements & Documents

The document center includes:

- Monthly retirement account statements
- Tax forms
- Contribution confirmations
- Rollover documents
- Plan notices
- Secure disclosures
- Downloadable statement records

### Profile, Beneficiaries & Security

The profile area includes:

- Personal information
- Contact information
- Beneficiary status
- Trusted contact controls
- Delivery preferences
- Security center
- Last login information
- Profile review actions

### Admin Operations Console

The admin console is designed as a retirement operations workspace, including:

- Client profile review
- Account review adjustments
- Retirement activity management
- Support case review
- Request controls
- Immutable audit log
- CSV export
- Client status controls

## Design Direction

CBHfinance uses a premium retirement/wealth visual system:

- Navy and gold brand palette
- Serif headings for a private-client feel
- Clean card-based layouts
- Mobile side-menu navigation
- Mobile-friendly activity cards
- Retirement-oriented copy and workflows

## Technology Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- tRPC
- Node.js
- Render deployment
- GitHub version control

## Security and Review Notes

This project is implemented as a controlled portfolio environment. It is not connected to live custodial, brokerage, tax-reporting, investment execution, ACH, wire, or payment systems.

Before any real financial use, this codebase would require formal review for:

- Security
- Legal compliance
- Custody and brokerage requirements
- Privacy
- Fraud prevention
- AML/KYC
- Resilience
- Regulatory obligations
- Data retention
- Real notification delivery
- Real identity verification

## Project Goal

The goal of CBHfinance is to demonstrate a professional, realistic, end-to-end retirement savings portal experience that includes both client-facing and operations-facing workflows.

It is designed to show:

- Product thinking
- Secure account experience design
- Retirement-platform UX
- Full-stack implementation
- Admin/operations tooling
- Mobile responsiveness
- Realistic financial workflow modeling

## Status

CBHfinance is live, mobile-responsive, and actively polished for presentation.
