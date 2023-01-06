"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.login = exports.createCollaborator = exports.createUser = void 0;
var client_1 = require("@prisma/client");
var bcrypt = require("bcrypt");
var prisma = new client_1.PrismaClient({
// log: ['query']
});
function createUser(username, password) {
    return __awaiter(this, void 0, void 0, function () {
        var hashedPassword, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, bcrypt.hash(password, 10)];
                case 1:
                    hashedPassword = _a.sent();
                    return [4 /*yield*/, prisma.users.create({
                            data: {
                                username: username,
                                password: hashedPassword
                            }
                        })];
                case 2:
                    user = _a.sent();
                    return [2 /*return*/, user];
            }
        });
    });
}
exports.createUser = createUser;
// createUser('luciano', 'minhaSenha')
// createUser('henrique', 'minhaSenha')
// createUser('erica', 'minhaSenha')
function createCollaborator(name, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var collaborator;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.collaborators.create({
                        data: {
                            name: name,
                            user: {
                                connect: {
                                    id: userId
                                }
                            }
                        }
                    })];
                case 1:
                    collaborator = _a.sent();
                    return [2 /*return*/, collaborator];
            }
        });
    });
}
exports.createCollaborator = createCollaborator;
createCollaborator('luciano', '4a67dbb2-68ec-42e5-9924-cb6469f9e431');
createCollaborator('henrique', '3ecc6333-8e31-4075-a509-1eba16b9cc5b');
createCollaborator('erica', 'd3024927-333b-4b85-a818-6e9e00e15b12');
function login(username, password) {
    return __awaiter(this, void 0, void 0, function () {
        var user, isValidPassword;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.users.findUnique({
                        where: {
                            username: username
                        }
                    })];
                case 1:
                    user = _a.sent();
                    if (!user) {
                        throw new Error('Usuário ou Senha inválida');
                    }
                    return [4 /*yield*/, bcrypt.compare(password, user.password)];
                case 2:
                    isValidPassword = _a.sent();
                    if (isValidPassword) {
                        return [2 /*return*/, user];
                    }
                    else {
                        throw new Error('Usuário ou Senha inválida');
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.login = login;
