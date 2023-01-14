"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMonthTotalMinutes = exports.getDayTotalMinutes = exports.getTaskTotalMinutes = void 0;
const client_1 = require("@prisma/client");
const date_fns_1 = require("date-fns");
const prisma = new client_1.PrismaClient({
// log: ['query']
});
async function getTaskTotalMinutes(request, reply) {
    const taskId = request.params.id;
    try {
        const timetrackers = await prisma.timeTracker.findMany({ where: { taskId } });
        if (!timetrackers) {
            reply.status(404).send({ error: 'Task não encontrada' });
        }
        else {
            let totalMinutes = 0;
            for (const count of timetrackers) {
                const startDate = count.startDate;
                const endDate = count.endDate;
                totalMinutes += (0, date_fns_1.differenceInMinutes)(Number(endDate), Number(startDate));
            }
            reply.status(200).send(totalMinutes);
        }
    }
    catch (error) {
        reply.status(401).send(error);
    }
}
exports.getTaskTotalMinutes = getTaskTotalMinutes;
;
async function getDayTotalMinutes(request, reply) {
    const { daySent } = request.body;
    try {
        const day = (0, date_fns_1.startOfDay)(new Date(daySent));
        const day_end = (0, date_fns_1.endOfDay)(new Date(daySent));
        const timetrackers = await prisma.timeTracker.findMany({
            where: {
                AND: [
                    {
                        startDate: {
                            gte: day
                        },
                        endDate: {
                            lte: day_end
                        }
                    }
                ]
            }
        });
        console.log(timetrackers);
        if (!timetrackers) {
            reply.status(404).send('Tempo não encontrado');
        }
        else {
            let totalMinutes = 0;
            let totalHours = 0;
            for (const count of timetrackers) {
                const startDate = count.startDate;
                const endDate = count.endDate;
                totalMinutes += (0, date_fns_1.differenceInMinutes)(Number(endDate), Number(startDate));
            }
            console.log(totalMinutes);
            totalHours = Math.floor(totalMinutes / 60);
            totalMinutes = Math.floor(totalMinutes %= 60);
            console.log(totalHours);
            console.log(totalMinutes);
            if (totalHours <= 9) {
                /* @ts-ignore */
                totalHours = String('0' + totalHours);
            }
            if (totalMinutes <= 9) {
                /* @ts-ignore */
                totalMinutes = String('0' + totalMinutes);
            }
            reply.status(201).send(`${totalHours}:${totalMinutes}`);
        }
    }
    catch (error) {
        return error;
    }
}
exports.getDayTotalMinutes = getDayTotalMinutes;
;
async function getMonthTotalMinutes(request, reply) {
    try {
        const thisMonth = (0, date_fns_1.startOfMonth)(new Date());
        const nextMonth = (0, date_fns_1.endOfMonth)(new Date());
        const timetrackers = await prisma.timeTracker.findMany({
            where: {
                AND: [
                    {
                        startDate: {
                            gte: thisMonth
                        },
                        endDate: {
                            lte: nextMonth
                        }
                    }
                ]
            }
        });
        if (!timetrackers) {
            reply.status(404).send('Tempo não encontrado');
        }
        else {
            let totalMinutes = 0;
            let totalHours = 0;
            for (const count of timetrackers) {
                const startDate = count.startDate;
                const endDate = count.endDate;
                totalMinutes += (0, date_fns_1.differenceInMinutes)(Number(endDate), Number(startDate));
            }
            totalHours = Math.floor(totalMinutes / 60);
            totalMinutes = Math.floor(totalMinutes %= 60);
            if (totalHours <= 9) {
                /* @ts-ignore */
                totalHours = String('0' + totalHours);
            }
            if (totalMinutes <= 9) {
                /* @ts-ignore */
                totalMinutes = String('0' + totalMinutes);
            }
            reply.status(201).send(`${totalHours}:${totalMinutes}`);
        }
    }
    catch (error) {
        return error;
    }
}
exports.getMonthTotalMinutes = getMonthTotalMinutes;
;
