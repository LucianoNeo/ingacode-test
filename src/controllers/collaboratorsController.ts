import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  // log: ['query']
})


export async function getAllCollaborators() {
  return await prisma.collaborators.findMany({
    select: {
      id: true,
      name: true,
      userId: true
    }
  })
}

export async function getCollaboratorById(request: any, reply: any) {
  const id = request.params.id;
  try {
    const collab = await prisma.collaborators.findFirst({
      where: {
        id
      },
    })
    if (!collab) {
      reply.status(404).send({ error: "Colaborador não encontrado!" })
    }
    reply.status(201).send(collab);

  } catch (error: any) {
    reply.status(500).send({ error: error.message });
  }
}
