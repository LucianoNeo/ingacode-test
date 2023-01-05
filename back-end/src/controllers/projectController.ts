import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  // log: ['query']
})

export async function createProject(request, reply) {
  const { name }: any = request.body;
  const project = await prisma.projects.create({
    data: {
      name,
    }
  })
  reply.status(201).send(project);
}

export async function deleteProject(request, reply) {
  const projectId = request.params.id;
  try {
    const project = await prisma.projects.findFirst({
      where: {
        id: projectId,
      },
    })
    if (!project) {
      reply.status(404).send({ error: "Projeto não encontrado!" })
    }
    await prisma.projects.delete({
      where: {
        id: projectId
      }
    })
    reply.status(201).send({ message: 'Projeto deletado com sucesso' });

  } catch (error) {
    reply.status(500).send({ error: error.message });
  }
}

export async function readAllProjects() {
  return await prisma.projects.findMany({
    include: {
      Tasks: {
        select: {
          name: true,
          TimeTracker: {
            select: {
              startDate: true,
              endDate: true,
              collaborator: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      }
    }
  })
}
