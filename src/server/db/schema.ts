// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  pgEnum,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `fragrance-logs_${name}`);

export const fragrances = createTable(
  "fragrance",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    house: varchar("house", { length: 256 }).notNull(),
    imageUrl: varchar("image_url", { length: 256 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (table) => ({
    uniqueNameHouseIndex: sql`UNIQUE(${table.name}, ${table.house})`,
  }),
);

export const statusEnum = pgEnum("status", ["have", "had"]);
export const hadDetailsEnum = pgEnum("had_details", [
  "emptied",
  "sold",
  "gifted",
  "lost",
]);

export const userFragrances = createTable(
  "user_fragrance",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 256 }).notNull(),
    fragranceId: serial("fragrance_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
    isDecant: boolean("is_decant").default(false).notNull(),
    status: statusEnum("status").default("have").notNull(),
    hadDetails: hadDetailsEnum("had_details"),
  },
  (table) => ({
    userIdIndex: index("user_id_idx").on(table.userId),
    uniqueUserFragranceIndex: sql`UNIQUE(${table.userId}, ${table.fragranceId}, ${table.isDecant})`,
  }),
);
