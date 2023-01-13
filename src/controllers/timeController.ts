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

export async function getDayTotalMinutes(request: any, reply: any) {
  const { daySent }: any = request.body;
  try {
    const day = startOfDay(new Date(daySent));
    const day_end = endOfDay(new Date(daySent));
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
    })
    console.log(timetrackers)
    if (!timetrackers) {
      reply.status(404).send('Tempo não encontrado')
    } else {
      let totalMinutes = 0;
      let totalHours = 0;
      for (const count of timetrackers) {
        const startDate = count.startDate;
        const endDate = count.endDate;
        const duration = moment.duration(moment(endDate).diff(moment(startDate)));
        const minutes = duration.asMinutes();
        totalMinutes += minutes;
      }
      console.log(totalMinutes)
      totalHours = Math.floor(totalMinutes / 60);
      totalMinutes = Math.floor(totalMinutes %= 60)
      console.log(totalHours)
      console.log(totalMinutes)
      if (totalHours <= 9) {
        /* @ts-ignore */
        totalHours = String('0' + totalHours)
      }
      if (totalMinutes <= 9) {
        /* @ts-ignore */
        totalMinutes = String('0' + totalMinutes)
      }
      reply.status(201).send(`${totalHours}:${totalMinutes}`)
    }
  } catch (error) {
    return error
  }
};

export async function getMonthTotalMinutes(request: any, reply: any) {
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
      reply.status(404).send('Tempo não encontrado')
    } else {
      let totalMinutes = 0;
      let totalHours = 0;
      for (const count of timetrackers) {
        const startDate = count.startDate;
        const endDate = count.endDate;
        const duration = moment.duration(moment(endDate).diff(moment(startDate)));
        const minutes = duration.asMinutes();
        totalMinutes += minutes;
      }
      totalHours = Math.floor(totalMinutes / 60);
      totalMinutes = Math.floor(totalMinutes %= 60)
      if (totalHours <= 9) {
        /* @ts-ignore */
        totalHours = String('0' + totalHours)
      }
      if (totalMinutes <= 9) {
        /* @ts-ignore */
        totalMinutes = String('0' + totalMinutes)
      }
      reply.status(201).send(`${totalHours}:${totalMinutes}`)
    }
  } catch (error) {
    return error
  }
};

