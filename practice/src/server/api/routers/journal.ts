import { z } from "zod";
import { entries } from "~/server/db/schemas/journalSchema";
import { type InferSelectModel, eq } from "drizzle-orm";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
export type Entry = InferSelectModel<typeof entries>;

export const journalRouter = createTRPCRouter({
  entry: publicProcedure
    .input(z.object({ text: z.string(), another: z.number() }))
    .query(({ input }) => {
      return {
        entry: `WOW ${input.text} ${input.another}`,
      };
    }),
  create: publicProcedure
    .input(z.object({ title: z.string().min(1), content: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(entries).values({
        title: input.title,
        content: input.content,
        createdById: "1234",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }),
  getAll: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const res = await ctx.db
        .select()
        .from(entries)
        .where(eq(entries.createdById, input.id));

      return res;
    }),
});
