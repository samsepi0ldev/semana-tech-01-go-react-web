"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
const zod_1 = __importDefault(require("zod"));
const drizzle_orm_1 = require("drizzle-orm");
const drizzle_orm_2 = require("drizzle-orm");
const observer_1 = require("../utils/observer");
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const observer = new observer_1.Observer();
async function registerRoutes(fastify) {
    fastify.post("/rooms", {
        schema: {
            body: zod_1.default.object({
                title: zod_1.default.string(),
            }),
        },
    }, async (req, reply) => {
        const { title } = req.body;
        const data = await db_1.db.insert(schema_1.rooms).values({ title }).returning();
        return reply.send(data[0]);
    });
    fastify.get("/room/:roomId/asks", {
        schema: {
            params: zod_1.default.object({
                roomId: zod_1.default.string().cuid2(),
            }),
        },
    }, async (req, reply) => {
        const { roomId } = req.params;
        const data = await db_1.db
            .select()
            .from(schema_1.asks)
            .where((0, drizzle_orm_1.eq)(schema_1.asks.roomId, roomId))
            .orderBy((0, drizzle_orm_2.asc)(schema_1.asks.createdAt));
        return reply.send(data);
    });
    fastify.post("/room/:roomId/asks", {
        schema: {
            params: zod_1.default.object({
                roomId: zod_1.default.string().cuid2(),
            }),
            body: zod_1.default.object({
                description: zod_1.default.string().min(1),
            }),
        },
    }, async (req, reply) => {
        const { roomId } = req.params;
        const { description } = req.body;
        const data = await db_1.db
            .insert(schema_1.asks)
            .values({
            description,
            roomId,
        })
            .returning();
        const room = data[0];
        observer.notifyAll({
            key: roomId,
            message: {
                kind: "message_created",
                value: room,
                roomId,
            }
        });
        return reply.send(room);
    });
    fastify.patch("/room/:roomId/ask/:askId/react", {
        schema: {
            params: zod_1.default.object({
                roomId: zod_1.default.string().cuid2(),
                askId: zod_1.default.string().cuid2(),
            }),
        },
    }, async (req, reply) => {
        const { roomId, askId } = req.params;
        const data = await db_1.db
            .update(schema_1.asks)
            .set({
            reactions: (0, drizzle_orm_1.sql) `${schema_1.asks.reactions} + 1`,
        })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.asks.roomId, roomId), (0, drizzle_orm_1.eq)(schema_1.asks.id, askId)))
            .returning();
        observer.notifyAll({
            key: roomId,
            message: {
                kind: "message_reaction_increased",
                value: data[0],
                roomId,
            }
        });
        return reply.send({ id: data[0].id });
    });
    fastify.patch("/room/:roomId/ask/:askId/un-react", {
        schema: {
            params: zod_1.default.object({
                roomId: zod_1.default.string().cuid2(),
                askId: zod_1.default.string().cuid2(),
            }),
        },
    }, async (req, reply) => {
        const { roomId, askId } = req.params;
        const data = await db_1.db
            .update(schema_1.asks)
            .set({
            reactions: (0, drizzle_orm_1.sql) `${schema_1.asks.reactions} - 1`,
        })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.asks.roomId, roomId), (0, drizzle_orm_1.eq)(schema_1.asks.id, askId)))
            .returning();
        observer.notifyAll({
            key: roomId,
            message: {
                kind: "message_reaction_decreased",
                value: data[0],
                roomId,
            }
        });
        return reply.send({ id: data[0].id });
    });
    fastify.patch("/room/:roomId/ask/:askId/answer", {
        schema: {
            params: zod_1.default.object({
                roomId: zod_1.default.string().cuid2(),
                askId: zod_1.default.string().cuid2(),
            }),
        },
    }, async (req, reply) => {
        const { roomId, askId } = req.params;
        const data = await db_1.db
            .update(schema_1.asks)
            .set({
            answered: true,
        })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.asks.roomId, roomId), (0, drizzle_orm_1.eq)(schema_1.asks.id, askId)))
            .returning();
        observer.notifyAll({
            key: roomId,
            message: {
                kind: "message_answered",
                value: data[0],
                roomId,
            }
        });
        return reply.status(204).send();
    });
    fastify.register(async () => {
        fastify.get("/subscribe/:roomId", {
            schema: {
                params: zod_1.default.object({
                    roomId: zod_1.default.string().cuid2(),
                }),
            },
            websocket: true,
        }, (socket, req) => {
            const { roomId } = req.params;
            observer.subscribe(socket, roomId);
            socket.onmessage = () => { };
            socket.onclose = () => {
                observer.unsubscribe(socket, roomId);
            };
        });
    });
}
