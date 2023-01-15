import { PrismaClient } from '@prisma/client';
import { endOfDay, startOfDay, startOfMonth, endOfMonth, differenceInMinutes } from 'date-fns';
import moment from 'moment-timezone';


const prisma = new PrismaClient({
  // log: ['query']
})


export async function getTaskTotalMinutes(request: any, reply: any) {
  const taskId = request.params.id;
  try {
    const timetrackers = await prisma.timeTracker.findMany({ where: { taskId } });
    if (!timetrackers) {
      reply.status(404).send({ error: 'Task não encontrada' })
    } else {
      let totalMinutes = 0;
      for (const count of timetrackers) {
        const startDate = count.startDate;
        const endDate = count.endDate;
        totalMinutes += differenceInMinutes(Number(endDate), Number(startDate));
      }
      reply.status(200).send(totalMinutes)
    }
  } catch (error: any) {
    reply.status(500).send({ error: error.message });
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
        totalMinutes += differenceInMinutes(Number(endDate), Number(startDate));
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
      reply.status(200).send(`${totalHours}:${totalMinutes}`)
    }
  } catch (error: any) {
    reply.status(500).send({ error: error.message });
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
        totalMinutes += differenceInMinutes(Number(endDate), Number(startDate));
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
      reply.status(200).send(`${totalHours}:${totalMinutes}`)
    }
  } catch (error: any) {
    reply.status(500).send({ error: error.message });
  }
};

