import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  // log: ['query']
})

export async function createProject(request: any, reply: any) {
  try {

    const { name }: any = request.body;
    const project = await prisma.projects.create({
      data: {
        name,
      }
    })
    reply.status(201).send(project);
  } catch (error: any) {
    reply.status(500).send({ error: error.message });
  }
}


export async function deleteProject(request: any, reply: any) {
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
    reply.status(200).send({ message: 'Projeto deletado com sucesso' });

  } catch (error: any) {
    reply.status(500).send({ error: error.message });
  }
}

export async function getAllProjects(request: any, reply: any) {
  try {
    const response = await prisma.projects.findMany({
      include: {
        Tasks: {
          select: {
            name: true,
            id: true,
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
    reply.status(200).send(response);
  } catch (error: any) {
    reply.status(500).send({ error: error.message });
  }

}

export async function getProjectById(request: any, reply: any) {
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
    reply.status(200).send(project);

  } catch (error: any) {
    reply.status(500).send({ error: error.message });
  }
}

export async function modifyProject(request: any, reply: any) {
  const projectId = request.params.id;
  const name = request.body.name
  try {
    const project = await prisma.projects.findFirst({
      where: {
        id: projectId,
      },
    })
    if (!project) {
      reply.status(404).send({ error: "Projeto não encontrado!" })
    }
    const projectUpdated = await prisma.projects.update({
      where: {
        id: projectId
      },
      data: {
        name
      }
    })
    reply.status(200).send(projectUpdated)

  } catch (error: any) {
    reply.status(500).send({ error: error.message });
  }
}