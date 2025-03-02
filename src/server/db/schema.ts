// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTableCreator,
  serial,
  text,
  timestamp,
  varchar,
  json,
  date,
  real,
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

    // details
    mainAccords: json("main_accords"),
    occasions: json("occasions"),
    aromaticFamily: varchar("aromatic_family", { length: 256 }),
    notes: json("notes"),
    genderDist: json("gender_dist"),
    similarTo: json("similar_to"),

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
  "exchanged",
]);
export const acquiredDetailsEnum = pgEnum("acquired_details", [
  "bought",
  "gifted",
  "exchanged",
  "giveaway",
  "split",
  "purchaseGift",
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
    goneDate: date("gone_date"),
    aquiredDate: date("aquired_date"),
    aquiredDetails: acquiredDetailsEnum("acquired_details")
      .default("bought")
      .notNull(),
    acquiredFrom: varchar("acquired_from", { length: 256 }),
    wentTo: varchar("went_to", { length: 256 }),
    sizeInMl: real("size_in_ml"),
    price: real("price"),
    batchCode: varchar("batch_code", { length: 256 }),
    sellPrice: real("sell_price"),
  },
  (table) => ({
    userIdIndex: index("user_id_idx").on(table.userId),
    uniqueUserFragranceIndex: sql`UNIQUE(${table.userId}, ${table.fragranceId}, ${table.isDecant})`,
  }),
);

export const useCaseEnum = pgEnum("use_case", [
  "casual",
  "formal",
  "date",
  "clubbing",
  "sport",
  "hangout",
  "personal",
  "testing",
  "guess_game"
]);

export const timeOfDayEnum = pgEnum("time_of_day", ["day", "night"]);

export const weatherEnum = pgEnum("weather", ["hot", "cold", "mild"]);

export const userFragranceLogs = createTable(
  "user_fragrance_log",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 256 }).notNull(),
    fragranceId: serial("fragrance_id").notNull(),
    logDate: date("log_date")
      .notNull()
      .default(sql`CURRENT_DATE`),
    notes: text("notes"),
    enjoyment: integer("enjoyment"),
    sprays: integer("sprays"),
    duration: integer("duration"),
    testedInBlotter: boolean("tested_in_blotter").default(false).notNull(),
    timeOfDay: timeOfDayEnum("time_of_day"),
    weather: weatherEnum("weather"),
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useCase: useCaseEnum("use_case"),
  },
  (table) => ({
    enjoymentRange: sql`CHECK (${table.enjoyment} BETWEEN 1 AND 10))`,
    userIdIndex: index("fragrance_log_user_id_idx").on(table.userId),
  }),
);
