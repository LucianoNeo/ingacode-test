import cors from "@fastify/cors";
import { PrismaClient } from '@prisma/client';
import Fastify from "fastify";
import { createProject, deleteProject, getAllProjects, getProjectById, modifyProject } from "./controllers/projectController";
import { assignTask, createTask, deleteTask, getAllTasks, getTaskById, modifyTask } from "./controllers/taskController";
import { getDayTotalMinutes, getMonthTotalMinutes } from "./controllers/timeController";
import { createTimeTracker, getAllTimeTrackers, getTimeTrackerById, modifyTimeTracker } from "./controllers/timetrackController";


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
  fastify.get('/projects', getAllProjects)
  fastify.get('/projects/:id', getProjectById);
  fastify.post('/projects', createProject)
  fastify.delete('/projects/:id', deleteProject)
  fastify.put('/projects/:id', modifyProject)

  // Task routes
  fastify.get('/tasks', getAllTasks)
  fastify.get('/tasks/:id', getTaskById);
  fastify.post('/tasks', createTask);
  fastify.delete('/tasks/:id', deleteTask)
  fastify.put('/tasks/:id', modifyTask)


  // TimeTrack routes
  fastify.get('/timetrackers', getAllTimeTrackers)
  fastify.get('/timetrackers/:id', getTimeTrackerById);
  fastify.post('/timetrackers', createTimeTracker)
  fastify.put('/timetrackers/:id', modifyTimeTracker)

  //Time routes
  fastify.get('/daytotalminutes', getDayTotalMinutes)
  fastify.get('/monthtotalminutes', getMonthTotalMinutes)


  await fastify.listen({ port: 3333, host: '0.0.0.0' })

}


bootstrap()