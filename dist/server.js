"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("@fastify/cors"));
const fastify_1 = __importDefault(require("fastify"));
const userController_1 = require("./controllers/userController");
const routes_1 = require("./routes");
const app = (0, fastify_1.default)();
const jwt = require('@fastify/jwt');
app.register(jwt, { secret: process.env.JWT_SECRET });
app.register(routes_1.appRoutes);
app.register(cors_1.default, {
    origin: true
});
app.listen({
    port: 3333,
    host: '0.0.0.0',
}).then(() => {
    console.log('HTTP Server Running on port 3333');
});
(0, userController_1.checkUsers)();
setTimeout(() => {
    (0, userController_1.checkCollaborators)();
}, 5000);
