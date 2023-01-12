import { PrismaClient } from '@prisma/client';
import { endOfDay, startOfDay, startOfMonth, endOfMonth } from 'date-fns';
import moment from 'moment-timezone';


const prisma = new PrismaClient({
  // log: ['query']
})


export async function getTaskTotalMinutes(taskId: string) {
  try {
    const timetrackers = await prisma.timeTracker.findMany({ where: { taskId } });
    if (!timetrackers) {
      return 'Task não encontrada'
    } else {
      let totalMinutes = 0;
      for (const count of timetrackers) {
        const startDate = count.startDate;
        const endDate = count.endDate;
        const duration = moment.duration(moment(endDate).diff(moment(startDate)));
        const minutes = duration.asMinutes();
        totalMinutes += minutes;
      }
      return totalMinutes
    }
  } catch (error) {
    return error
  }
};

export async function getDayTotalMinutes() {
  try {
    const today = startOfDay(new Date());
    const tomorrow = endOfDay(new Date());
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
    })
    console.log(timetrackers)
    if (!timetrackers) {
      return 'Task não encontrada'
    } else {
      let totalMinutes = 0;
      let totalHours = 0;
      let totalMinutesString
      let totalHoursString
      for (const count of timetrackers) {
        const startDate = count.startDate;
        const endDate = count.endDate;
        const duration = moment.duration(moment(endDate).diff(moment(startDate)));
        const minutes = duration.asMinutes();
        totalMinutes += minutes;
      }
      console.log(totalMinutes)
      totalHours = Math.floor(totalMinutes / 60);
      totalMinutes %= 60;
      console.log(totalHours)
      if (totalHours <= 9) {
        totalHoursString = String('0' + totalHours)
      }
      if (totalMinutes <= 9) {
        totalMinutesString = String('0' + totalMinutes)
      }
      return (`${totalHoursString}:${totalMinutesString}`)
    }
  } catch (error) {
    return error
  }
};

export async function getMonthTotalMinutes() {
  try {
    const thisMonth = startOfMonth(new Date());
    const nextMonth = endOfMonth(new Date());
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
    })
    if (!timetrackers) {
      return 'Task não encontrada'
    } else {
      let totalMinutes = 0;
      let totalHours = 0;
      let totalMinutesString
      let totalHoursString
      for (const count of timetrackers) {
        const startDate = count.startDate;
        const endDate = count.endDate;
        const duration = moment.duration(moment(endDate).diff(moment(startDate)));
        const minutes = duration.asMinutes();
        totalMinutes += minutes;
      }
      console.log(totalMinutes)
      totalHours = Math.floor(totalMinutes / 60);
      totalMinutes %= 60;
      console.log(totalHours)
      if (totalHours <= 9) {
        totalHoursString = String('0' + totalHours)
      }
      if (totalMinutes <= 9) {
        totalMinutesString = String('0' + totalMinutes)
      }
      return (`${totalHours}:${totalMinutes}`)
    }
  } catch (error) {
    return error
  }
};

