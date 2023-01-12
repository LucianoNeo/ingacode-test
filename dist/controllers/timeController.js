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
async function getDayTotalMinutes() {
    try {
        const today = (0, date_fns_1.startOfDay)(new Date());
        const tomorrow = (0, date_fns_1.endOfDay)(new Date());
        const timetrackers = await prisma.timeTracker.findMany({
            where: {
                AND: [
                    {
                        startDate: {
                            gte: today
                        },
                        endDate: {
                            lte: tomorrow
                        }
                    }
                ]
            }
        });
        console.log(timetrackers);
        if (!timetrackers) {
            return 'Task não encontrada';
        }
        else {
            let totalMinutes = 0;
            let totalHours = 0;
            let totalMinutesString;
            let totalHoursString;
            for (const count of timetrackers) {
                const startDate = count.startDate;
                const endDate = count.endDate;
                const duration = moment_timezone_1.default.duration((0, moment_timezone_1.default)(endDate).diff((0, moment_timezone_1.default)(startDate)));
                const minutes = duration.asMinutes();
                totalMinutes += minutes;
            }
            console.log(totalMinutes);
            totalHours = Math.floor(totalMinutes / 60);
            totalMinutes %= 60;
            console.log(totalHours);
            if (totalHours <= 9) {
                totalHoursString = String('0' + totalHours);
            }
            if (totalMinutes <= 9) {
                totalMinutesString = String('0' + totalMinutes);
            }
            return (`${totalHoursString}:${totalMinutesString}`);
        }
    }
    catch (error) {
        return error;
    }
}
exports.getDayTotalMinutes = getDayTotalMinutes;
;
async function getMonthTotalMinutes() {
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
            return 'Task não encontrada';
        }
        else {
            let totalMinutes = 0;
            let totalHours = 0;
            let totalMinutesString;
            let totalHoursString;
            for (const count of timetrackers) {
                const startDate = count.startDate;
                const endDate = count.endDate;
                const duration = moment_timezone_1.default.duration((0, moment_timezone_1.default)(endDate).diff((0, moment_timezone_1.default)(startDate)));
                const minutes = duration.asMinutes();
                totalMinutes += minutes;
            }
            console.log(totalMinutes);
            totalHours = Math.floor(totalMinutes / 60);
            totalMinutes %= 60;
            console.log(totalHours);
            if (totalHours <= 9) {
                totalHoursString = String('0' + totalHours);
            }
            if (totalMinutes <= 9) {
                totalMinutesString = String('0' + totalMinutes);
            }
            return (`${totalHours}:${totalMinutes}`);
        }
    }
    catch (error) {
        return error;
    }
}
exports.getMonthTotalMinutes = getMonthTotalMinutes;
;
