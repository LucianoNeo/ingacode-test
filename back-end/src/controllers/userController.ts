import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';


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

// createUser('luciano', 'minhaSenha')
// createUser('henrique', 'minhaSenha')
// createUser('erica', 'minhaSenha')

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

createCollaborator('luciano', '4a67dbb2-68ec-42e5-9924-cb6469f9e431')
createCollaborator('henrique', '3ecc6333-8e31-4075-a509-1eba16b9cc5b')
createCollaborator('erica', 'd3024927-333b-4b85-a818-6e9e00e15b12')

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