import { relations, sql } from "drizzle-orm";
import { index, pgTableCreator, primaryKey } from "drizzle-orm/pg-core";
import { users } from "./schema";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `practice_${name}`);

export const entries = createTable(
  "entry",
  (d) => ({
    id: d.serial().primaryKey(),
    title: d.varchar({ length: 256 }),
    createdById: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
    content: d.varchar({ length: 256 }).notNull(),
  }),
  (t) => [
    index("entry_created_by_idx").on(t.createdById),
    index("entry_title_idx").on(t.title),
    index("entry_created_at_idx").on(t.createdAt),
  ],
);
