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
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRoutes = void 0;
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const collaboratorsController_1 = require("./controllers/collaboratorsController");
const projectController_1 = require("./controllers/projectController");
const taskController_1 = require("./controllers/taskController");
const timeController_1 = require("./controllers/timeController");
const timetrackController_1 = require("./controllers/timetrackController");
const prisma = new client_1.PrismaClient({
// log: ['query']
});
async function appRoutes(app) {
    app.post('/login', async (request, reply) => {
        const { username, password } = request.body;
        const user = await prisma.users.findFirst({
            where: {
                username
            }
        });
        if (!user) {
            reply.status(400).send({ error: 'Usuário ou Senha inválida' });
            return;
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (isValidPassword) {
            /* @ts-ignore */
            const token = app.jwt.sign({ id: user.id, username: user.username }, { expiresIn: '1d' });
            reply.send({ token, username });
        }
        else {
            reply.status(400).send({ error: 'Usuário ou Senha inválida' });
        }
    });
    app.decorate('authenticate', async (request, reply) => {
        try {
            await request.jwtVerify();
        }
        catch (error) {
            reply.status(401).send({ error: error.message });
        }
    });
    app.get('/validatetoken', {
        /* @ts-ignore */
        onRequest: [app.authenticate]
    }, async (request, reply) => {
        try {
            reply.status(200).send(request.user);
        }
        catch (error) {
            reply.status(401).send(error.message);
        }
    });
    /* @ts-ignore */
    app.get('/projects', { onRequest: [app.authenticate] }, projectController_1.getAllProjects);
    /* @ts-ignore */
    app.get('/projects/:id', { onRequest: [app.authenticate] }, projectController_1.getProjectById);
    // @ts-ignore
    app.post('/projects', { onRequest: [app.authenticate] }, projectController_1.createProject);
    // @ts-ignore
    app.delete('/projects/:id', { onRequest: [app.authenticate] }, projectController_1.deleteProject);
    // @ts-ignore
    app.put('/projects/:id', { onRequest: [app.authenticate] }, projectController_1.modifyProject);
    /* @ts-ignore */
    app.get('/tasks', { onRequest: [app.authenticate] }, taskController_1.getAllTasks);
    // @ts-ignore
    app.get('/tasks/:id', { onRequest: [app.authenticate] }, taskController_1.getTaskById);
    // @ts-ignore
    app.post('/tasks', { onRequest: [app.authenticate] }, taskController_1.createTask);
    // @ts-ignore
    app.delete('/tasks/:id', { onRequest: [app.authenticate] }, taskController_1.deleteTask);
    // @ts-ignore
    app.put('/tasks/:id', { onRequest: [app.authenticate] }, taskController_1.modifyTask);
    // @ts-ignore
    app.get('/timetrackers', { onRequest: [app.authenticate] }, timetrackController_1.getAllTimeTrackers);
    // @ts-ignore
    app.get('/timetrackers/:id', { onRequest: [app.authenticate] }, timetrackController_1.getTimeTrackerById);
    // @ts-ignore
    app.post('/timetrackers', { onRequest: [app.authenticate] }, timetrackController_1.createTimeTracker);
    // @ts-ignore
    app.put('/timetrackers/:id', { onRequest: [app.authenticate] }, timetrackController_1.modifyTimeTracker);
    // @ts-ignore
    app.delete('/timetrackers/:id', { onRequest: [app.authenticate] }, timetrackController_1.deleteTT);
    // @ts-ignore
    app.post('/daytotalminutes', { onRequest: [app.authenticate] }, timeController_1.getDayTotalMinutes);
    // @ts-ignore
    app.get('/monthtotalminutes', { onRequest: [app.authenticate] }, timeController_1.getMonthTotalMinutes);
    // @ts-ignore
    app.get('/tasktotalminutes/:id', { onRequest: [app.authenticate] }, timeController_1.getTaskTotalMinutes);
    // @ts-ignore
    app.get('/collaborators', { onRequest: [app.authenticate] }, collaboratorsController_1.getAllCollaborators);
    // @ts-ignore
    app.get('/collaborators:id', { onRequest: [app.authenticate] }, collaboratorsController_1.getCollaboratorById);
}
exports.appRoutes = appRoutes;
