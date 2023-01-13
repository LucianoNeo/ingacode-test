"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMonthTotalMinutes = exports.getDayTotalMinutes = exports.getTaskTotalMinutes = void 0;
const client_1 = require("@prisma/client");
const date_fns_1 = require("date-fns");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const prisma = new client_1.PrismaClient({
// log: ['query']
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
                const duration = moment_timezone_1.default.duration((0, moment_timezone_1.default)(endDate).diff((0, moment_timezone_1.default)(startDate)));
                const minutes = duration.asMinutes();
                totalMinutes += minutes;
            }
            console.log(totalMinutes);
            totalHours = Math.floor(totalMinutes / 60);
            totalMinutes = Math.floor(totalMinutes %= 60);
            console.log(totalHours);
            console.log(totalMinutes);
            if (totalHours <= 9) {
                totalHours = String('0' + totalHours);
            }
            if (totalMinutes <= 9) {
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
                const duration = moment_timezone_1.default.duration((0, moment_timezone_1.default)(endDate).diff((0, moment_timezone_1.default)(startDate)));
                const minutes = duration.asMinutes();
                totalMinutes += minutes;
            }
            totalHours = Math.floor(totalMinutes / 60);
            totalMinutes = Math.floor(totalMinutes %= 60);
            if (totalHours <= 9) {
                totalHours = String('0' + totalHours);
            }
            if (totalMinutes <= 9) {
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
