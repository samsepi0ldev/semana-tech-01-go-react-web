import type {
  FastifyInstance,
  FastifyBaseLogger,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
} from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import z from "zod";
import { eq, and, sql } from "drizzle-orm";
import { asc } from "drizzle-orm";

import { Observer } from "../utils/observer";

import { db } from "../db";
import { rooms, asks } from "../db/schema";

const observer = new Observer()

type FastifyZod = FastifyInstance<
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  RawReplyDefaultExpression<RawServerDefault>,
  FastifyBaseLogger,
  ZodTypeProvider
>

export async function registerRoutes (fastify: FastifyZod) {
  fastify.post(
    "/rooms",
    {
      schema: {
        body: z.object({
          title: z.string(),
        }),
      },
    },
    async (req, reply) => {
      const { title } = req.body;
      const data = await db.insert(rooms).values({ title }).returning();
  
      return reply.send(data[0]);
    },
  );
  
  fastify.get(
    "/room/:roomId/asks",
    {
      schema: {
        params: z.object({
          roomId: z.string().cuid2(),
        }),
      },
    },
    async (req, reply) => {
      const { roomId } = req.params;
      const data = await db
        .select()
        .from(asks)
        .where(eq(asks.roomId, roomId))
        .orderBy(asc(asks.createdAt));
  
      return reply.send(data);
    },
  );
  
  fastify.post(
    "/room/:roomId/asks",
    {
      schema: {
        params: z.object({
          roomId: z.string().cuid2(),
        }),
        body: z.object({
          description: z.string().min(1),
        }),
      },
    },
    async (req, reply) => {
      const { roomId } = req.params;
      const { description } = req.body;
  
      const data = await db
        .insert(asks)
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
    },
  );
  
  fastify.patch(
    "/room/:roomId/ask/:askId/react",
    {
      schema: {
        params: z.object({
          roomId: z.string().cuid2(),
          askId: z.string().cuid2(),
        }),
      },
    },
    async (req, reply) => {
      const { roomId, askId } = req.params;
      const data = await db
        .update(asks)
        .set({
          reactions: sql`${asks.reactions} + 1`,
        })
        .where(and(eq(asks.roomId, roomId), eq(asks.id, askId)))
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
    },
  );
  
  fastify.patch(
    "/room/:roomId/ask/:askId/un-react",
    {
      schema: {
        params: z.object({
          roomId: z.string().cuid2(),
          askId: z.string().cuid2(),
        }),
      },
    },
    async (req, reply) => {
      const { roomId, askId } = req.params;
      const data = await db
        .update(asks)
        .set({
          reactions: sql`${asks.reactions} - 1`,
        })
        .where(and(eq(asks.roomId, roomId), eq(asks.id, askId)))
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
    },
  );
  
  fastify.patch(
    "/room/:roomId/ask/:askId/answer",
    {
      schema: {
        params: z.object({
          roomId: z.string().cuid2(),
          askId: z.string().cuid2(),
        }),
      },
    },
    async (req, reply) => {
      const { roomId, askId } = req.params;
      const data = await db
        .update(asks)
        .set({
          answered: true,
        })
        .where(and(eq(asks.roomId, roomId), eq(asks.id, askId)))
        .returning();
  
      observer.notifyAll({
        key: roomId,
        message: {
          kind: "message_answered",
          value: data[0],
          roomId,
        }
      });
  
      return reply.status(204).send()
    },
  );
  
  fastify.register(async () => {
    fastify.get(
      "/subscribe/:roomId",
      {
        schema: {
          params: z.object({
            roomId: z.string().cuid2(),
          }),
        },
        websocket: true,
      },
      (socket, req) => {
        const { roomId } = req.params;
  
        observer.subscribe(socket, roomId)
  
        socket.onmessage = () => {};
  
        socket.onclose = () => {
          observer.unsubscribe(socket, roomId)
        };
      },
    );
  });
}
