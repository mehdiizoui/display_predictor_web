import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { predictDisplay } from "./ml";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  prediction: router({
    predict: publicProcedure
      .input(
        z.object({
          cor_sales_in_vol: z.number().min(0),
          cor_sales_in_val: z.number().min(0),
          CA_mag: z.number().min(0),
          value: z.number().min(0),
          VenteConv: z.number().min(0),
          ENSEIGNE: z.string().min(1),
          Feature: z.string().min(1),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const result = await predictDisplay(input);
          return {
            success: true,
            prediction: result.prediction,
            confidence: result.confidence,
          };
        } catch (error) {
          console.error("[API] Prediction error:", error);
          return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
