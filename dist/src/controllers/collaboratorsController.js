"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCollaboratorById = exports.getAllCollaborators = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
// log: ['query']
});
async function getAllCollaborators() {
    return await prisma.collaborators.findMany({
        select: {
            id: true,
            name: true,
            userId: true
        }
    });
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
        reply.status(201).send(collab);
    }
    catch (error) {
        reply.status(500).send({ error: error.message });
    }
}
exports.getCollaboratorById = getCollaboratorById;
