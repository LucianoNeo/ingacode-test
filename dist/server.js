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
const projectController_1 = require("./controllers/projectController");
const taskController_1 = require("./controllers/taskController");
const timeController_1 = require("./controllers/timeController");
const timetrackController_1 = require("./controllers/timetrackController");
const userController_1 = require("./controllers/userController");
const prisma = new client_1.PrismaClient({
// log: ['query']
});
const fastify = (0, fastify_1.default)({
    logger: true,
});
const jwt = require('fastify-jwt');
fastify.register(jwt, { secret: 'my-secret' });
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
        onRequest: [fastify.authenticate]
    }, async (request, reply) => {
        return request.user;
    });
    // Project routes
    fastify.get('/projects', { onRequest: [fastify.authenticate] }, projectController_1.getAllProjects);
    fastify.get('/projects/:id', { onRequest: [fastify.authenticate] }, projectController_1.getProjectById);
    fastify.post('/projects', { onRequest: [fastify.authenticate] }, projectController_1.createProject);
    fastify.delete('/projects/:id', { onRequest: [fastify.authenticate] }, projectController_1.deleteProject);
    fastify.put('/projects/:id', { onRequest: [fastify.authenticate] }, projectController_1.modifyProject);
    // Task routes
    fastify.get('/tasks', { onRequest: [fastify.authenticate] }, taskController_1.getAllTasks);
    fastify.get('/tasks/:id', { onRequest: [fastify.authenticate] }, taskController_1.getTaskById);
    fastify.post('/tasks', { onRequest: [fastify.authenticate] }, taskController_1.createTask);
    fastify.delete('/tasks/:id', { onRequest: [fastify.authenticate] }, taskController_1.deleteTask);
    fastify.put('/tasks/:id', { onRequest: [fastify.authenticate] }, taskController_1.modifyTask);
    // TimeTrack routes
    fastify.get('/timetrackers', { onRequest: [fastify.authenticate] }, timetrackController_1.getAllTimeTrackers);
    fastify.get('/timetrackers/:id', { onRequest: [fastify.authenticate] }, timetrackController_1.getTimeTrackerById);
    fastify.post('/timetrackers', { onRequest: [fastify.authenticate] }, timetrackController_1.createTimeTracker);
    fastify.put('/timetrackers/:id', { onRequest: [fastify.authenticate] }, timetrackController_1.modifyTimeTracker);
    fastify.delete('/timetrackers/:id', { onRequest: [fastify.authenticate] }, timetrackController_1.deleteTT);
    //Time routes
    fastify.get('/daytotalminutes', { onRequest: [fastify.authenticate] }, timeController_1.getDayTotalMinutes);
    fastify.get('/monthtotalminutes', { onRequest: [fastify.authenticate] }, timeController_1.getMonthTotalMinutes);
    await fastify.listen({ port: 3333, host: '0.0.0.0' });
}
bootstrap();
(0, userController_1.checkUsers)();
(0, userController_1.checkCollaborators)();
