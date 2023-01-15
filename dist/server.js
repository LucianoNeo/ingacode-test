"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("@fastify/cors"));
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const fastify_1 = __importDefault(require("fastify"));
const collaboratorsController_1 = require("./controllers/collaboratorsController");
const projectController_1 = require("./controllers/projectController");
const taskController_1 = require("./controllers/taskController");
const timeController_1 = require("./controllers/timeController");
const timetrackController_1 = require("./controllers/timetrackController");
const userController_1 = require("./controllers/userController");
const moment = require('moment-timezone');
moment.tz.setDefault("America/Sao_Paulo");
const prisma = new client_1.PrismaClient({
// log: ['query']
});
const fastify = (0, fastify_1.default)({
    logger: true,
});
const jwt = require('fastify-jwt');
fastify.register(jwt, { secret: process.env.JWT_SECRET });
async function bootstrap() {
    await fastify.register(cors_1.default, {
        origin: true
    });
    // Authentication routes
    fastify.post('/login', async (request, reply) => {
        const { username, password } = request.body;
        const user = await prisma.users.findFirst({
            where: {
                username
            }
        });
        if (!user) {
            reply.status(401).send({ error: 'Usuário ou Senha inválida' });
            return;
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (isValidPassword) {
            /* @ts-ignore */
            const token = fastify.jwt.sign({ id: user.id, username: user.username }, { expiresIn: '1d' });
            reply.send({ token, username });
        }
        else {
            reply.status(401).send({ error: 'Usuário ou Senha inválida' });
        }
    });
    fastify.decorate('authenticate', async (request, reply) => {
        try {
            await request.jwtVerify();
        }
        catch (error) {
            reply.send(error);
        }
    });
    fastify.get('/validatetoken', {
        /* @ts-ignore */
        onRequest: [fastify.authenticate]
    }, async (request, reply) => {
        return request.user;
    });
    /* @ts-ignore */
    fastify.get('/projects', { onRequest: [fastify.authenticate] }, projectController_1.getAllProjects);
    /* @ts-ignore */
    fastify.get('/projects/:id', { onRequest: [fastify.authenticate] }, projectController_1.getProjectById);
    // @ts-ignore
    fastify.post('/projects', { onRequest: [fastify.authenticate] }, projectController_1.createProject);
    // @ts-ignore
    fastify.delete('/projects/:id', { onRequest: [fastify.authenticate] }, projectController_1.deleteProject);
    // @ts-ignore
    fastify.put('/projects/:id', { onRequest: [fastify.authenticate] }, projectController_1.modifyProject);
    /* @ts-ignore */
    fastify.get('/tasks', { onRequest: [fastify.authenticate] }, taskController_1.getAllTasks);
    // @ts-ignore
    fastify.get('/tasks/:id', { onRequest: [fastify.authenticate] }, taskController_1.getTaskById);
    // @ts-ignore
    fastify.post('/tasks', { onRequest: [fastify.authenticate] }, taskController_1.createTask);
    // @ts-ignore
    fastify.delete('/tasks/:id', { onRequest: [fastify.authenticate] }, taskController_1.deleteTask);
    // @ts-ignore
    fastify.put('/tasks/:id', { onRequest: [fastify.authenticate] }, taskController_1.modifyTask);
    // @ts-ignore
    fastify.get('/timetrackers', { onRequest: [fastify.authenticate] }, timetrackController_1.getAllTimeTrackers);
    // @ts-ignore
    fastify.get('/timetrackers/:id', { onRequest: [fastify.authenticate] }, timetrackController_1.getTimeTrackerById);
    // @ts-ignore
    fastify.post('/timetrackers', { onRequest: [fastify.authenticate] }, timetrackController_1.createTimeTracker);
    // @ts-ignore
    fastify.put('/timetrackers/:id', { onRequest: [fastify.authenticate] }, timetrackController_1.modifyTimeTracker);
    // @ts-ignore
    fastify.delete('/timetrackers/:id', { onRequest: [fastify.authenticate] }, timetrackController_1.deleteTT);
    // @ts-ignore
    fastify.post('/daytotalminutes', { onRequest: [fastify.authenticate] }, timeController_1.getDayTotalMinutes);
    // @ts-ignore
    fastify.get('/monthtotalminutes', { onRequest: [fastify.authenticate] }, timeController_1.getMonthTotalMinutes);
    // @ts-ignore
    fastify.get('/tasktotalminutes/:id', { onRequest: [fastify.authenticate] }, timeController_1.getTaskTotalMinutes);
    // @ts-ignore
    fastify.get('/collaborators', { onRequest: [fastify.authenticate] }, collaboratorsController_1.getAllCollaborators);
    // @ts-ignore
    fastify.get('/collaborators:id', { onRequest: [fastify.authenticate] }, collaboratorsController_1.getCollaboratorById);
    await fastify.listen({ port: 3333, host: '0.0.0.0' });
}
bootstrap();
(0, userController_1.checkUsers)();
setTimeout(() => {
    (0, userController_1.checkCollaborators)();
    console.log(moment().format());
}, 5000);
