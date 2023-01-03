import cors from "@fastify/cors";
import { PrismaClient } from '@prisma/client';
import Fastify from "fastify";

const prisma = new PrismaClient({
    log: ['query']
})


async function bootstrap() {
    const fastify = Fastify({
    })

    await fastify.register(cors, {
        origin: true
    })

    fastify.get('/tasks', async()=>{
        return await prisma.tasks.findMany()
    })

    fastify.get('/projects', async()=>{
        return await prisma.projects.findMany()
    })

    fastify.get('/users', async()=>{
        return await prisma.users.findMany()
    })

    fastify.get('/timetrackers', async()=>{
        return await prisma.timeTracker.findMany()
    })


    await fastify.listen({ port: 3333, host: '0.0.0.0' })
}


bootstrap()