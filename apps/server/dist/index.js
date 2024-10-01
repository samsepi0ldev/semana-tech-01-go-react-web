"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const fastify_1 = __importDefault(require("fastify"));
const websocket_1 = __importDefault(require("@fastify/websocket"));
const fastify_type_provider_zod_1 = require("fastify-type-provider-zod");
const routes_1 = require("./routes/routes");
const app = (0, fastify_1.default)({
    logger: true,
}).withTypeProvider();
app.register(websocket_1.default);
app.register(routes_1.registerRoutes);
app.setValidatorCompiler(fastify_type_provider_zod_1.validatorCompiler);
app.setSerializerCompiler(fastify_type_provider_zod_1.serializerCompiler);
app.register(require("@fastify/cors"), {
    origin: "*",
});
app.listen({ port: 3000 });
