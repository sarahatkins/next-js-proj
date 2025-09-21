import { z } from "zod";
import { entries } from "~/server/db/schemas/journalSchema";
import { type InferSelectModel, eq, sql, and, or } from "drizzle-orm";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const CursorSchema = z.object({
  lastDate: z.string(),
  lastShown: z.number(),
});
export type Entry = InferSelectModel<typeof entries>;
export type Cursor = z.infer<typeof CursorSchema>;

export const journalRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ title: z.string(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [newEntry] = await ctx.db
        .insert(entries)
        .values({
          title: input.title,
          content: input.content,
          createdById: ctx.session.user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return newEntry;
    }),

  update: protectedProcedure
    .input(z.object({ id: z.number(), title: z.string(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [newEntry] = await ctx.db
        .update(entries)
        .set({
          title: input.title,
          content: input.content,
          updatedAt: new Date(),
        })
        .where(eq(entries.id, input.id))
        .returning();

      return newEntry;
    }),

  getEntryById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const [res] = await ctx.db
        .select()
        .from(entries)
        .where(eq(entries.id, input.id))
        .limit(1);

      return res;
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

  getEntries: protectedProcedure
    .input(
      z.object({
        userId: z.string().min(1),
        limit: z.number().default(50),
        query: z.string(),
        cursor: CursorSchema.optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const res = await ctx.db
        .select()
        .from(entries)
        .where(
          and(
            eq(entries.createdById, input.userId),
            or(
              sql`LOWER(${entries.content}) ILIKE '%' || LOWER(${input.query}) || '%'`,
              sql`LOWER(${entries.title}) ILIKE '%' || LOWER(${input.query}) || '%'`,
            ),
          ),
        );

      let nextCursor: Cursor | null = null;
      if (res.length > input.limit) {
        nextCursor = {
          lastDate: "",
          lastShown: res[input.limit - 1]!.id,
        };
      }

      return {
        res,
        nextCursor,
      };
    }),
});
