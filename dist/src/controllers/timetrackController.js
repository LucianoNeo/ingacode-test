"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTimeTrackerById = exports.modifyTimeTracker = exports.deleteTT = exports.createTimeTracker = exports.getAllTimeTrackers = void 0;
const client_1 = require("@prisma/client");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const prisma = new client_1.PrismaClient({
// log: ['query']
});
async function getAllTimeTrackers() {
    return await prisma.timeTracker.findMany({
        select: {
            id: true,
            startDate: true,
            endDate: true,
            taskId: true,
            collaboratorId: true
        },
        orderBy: {
            startDate: 'asc'
        }
    });
}
exports.getAllTimeTrackers = getAllTimeTrackers;
async function createTimeTracker(request, reply) {
    const { startDate, endDate, taskId, collaboratorId } = request.body;
    const overlappingTimetrackers = await prisma.timeTracker.findMany({
        where: {
            AND: [
                { startDate: { gte: startDate } },
                { endDate: { lte: endDate } },
            ],
        },
    });
    if (endDate && (0, moment_timezone_1.default)(startDate).isAfter(endDate)) {
        return reply.status(400).send({ error: 'O horário de término deve ser MAIOR que o de início!' });
    }
    else if (startDate && endDate && overlappingTimetrackers.length > 0) {
        return reply.status(400).send({ error: 'Já existe um timetracker para este intervalo de tempo' });
    }
    else {
        const timeZoneId = moment_timezone_1.default.tz.guess();
        if (collaboratorId) {
            const timetracker = await prisma.timeTracker.create({
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
                            id: taskId
                        }
                    }
                },
            });
            reply.status(201).send(timetracker);
        }
        else {
            const timetracker = await prisma.timeTracker.create({
                data: {
                    startDate,
                    endDate,
                    timeZoneId,
                    task: {
                        connect: {
                            id: taskId
                        }
                    }
                },
            });
            reply.status(201).send(timetracker);
        }
    }
}
exports.createTimeTracker = createTimeTracker;
async function deleteTT(request, reply) {
    const id = request.params.id;
    try {
        const task = await prisma.timeTracker.findFirst({
            where: {
                id
            },
        });
        if (!task) {
            reply.status(404).send({ error: "TT não encontrado!" });
        }
        await prisma.timeTracker.delete({
            where: {
                id
            }
        });
        reply.status(201).send({ message: 'TT deletado com sucesso' });
    }
    catch (error) {
        reply.status(500).send({ error: error.message });
    }
}
exports.deleteTT = deleteTT;
async function modifyTimeTracker(request, reply) {
    const TimeTrackerId = request.params.id;
    const { startDate, endDate, taskId, collaboratorId } = request.body;
    try {
        const timeTracker = await prisma.timeTracker.findFirst({
            where: {
                id: TimeTrackerId,
            },
        });
        if (!timeTracker) {
            reply.status(404).send({ error: "TimeTracker não encontrado!" });
        }
        const timeTrackerUpdated = await prisma.timeTracker.update({
            where: {
                id: TimeTrackerId
            },
            data: {
                startDate,
                endDate,
                collaboratorId,
            },
            select: {
                startDate: true,
                endDate: true,
                task: {
                    select: {
                        name: true
                    }
                },
                collaborator: {
                    select: {
                        name: true
                    }
                }
            }
        });
        reply.status(201).send(timeTrackerUpdated);
    }
    catch (error) {
        reply.status(500).send({ error: error.message });
    }
}
exports.modifyTimeTracker = modifyTimeTracker;
async function getTimeTrackerById(request, reply) {
    try {
        const timeTrackerId = request.params.id;
        const timeTracker = await prisma.timeTracker.findFirst({
            where: {
                id: timeTrackerId,
            },
            include: {
                task: {
                    select: {
                        name: true
                    }
                },
                collaborator: {
                    select: {
                        name: true
                    }
                }
            }
        });
        if (!timeTracker) {
            reply.status(404).send({ error: 'TimeTracker não encontrado' });
        }
        else {
            reply.send(timeTracker);
        }
    }
    catch (error) {
        reply.status(500).send({ error: error.message });
    }
}
exports.getTimeTrackerById = getTimeTrackerById;
