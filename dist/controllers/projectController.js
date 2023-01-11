"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modifyProject = exports.getProjectById = exports.getAllProjects = exports.deleteProject = exports.createProject = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
// log: ['query']
});
async function createProject(request, reply) {
    const { name } = request.body;
    const project = await prisma.projects.create({
        data: {
            name,
        }
    });
    reply.status(201).send(project);
}
exports.createProject = createProject;
async function deleteProject(request, reply) {
    const projectId = request.params.id;
    try {
        const project = await prisma.projects.findFirst({
            where: {
                id: projectId,
            },
        });
        if (!project) {
            reply.status(404).send({ error: "Projeto não encontrado!" });
        }
        await prisma.projects.delete({
            where: {
                id: projectId
            }
        });
        reply.status(201).send({ message: 'Projeto deletado com sucesso' });
    }
    catch (error) {
        reply.status(500).send({ error: error.message });
    }
}
exports.deleteProject = deleteProject;
async function getAllProjects() {
    return await prisma.projects.findMany({
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
    });
}
exports.getAllProjects = getAllProjects;
async function getProjectById(request, reply) {
    const projectId = request.params.id;
    try {
        const project = await prisma.projects.findFirst({
            where: {
                id: projectId,
            },
        });
        if (!project) {
            reply.status(404).send({ error: "Projeto não encontrado!" });
        }
        reply.status(201).send(project);
    }
    catch (error) {
        reply.status(500).send({ error: error.message });
    }
}
exports.getProjectById = getProjectById;
async function modifyProject(request, reply) {
    const projectId = request.params.id;
    const name = request.body.name;
    try {
        const project = await prisma.projects.findFirst({
            where: {
                id: projectId,
            },
        });
        if (!project) {
            reply.status(404).send({ error: "Projeto não encontrado!" });
        }
        const projectUpdated = await prisma.projects.update({
            where: {
                id: projectId
            },
            data: {
                name
            }
        });
        reply.status(201).send(projectUpdated);
    }
    catch (error) {
        reply.status(500).send({ error: error.message });
    }
}
exports.modifyProject = modifyProject;
