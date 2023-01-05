import cors from "@fastify/cors";
import { PrismaClient } from '@prisma/client';
import Fastify from "fastify";
import { createProject, deleteProject, readAllProjects } from "./controllers/projectController";
import { createTask, getAllTasks, getTaskById } from "./controllers/taskController";
import { createTimeTracker, getAllTimeTrackers } from "./controllers/timetrackController";


const prisma = new PrismaClient({
  // log: ['query']
})

const fastify = Fastify({
  logger: true,
})


async function bootstrap() {

  await fastify.register(cors, {
    origin: true
  })

  // Project routes
  fastify.get('/projects', readAllProjects)
  fastify.post('/projects', createProject)
  fastify.delete('/projects/:id', deleteProject)

  // Task routes
  fastify.get('/tasks', getAllTasks)
  fastify.get('/tasks/:id', getTaskById);
  fastify.post('/tasks', createTask);


  // TimeTrack routes
  fastify.get('/timetrackers', getAllTimeTrackers)
  fastify.post('/timetrackers', createTimeTracker)



  await fastify.listen({ port: 3333, host: '0.0.0.0' })

}


bootstrap()