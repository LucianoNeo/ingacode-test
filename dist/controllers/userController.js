"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCollaborators = exports.createCollaborator = exports.checkUsers = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient({
// log: ['query']
});
async function createUser(username, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.users.create({
        data: {
            username,
            password: hashedPassword
        }
    });
    return user;
}
exports.createUser = createUser;
async function checkUsers() {
    const users = await prisma.users.findMany();
    if (users.length == 0) {
        createUser('luciano', process.env.USER_PASSWORD);
        console.log('Criando usuario: luciano');
        createUser('henrique', process.env.USER_PASSWORD);
        console.log('Criando usuario: henrique');
        createUser('erica', process.env.USER_PASSWORD);
        console.log('Criando usuario: erica');
    }
    else {
        console.log('Users já existentes');
    }
}
exports.checkUsers = checkUsers;
async function createCollaborator(name, userId) {
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
exports.createCollaborator = createCollaborator;
async function checkCollaborators() {
    const users = await prisma.users.findMany();
    const collaborators = await prisma.collaborators.findMany();
    if (collaborators.length == 0) {
        for (const index in users) {
            createCollaborator(users[index].username, users[index].id);
            console.log('Criando colaborador:' + users[index].username);
        }
    }
    else {
        console.log('Colaboradores já existentes');
    }
}
exports.checkCollaborators = checkCollaborators;
