import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import {
  adminAdjustBalance,
  attemptCredentialLogin,
  blockOutgoingPayment,
  createSupportCase,
  getAccounts,
  getAdminOverview,
  getAuditLogs,
  getCustomer,
  getDashboardSummary,
  getNotifications,
  getPaymentSettings,
  getSecurityPolicy,
  getSeedCoverage,
  getStatements,
  getSupportCases,
  getTransactions,
  recordPasswordChangeNotification,
  recordSessionWarningNotification,
  setCustomerStatus,
  transferBetweenAccounts,
  updateSupportCaseStatus,
  verifyOtp,
} from "./bankingData";
import { transferFunds, getAccountsByUser, getTransactionsByAccount } from "./db";

const roleSchema = z.enum(["user", "admin"]);
const accountTypeSchema = z.enum(["All", "Checking", "Savings", "IRA"]);
const methodSchema = z.enum(["All", "ACH", "Wire", "Internal", "Interest", "Investment", "Admin"]);
const statusSchema = z.enum(["All", "Completed", "Pending", "Failed"]);
const supportCaseStatusSchema = z.enum(["New", "In Review", "Closed"]);

function requireAdminToken(token?: string) {
  if (token !== "cbh-admin-ops-token") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access requires the secure admin session." });
  }
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  banking: router({
    securityPolicy: publicProcedure.query(() => getSecurityPolicy()),
    login: publicProcedure
      .input(z.object({ email: z.string().min(1), password: z.string().min(1), role: roleSchema }))
      .mutation(({ input }) => attemptCredentialLogin(input)),
    verifyOtp: publicProcedure
      .input(z.object({ role: roleSchema, otp: z.string().length(6) }))
      .mutation(({ input }) => verifyOtp(input)),
    dashboard: publicProcedure.query(() => getDashboardSummary()),
    accounts: publicProcedure.query(() => getAccounts()),
    customer: publicProcedure.query(() => getCustomer()),
    notifications: publicProcedure.query(() => getNotifications()),
    paymentSettings: publicProcedure.query(() => getPaymentSettings()),
    requestSettings: publicProcedure.query(() => ({
      globalOutgoingRequestsEnabled: false,
      perUserOutgoingRequestsEnabled: false,
      dailyTransferLimit: 0,
      maintenanceNotice: getPaymentSettings().maintenanceNotice,
    })),
    seedCoverage: publicProcedure.query(() => getSeedCoverage()),
    statements: publicProcedure.query(() => getStatements()),
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
    recordPasswordChange: publicProcedure.mutation(() => recordPasswordChangeNotification()),
    transactions: publicProcedure
      .input(z.object({
        page: z.number().int().min(1).default(1),
        accountType: accountTypeSchema.default("All"),
        method: methodSchema.default("All"),
        status: statusSchema.default("All"),
        search: z.string().optional().default(""),
      }))
      .query(({ input }) => getTransactions(input)),
    blockPayment: publicProcedure
      .input(z.object({
        requestType: z.enum(["Contribution", "Rollover", "Transfer", "Withdrawal Review"]),
        amount: z.number().positive(),
        memo: z.string().optional(),
      }))
      .mutation(() => blockOutgoingPayment()),
    transfer: publicProcedure
      .input(z.object({
        fromAccountId: z.string().min(1),
        toAccountId: z.string().min(1),
        amount: z.number().positive(),
        memo: z.string().optional(),
      }))
      .mutation(({ input, ctx }) => {
        if (!ctx.user?.id) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "User not authenticated" });
        }
        return transferFunds({
          fromAccountId: input.fromAccountId,
          toAccountId: input.toAccountId,
          amount: input.amount,
          initiatedBy: String(ctx.user.id),
        });
      }),
    adminOverview: publicProcedure
      .input(z.object({ token: z.string().optional() }))
      .query(({ input }) => {
        requireAdminToken(input.token);
        return getAdminOverview();
      }),
    auditLogs: publicProcedure
      .input(z.object({ token: z.string().optional() }))
      .query(({ input }) => {
        requireAdminToken(input.token);
        return getAuditLogs();
      }),
    adminAdjustBalance: publicProcedure
      .input(z.object({
        token: z.string().optional(),
        accountId: z.string().min(1),
        action: z.enum(["Credit", "Debit"]),
        amount: z.number().positive(),
        description: z.string().min(1),
      }))
      .mutation(({ input, ctx }) => {
        requireAdminToken(input.token);
        return adminAdjustBalance({
          accountId: input.accountId,
          action: input.action,
          amount: input.amount,
          description: input.description,
          ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || "127.0.0.1",
        });
      }),
    adminSetCustomerStatus: publicProcedure
      .input(z.object({ token: z.string().optional(), status: z.enum(["Active", "Suspended", "Locked"]) }))
      .mutation(({ input, ctx }) => {
        requireAdminToken(input.token);
        return setCustomerStatus({ status: input.status, ipAddress: ctx.req.ip || ctx.req.socket.remoteAddress || "127.0.0.1" });
      }),
  }),
});

export type AppRouter = typeof appRouter;
