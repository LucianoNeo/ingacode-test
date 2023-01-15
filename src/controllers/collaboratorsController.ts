import { PrismaClient } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';

const prisma = new PrismaClient({
  // log: ['query']
})


export async function getAllCollaborators(request: any, reply: any) {
  try {
    const response = await prisma.collaborators.findMany({
      select: {
        id: true,
        name: true,
        userId: true
      }
    })
    reply.status(200).send(response)
  } catch (error: any) {
    reply.status(500).send({ error: error.message })
  }

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
    reply.status(200).send(collab);

  } catch (error: any) {
    reply.status(500).send({ error: error.message });
  }
}
