import fastify from "fastify";
import websocket from "@fastify/websocket";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import z from "zod";
import { eq, and, sql } from "drizzle-orm";

import { db } from "./db";
import { rooms, asks } from "./db/schema";

const app = fastify({
  logger: true,
}).withTypeProvider<ZodTypeProvider>();

app.register(websocket);

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(require("@fastify/cors"), {
  origin: "*",
  methods: "*",
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
    const data = await db.select().from(asks).where(eq(asks.roomId, roomId));

    return reply.send(data);
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

    return reply.send({ id: data[0].id });
  },
);

app.get("/socket", { websocket: true }, (io, req) => {
  io.on("message", (mesage) => {
    io.send("Hello");
  });
});

app.listen({ port: 3000 });
