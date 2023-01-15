import { PrismaClient } from '@prisma/client';
import moment from 'moment-timezone';

const prisma = new PrismaClient({
  // log: ['query']
})

export async function getAllTimeTrackers(request: any, reply: any) {
  try {
    const response = await prisma.timeTracker.findMany({
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
    })
    reply.status(200).send(response)
  } catch (error: any) {
    reply.status(500).send({ error: error.message });
  }

}

export async function createTimeTracker(request: any, reply: any) {
  try {
    const { startDate, endDate, taskId, collaboratorId }: any = request.body;
    const overlappingTimetrackers = await prisma.timeTracker.findMany({
      where: {
        AND: [
          { startDate: { gte: startDate } },
          { endDate: { lte: endDate } },
        ],
      },
    });
    if (endDate && moment(startDate).isAfter(endDate)) {
      return reply.status(400).send({ error: 'O horário de término deve ser MAIOR que o de início!' });
    }
    else if (startDate && endDate && overlappingTimetrackers.length > 0) {
      return reply.status(400).send({ error: 'Já existe um timetracker para este intervalo de tempo' });
    } else {
      const timeZoneId = moment.tz.guess();
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
      } else {
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
  } catch (error: any) {
    reply.status(500).send({ error: error.message });
  }

}

export async function deleteTT(request: any, reply: any) {
  const id = request.params.id;
  try {
    const task = await prisma.timeTracker.findFirst({
      where: {
        id
      },
    })
    if (!task) {
      reply.status(404).send({ error: "TT não encontrado!" })
    }
    await prisma.timeTracker.delete({
      where: {
        id
      }
    })
    reply.status(200).send({ message: 'TT deletado com sucesso' });

  } catch (error: any) {
    reply.status(500).send({ error: error.message });
  }
}

export async function modifyTimeTracker(request: any, reply: any) {
  const TimeTrackerId = request.params.id;
  const { startDate, endDate, taskId, collaboratorId } = request.body
  try {
    const timeTracker = await prisma.timeTracker.findFirst({
      where: {
        id: TimeTrackerId,
      },
    })
    if (!timeTracker) {
      reply.status(404).send({ error: "TimeTracker não encontrado!" })
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
    })
    reply.status(201).send(timeTrackerUpdated)

  } catch (error: any) {
    reply.status(500).send({ error: error.message });
  }
}

export async function getTimeTrackerById(request: any, reply: any) {
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
    } else {
      reply.status(200).send(timeTracker);
    }
  } catch (error: any) {
    reply.status(500).send({ error: error.message });
  }
}