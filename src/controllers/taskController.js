"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.modifyTask = exports.deleteTask = exports.createTask = exports.getTaskById = exports.getAllTasks = void 0;
const client_1 = require("@prisma/client");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const prisma = new client_1.PrismaClient({
    log: ['query']
});
async function getTaskTotalMinutes(taskId) {
    try {
        const timetrackers = await prisma.timeTracker.findMany({ where: { taskId } });
        if (!timetrackers) {
            return 'Task não encontrada';
        }
        else {
            let totalMinutes = 0;
            for (const count of timetrackers) {
                const startDate = count.startDate;
                const endDate = count.endDate;
                const duration = moment_timezone_1.default.duration((0, moment_timezone_1.default)(endDate).diff((0, moment_timezone_1.default)(startDate)));
                const minutes = duration.asMinutes();
                totalMinutes += minutes;
            }
            return totalMinutes;
        }
    }
    catch (error) {
        return error;
    }
}
;
async function getAllTasks() {
    return await prisma.tasks.findMany({
        include: {
            project: {
                select: {
                    name: true
                }
            },
            TimeTracker: {
                select: {
                    startDate: true,
                    endDate: true,
                    timeZoneId: true,
                    collaborator: {
                        select: {
                            name: true
                        }
                    }
                }
            },
        }
    });
}
exports.getAllTasks = getAllTasks;
async function getTaskById(request, reply) {
    try {
        const taskId = request.params.id;
        const task = await prisma.tasks.findFirst({
            where: {
                id: taskId,
            },
            include: {
                project: {
                    select: {
                        name: true
                    }
                },
                TimeTracker: {
                    select: {
                        startDate: true,
                        endDate: true,
                        timeZoneId: true,
                        collaborator: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
            }
        });
        if (!task) {
            reply.status(404).send({ error: 'Task não encontrada' });
        }
        else {
            reply.send(task);
        }
    }
    catch (error) {
        reply.status(500).send({ error: error.message });
    }
}
exports.getTaskById = getTaskById;
async function createTask(request, reply) {
    const { name, description, projectId, startDate, endDate, collaboratorId } = request.body;
    try {
        const overlappingTimetrackers = await prisma.timeTracker.findMany({
            where: {
                AND: [
                    { startDate: { gte: startDate } },
                    { endDate: { lte: endDate } },
                ],
            },
        });
        if ((0, moment_timezone_1.default)(startDate).isAfter(endDate)) {
            return reply.status(400).send({ error: 'O horário de término deve ser MAIOR que o de início!' });
        }
        if (overlappingTimetrackers.length > 0 && startDate != null) {
            return reply.status(400).send({ error: 'Já existe um timetracker para este intervalo de tempo' });
        }
        else {
            const timeZoneId = moment_timezone_1.default.tz.guess();
            const task = await prisma.tasks.create({
                data: {
                    name,
                    description,
                    project: {
                        connect: {
                            id: projectId
                        }
                    },
                    updatedAt: new Date()
                },
            });
            if (startDate != null || startDate != undefined) {
                if (collaboratorId) {
                    await prisma.timeTracker.create({
                        data: {
                            startDate,
                            endDate,
                            timeZoneId,
                            collaborator: {
                                connect: {
                                    id: collaboratorId
                                }
                            },
                            task: {
                                connect: {
                                    id: task.id
                                }
                            }
                        },
                    });
                }
                else {
                    await prisma.timeTracker.create({
                        data: {
                            startDate,
                            endDate,
                            timeZoneId,
                            task: {
                                connect: {
                                    id: task.id
                                }
                            }
                        },
                    });
                }
            }
            else {
                if (collaboratorId) {
                    await prisma.timeTracker.create({
                        data: {
                            timeZoneId,
                            collaborator: {
                                connect: {
                                    id: collaboratorId
                                }
                            },
                            task: {
                                connect: {
                                    id: task.id
                                }
                            }
                        },
                    });
                }
                else {
                    await prisma.timeTracker.create({
                        data: {
                            timeZoneId,
                            task: {
                                connect: {
                                    id: task.id
                                }
                            }
                        },
                    });
                }
            }
            reply.status(201).send(task);
        }
    }
    catch (error) {
        reply.status(500).send({ error: error.message });
    }
}
exports.createTask = createTask;
async function deleteTask(request, reply) {
    const taskId = request.params.id;
    try {
        const task = await prisma.tasks.findFirst({
            where: {
                id: taskId,
            },
        });
        if (!task) {
            reply.status(404).send({ error: "Task não encontrada!" });
        }
        await prisma.tasks.delete({
            where: {
                id: taskId
            }
        });
        reply.status(201).send({ message: 'Task deletada com sucesso' });
    }
    catch (error) {
        reply.status(500).send({ error: error.message });
    }
}
exports.deleteTask = deleteTask;
async function modifyTask(request, reply) {
    const taskId = request.params.id;
    const { name, description, projectId, collaboratorId } = request.body;
    try {
        const task = await prisma.tasks.findFirst({
            where: {
                id: taskId,
            },
        });
        if (!task) {
            reply.status(404).send({ error: "Task não encontrada!" });
        }
        const taskUpdated = await prisma.tasks.update({
            where: {
                id: taskId
            },
            data: {
                name,
                description,
                project: {
                    connect: {
                        id: projectId
                    }
                }
            }
        });
        reply.status(201).send(taskUpdated);
    }
    catch (error) {
        reply.status(500).send({ error: error.message });
    }
}
exports.modifyTask = modifyTask;
