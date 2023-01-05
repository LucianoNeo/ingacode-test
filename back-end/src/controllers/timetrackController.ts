import { PrismaClient } from '@prisma/client';
import moment from 'moment-timezone';

const prisma = new PrismaClient({
  // log: ['query']
})

export async function getAllTimeTrackers() {
  return await prisma.timeTracker.findMany({
    select: {
      startDate: true,
      endDate: true,
      taskId: true,
      collaboratorId: true
    },
    orderBy: {
      startDate: 'asc'
    }
  })
}

export async function createTimeTracker(request, reply) {
  const { startDate, endDate, taskId, collaboratorId }: any = request.body;
  const overlappingTimetrackers = await prisma.timeTracker.findMany({
    where: {
      AND: [
        { startDate: { gte: startDate } },
        { endDate: { lte: endDate } },
      ],
    },
  });
  if (moment(startDate).isAfter(endDate)) {
    return reply.status(400).send({ error: 'O horário de término deve ser MAIOR que o de início!' });
  }
  else if (overlappingTimetrackers.length > 0) {
    return reply.status(400).send({ error: 'Já existe um timetracker para este intervalo de tempo' });
  } else {
    const timeZoneId = moment.tz.guess();
    const timetracker = await prisma.timeTracker.create({
      data: {
        startDate,
        endDate,
        timeZoneId,
        taskId,
      }
    })
    reply.status(201).send(timetracker);
  }
}