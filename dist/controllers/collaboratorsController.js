"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCollaboratorById = exports.getAllCollaborators = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
// log: ['query']
});
async function getAllCollaborators(request, reply) {
    try {
        const response = await prisma.collaborators.findMany({
            select: {
                id: true,
                name: true,
                userId: true
            }
        });
        reply.status(200).send(response);
    }
    catch (error) {
        reply.status(500).send({ error: error.message });
    }
}
exports.getAllCollaborators = getAllCollaborators;
async function getCollaboratorById(request, reply) {
    const id = request.params.id;
    try {
        const collab = await prisma.collaborators.findFirst({
            where: {
                id
            },
        });
        if (!collab) {
            reply.status(404).send({ error: "Colaborador não encontrado!" });
        }
        reply.status(200).send(collab);
    }
    catch (error) {
        reply.status(500).send({ error: error.message });
    }
}
exports.getCollaboratorById = getCollaboratorById;
