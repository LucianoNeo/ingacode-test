import cors from "@fastify/cors";
import Fastify from "fastify";
import { checkCollaborators, checkUsers } from "./controllers/userController";
import { appRoutes } from "./routes";

const app = Fastify()

const jwt = require('@fastify/jwt');

app.register(jwt, { secret: process.env.JWT_SECRET });
app.register(appRoutes)

app.register(cors, {
  origin: true
})



app.listen({
  port: 3333,
  host: '0.0.0.0',
}).then(() => {
  console.log('HTTP Server Running on port 3333')
})


checkUsers()
setTimeout(() => {
  checkCollaborators()
}, 5000);