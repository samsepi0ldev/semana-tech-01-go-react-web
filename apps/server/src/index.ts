import fastify from "fastify";
import websocket from "@fastify/websocket";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { registerRoutes } from "./routes/routes";

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

app.listen({ port: 3000 });
