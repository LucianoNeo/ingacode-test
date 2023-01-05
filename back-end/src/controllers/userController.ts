import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';


const prisma = new PrismaClient({
    // log: ['query']
})


export async function createUser(username: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.users.create({
        data: {
            username,
            password: hashedPassword
        }
    });
    return user;
}

// createUser('luciano','minhaSenha')
// createUser('henrique','minhaSenha')
// createUser('erica','minhaSenha')

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

// createCollaborator('luciano','cc0b213b-69f6-4417-9048-df4be1a29843')
// createCollaborator('henrique','2a2c3a98-4da9-44b8-9cdc-71abdee62ab8')
// createCollaborator('erica','94f1df5a-5165-4691-8ec5-3a635f631e2e')

export async function login(username: string, password: string) {
    const user = await prisma.users.findUnique({
        where: {
            username
        }
    });
    if (!user) {
        throw new Error('Usuário ou Senha inválida');
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (isValidPassword) {
        return user;
    } else {
        throw new Error('Usuário ou Senha inválida');
    }
}