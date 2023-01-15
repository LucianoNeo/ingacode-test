import cors from "@fastify/cors";
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import Fastify from "fastify";
import { getAllCollaborators, getCollaboratorById } from "./controllers/collaboratorsController";
import { createProject, deleteProject, getAllProjects, getProjectById, modifyProject } from "./controllers/projectController";
import { createTask, deleteTask, getAllTasks, getTaskById, modifyTask } from "./controllers/taskController";
import { getDayTotalMinutes, getMonthTotalMinutes, getTaskTotalMinutes } from "./controllers/timeController";
import { createTimeTracker, deleteTT, getAllTimeTrackers, getTimeTrackerById, modifyTimeTracker } from "./controllers/timetrackController";
import { checkCollaborators, checkUsers } from "./controllers/userController";
const moment = require('moment-timezone');
moment.tz.setDefault("America/Sao_Paulo");


const prisma = new PrismaClient({
  // log: ['query']
})

const fastify = Fastify({
  logger: true,
})

const jwt = require('@fastify/jwt');

fastify.register(jwt, { secret: process.env.JWT_SECRET });


async function bootstrap() {

  await fastify.register(cors, {
    origin: true
  })

  // Authentication routes

  fastify.post('/login', async (request: any, reply: any) => {
    const { username, password } = request.body;
    const user = await prisma.users.findFirst({
      where: {
        username
      }
    });
    if (!user) {
      reply.status(400).send({ error: 'Usuário ou Senha inválida' });
      return
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (isValidPassword) {
      /* @ts-ignore */
      const token = fastify.jwt.sign({ id: user.id, username: user.username }, { expiresIn: '1d' });

      reply.send({ token, username });
    } else {
      reply.status(400).send({ error: 'Usuário ou Senha inválida' });
    }
  }
  )

  fastify.decorate('authenticate', async (request: any, reply: any) => {
    try {
      await request.jwtVerify()
    } catch (error: any) {
      reply.status(401).send({ error: error.message });
    }
  })

  fastify.get('/validatetoken',
    {
      /* @ts-ignore */
      onRequest: [fastify.authenticate]
    }, async (request: any, reply: any) => {
      try {
        reply.status(200).send(request.user)
      } catch (error: any) {
        reply.status(401).send(error.message);
      }
    })


  /* @ts-ignore */
  fastify.get('/projects', { onRequest: [fastify.authenticate] }, getAllProjects
  );
  /* @ts-ignore */
  fastify.get('/projects/:id', { onRequest: [fastify.authenticate] }, getProjectById);
  // @ts-ignore
  fastify.post('/projects', { onRequest: [fastify.authenticate] }, createProject)
  // @ts-ignore
  fastify.delete('/projects/:id', { onRequest: [fastify.authenticate] }, deleteProject)
  // @ts-ignore
  fastify.put('/projects/:id', { onRequest: [fastify.authenticate] }, modifyProject)
  /* @ts-ignore */

  fastify.get('/tasks', { onRequest: [fastify.authenticate] }, getAllTasks)
  // @ts-ignore
  fastify.get('/tasks/:id', { onRequest: [fastify.authenticate] }, getTaskById);
  // @ts-ignore
  fastify.post('/tasks', { onRequest: [fastify.authenticate] }, createTask);
  // @ts-ignore
  fastify.delete('/tasks/:id', { onRequest: [fastify.authenticate] }, deleteTask)
  // @ts-ignore
  fastify.put('/tasks/:id', { onRequest: [fastify.authenticate] }, modifyTask)


  // @ts-ignore
  fastify.get('/timetrackers', { onRequest: [fastify.authenticate] }, getAllTimeTrackers)
  // @ts-ignore
  fastify.get('/timetrackers/:id', { onRequest: [fastify.authenticate] }, getTimeTrackerById);
  // @ts-ignore
  fastify.post('/timetrackers', { onRequest: [fastify.authenticate] }, createTimeTracker)
  // @ts-ignore
  fastify.put('/timetrackers/:id', { onRequest: [fastify.authenticate] }, modifyTimeTracker)
  // @ts-ignore
  fastify.delete('/timetrackers/:id', { onRequest: [fastify.authenticate] }, deleteTT)


  // @ts-ignore
  fastify.post('/daytotalminutes', { onRequest: [fastify.authenticate] }, getDayTotalMinutes)
  // @ts-ignore
  fastify.get('/monthtotalminutes', { onRequest: [fastify.authenticate] }, getMonthTotalMinutes)
  // @ts-ignore
  fastify.get('/tasktotalminutes/:id', { onRequest: [fastify.authenticate] }, getTaskTotalMinutes)
  // @ts-ignore
  fastify.get('/collaborators', { onRequest: [fastify.authenticate] }, getAllCollaborators)
  // @ts-ignore
  fastify.get('/collaborators:id', { onRequest: [fastify.authenticate] }, getCollaboratorById)




  await fastify.listen({ port: 3333, host: '0.0.0.0' })

}


bootstrap()
checkUsers()
setTimeout(() => {
  checkCollaborators()
}, 5000);