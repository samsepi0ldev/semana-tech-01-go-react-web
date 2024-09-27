import fastify from "fastify";
import websocket, { WebSocket } from "@fastify/websocket";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import z from "zod";
import { eq, and, sql } from "drizzle-orm";
import { asc } from "drizzle-orm";

import { db } from "./db";
import { rooms, asks } from "./db/schema";

const event = {
  MessageKindMessageCreated: "message_created",
  MessageKindMessageRactionIncreased: "message_reaction_increased",
  MessageKindMessageRactionDecreased: "message_reaction_decreased",
  MessageKindMessageAnswered: "message_answered",
};

const subscribers = {} as { [key: string]: Set<WebSocket> };

const app = fastify({
  logger: true,
}).withTypeProvider<ZodTypeProvider>();

app.register(websocket);

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(require("@fastify/cors"), {
  origin: "*",
});

app.post(
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

app.get(
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

app.post(
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

    notifyClients(roomId, {
      kind: "message_created",
      value: room,
      roomId,
    });

    return reply.send(room);
  },
);

app.patch(
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

    notifyClients(roomId, {
      kind: "message_reaction_increased",
      value: data[0],
      roomId,
    });

    return reply.send({ id: data[0].id });
  },
);

app.patch(
  "/room/:roomId/ask/:askId/unreact",
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

    notifyClients(roomId, {
      kind: "message_reaction_decreased",
      value: data[0],
      roomId,
    });

    return reply.send({ id: data[0].id });
  },
);

app.patch(
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

    notifyClients(roomId, {
      kind: "message_answered",
      value: data[0],
      roomId,
    });
  },
);

const notifyClients = (roomID: string, message: { [key: string]: any }) => {
  if (subscribers[roomID]) {
    for (const client of subscribers[roomID]) {
      client.send(JSON.stringify(message));
    }
  }
};

app.register(async function () {
  app.get(
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

      if (!subscribers[roomId]) {
        subscribers[roomId] = new Set();
      }

      subscribers[roomId].add(socket);

      socket.onmessage = () => {};

      socket.onclose = () => {
        subscribers[roomId].delete(socket);

        if (subscribers[roomId].size === 0) {
          delete subscribers[roomId];
        }
      };
    },
  );
});

app.listen({ port: 3000 });
