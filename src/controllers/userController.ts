import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';


const prisma = new PrismaClient({
    // log: ['query']
})


export async function createUser(username: string, password: any) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.users.create({
        data: {
            username,
            password: hashedPassword
        }
    });
    return user;
}

export async function checkUsers() {
    const users = await prisma.users.findMany()
    if (users.length == 0) {
        createUser('luciano', process.env.USER_PASSWORD)
        console.log('Criando usuario: luciano')
        createUser('henrique', process.env.USER_PASSWORD)
        console.log('Criando usuario: henrique')
        createUser('erica', process.env.USER_PASSWORD)
        console.log('Criando usuario: erica')
    } else {
        console.log('Users já existentes')
    }
}

export async function createCollaborator(name: string, userId: string) {
    const collaborator = await prisma.collaborators.create({
        data: {
            name,
            user: {
                connect: {
                    id: userId
                }
            }
        }
    });
    return collaborator;
}

export async function checkCollaborators() {
    const users = await prisma.users.findMany()
    const collaborators = await prisma.collaborators.findMany()
    if (collaborators.length == 0) {
        for (const index in users) {
            createCollaborator(users[index].username, users[index].id)
            console.log('Criando colaborador:' + users[index].username)
        }
    } else {
        console.log('Colaboradores já existentes')
    }
}
