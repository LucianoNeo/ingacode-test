import { PrismaClient } from '@prisma/client';
import { FastifyInstance } from 'fastify'
import * as bcrypt from 'bcrypt';
import { getAllCollaborators, getCollaboratorById } from "./controllers/collaboratorsController";
import { createProject, deleteProject, getAllProjects, getProjectById, modifyProject } from "./controllers/projectController";
import { createTask, deleteTask, getAllTasks, getTaskById, modifyTask } from "./controllers/taskController";
import { getDayTotalMinutes, getMonthTotalMinutes, getTaskTotalMinutes } from "./controllers/timeController";
import { createTimeTracker, deleteTT, getAllTimeTrackers, getTimeTrackerById, modifyTimeTracker } from "./controllers/timetrackController";

const prisma = new PrismaClient({
    // log: ['query']
})


export async function appRoutes(app: FastifyInstance) {

    app.post('/login', async (request: any, reply: any) => {
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
            const token = app.jwt.sign({ id: user.id, username: user.username }, { expiresIn: '1d' });

            reply.send({ token, username });
        } else {
            reply.status(400).send({ error: 'Usuário ou Senha inválida' });
        }
    }
    )

    app.decorate('authenticate', async (request: any, reply: any) => {
        try {
            await request.jwtVerify()
        } catch (error: any) {
            reply.status(401).send({ error: error.message });
        }
    })

    app.get('/validatetoken',
        {
            /* @ts-ignore */
            onRequest: [app.authenticate]
        }, async (request: any, reply: any) => {
            try {
                reply.status(200).send(request.user)
            } catch (error: any) {
                reply.status(401).send(error.message);
            }
        })


    /* @ts-ignore */
    app.get('/projects', { onRequest: [app.authenticate] }, getAllProjects
    );
    /* @ts-ignore */
    app.get('/projects/:id', { onRequest: [app.authenticate] }, getProjectById);
    // @ts-ignore
    app.post('/projects', { onRequest: [app.authenticate] }, createProject)
    // @ts-ignore
    app.delete('/projects/:id', { onRequest: [app.authenticate] }, deleteProject)
    // @ts-ignore
    app.put('/projects/:id', { onRequest: [app.authenticate] }, modifyProject)
    /* @ts-ignore */

    app.get('/tasks', { onRequest: [app.authenticate] }, getAllTasks)
    // @ts-ignore
    app.get('/tasks/:id', { onRequest: [app.authenticate] }, getTaskById);
    // @ts-ignore
    app.post('/tasks', { onRequest: [app.authenticate] }, createTask);
    // @ts-ignore
    app.delete('/tasks/:id', { onRequest: [app.authenticate] }, deleteTask)
    // @ts-ignore
    app.put('/tasks/:id', { onRequest: [app.authenticate] }, modifyTask)


    // @ts-ignore
    app.get('/timetrackers', { onRequest: [app.authenticate] }, getAllTimeTrackers)
    // @ts-ignore
    app.get('/timetrackers/:id', { onRequest: [app.authenticate] }, getTimeTrackerById);
    // @ts-ignore
    app.post('/timetrackers', { onRequest: [app.authenticate] }, createTimeTracker)
    // @ts-ignore
    app.put('/timetrackers/:id', { onRequest: [app.authenticate] }, modifyTimeTracker)
    // @ts-ignore
    app.delete('/timetrackers/:id', { onRequest: [app.authenticate] }, deleteTT)


    // @ts-ignore
    app.post('/daytotalminutes', { onRequest: [app.authenticate] }, getDayTotalMinutes)
    // @ts-ignore
    app.get('/monthtotalminutes', { onRequest: [app.authenticate] }, getMonthTotalMinutes)
    // @ts-ignore
    app.get('/tasktotalminutes/:id', { onRequest: [app.authenticate] }, getTaskTotalMinutes)
    // @ts-ignore
    app.get('/collaborators', { onRequest: [app.authenticate] }, getAllCollaborators)
    // @ts-ignore
    app.get('/collaborators:id', { onRequest: [app.authenticate] }, getCollaboratorById)



}







