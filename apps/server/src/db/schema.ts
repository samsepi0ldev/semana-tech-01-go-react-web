import { text, pgTable, boolean, integer } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const rooms = pgTable("rooms", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  title: text("title").notNull(),
});

export const asks = pgTable("asks", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  roomId: text("room_id")
    .references(() => rooms.id)
    .notNull(),
  description: text("description").notNull(),
  answered: boolean("answered").default(false),
  reactions: integer("reactions").default(0).notNull(),
});
