"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asks = exports.rooms = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const cuid2_1 = require("@paralleldrive/cuid2");
exports.rooms = (0, pg_core_1.pgTable)("rooms", {
    id: (0, pg_core_1.text)("id")
        .primaryKey()
        .$defaultFn(() => (0, cuid2_1.createId)()),
    title: (0, pg_core_1.text)("title").notNull(),
});
exports.asks = (0, pg_core_1.pgTable)("asks", {
    id: (0, pg_core_1.text)("id")
        .primaryKey()
        .$defaultFn(() => (0, cuid2_1.createId)()),
    roomId: (0, pg_core_1.text)("room_id")
        .references(() => exports.rooms.id)
        .notNull(),
    description: (0, pg_core_1.text)("description").notNull(),
    answered: (0, pg_core_1.boolean)("answered").default(false),
    reactions: (0, pg_core_1.integer)("reactions").default(0).notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
});
