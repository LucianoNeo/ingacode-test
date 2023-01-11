import { PrismaClient } from '@prisma/client';
import moment from 'moment-timezone';

const prisma = new PrismaClient({
  log: ['query']
})


async function getTaskTotalMinutes(taskId: string) {
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


export async function getAllTasks() {
  return await prisma.tasks.findMany({
    include: {
      project: {
        select: {
          id: true,
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
  })
}

export async function getTaskById(request: any, reply: any) {
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
    } else {
      reply.send(task);
    }
  } catch (error: any) {
    reply.status(500).send({ error: error.message });
  }
}

export async function createTask(request: any, reply: any) {
  const { name, description, projectId, startDate, endDate, collaboratorId }: any = request.body;
  try {
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
    if (overlappingTimetrackers.length > 0 && startDate != null) {
      return reply.status(400).send({ error: 'Já existe um timetracker para este intervalo de tempo' });
    } else {
      const timeZoneId = moment.tz.guess();
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
        } else {
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
        } else {
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
  } catch (error: any) {
    reply.status(500).send({ error: error.message });
  }
}

export async function deleteTask(request: any, reply: any) {
  const taskId = request.params.id;
  try {
    const task = await prisma.tasks.findFirst({
      where: {
        id: taskId,
      },
    })
    if (!task) {
      reply.status(404).send({ error: "Task não encontrada!" })
    }
    await prisma.tasks.delete({
      where: {
        id: taskId
      }
    })
    reply.status(201).send({ message: 'Task deletada com sucesso' });

  } catch (error: any) {
    reply.status(500).send({ error: error.message });
  }
}

export async function modifyTask(request: any, reply: any) {
  const taskId = request.params.id;
  const { name, description, projectId, collaboratorId } = request.body
  try {
    const task = await prisma.tasks.findFirst({
      where: {
        id: taskId,
      },
    })
    if (!task) {
      reply.status(404).send({ error: "Task não encontrada!" })
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
    })
    reply.status(201).send(taskUpdated)

  } catch (error: any) {
    reply.status(500).send({ error: error.message });
  }
}