import dotenv from 'dotenv'

dotenv.config()

import fastify from "fastify";
import websocket from "@fastify/websocket";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { registerRoutes } from "./routes/routes";
import { env } from './env';

const app = fastify({
  logger: true,
}).withTypeProvider<ZodTypeProvider>();

app.register(websocket);
app.register(registerRoutes)

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(require("@fastify/cors"), {
  origin: "*",
});

const PORT = env.PORT || 4000

app.listen({ port: PORT });
