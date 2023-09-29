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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../lib/config"));
const jwt_secret = config_1.default.JWT_SECRET || '';
const companyEmail = config_1.default.COMPANY_EMAIL || '';
const companyPass = config_1.default.COMPANY_PASS || '';
const back_url = config_1.default.BACK_URL || '';
const frontUrl = config_1.default.FRONT_URL || '';
const host_mail = config_1.default.HOST_MAIL || '';
const transporter = nodemailer_1.default.createTransport({
    host: host_mail,
    port: 465,
    secure: true,
    auth: {
        user: companyEmail,
        pass: companyPass,
    },
});
const expirationDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, pass, name, lastName, phone, access } = req.body;
    try {
        const exist = yield db_1.User.findOne({
            where: {
                email: email,
            },
            raw: true
        });
        if (exist) {
            res.status(400).send('Usuario existente');
        }
        const hashed = yield bcrypt_1.default.hash(pass, 5);
        const newUser = yield db_1.User.create({
            email,
            pass: hashed,
            name,
            lastName,
            phone,
            access,
        });
        const payload = {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            lastName: newUser.lastName,
            phone: newUser.phone,
            access: newUser.access
        };
        const token = jwt.sign(payload, jwt_secret, { expiresIn: "24h" });
        res.cookie("token", token, {
            expires: expirationDate
        });
        res.send('Bienvenid@');
    }
    catch (error) {
        res.status(500).json({ error: 'Error de servidor' });
    }
});
const recoverypass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const userExist = yield db_1.User.findOne({
            where: {
                email: email
            }
        });
        if (userExist) {
            const token = jwt.sign({ id: userExist.id, email: userExist.email }, jwt_secret, { expiresIn: '1h' });
            const recoveryUrl = `${back_url}/user/${token}`;
            yield transporter.sendMail({
                from: `"Empresa"  <${companyEmail}>`,
                to: userExist.email,
                subject: "CONFIRME SU CUENTA",
                html: `Siga el siguiente link para restablecer su contraseña  ${recoveryUrl}`
            });
            res.status(200).send('Link de recuperación enviado, revisa tu casilla de correo');
        }
        else {
            res.status(400).send('No hay usuarios con ese email');
        }
    }
    catch (error) {
        res.status(400).send('server error');
    }
});
const mailValidation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.params.token;
    try {
        const decodedToken = jwt.verify(token, jwt_secret);
        let user = null;
        if (decodedToken) {
            user = yield db_1.User.findOne({
                where: {
                    email: decodedToken.email
                }
            });
        }
        if (user) {
            const newToken = jwt.sign({ id: user.id, email: user.email }, jwt_secret, { expiresIn: '24h' });
            const recoveryPage = `${frontUrl}/recovery`;
            res.cookie('token', newToken, {
                expires: expirationDate
            }).redirect(`${recoveryPage}`);
        }
        else {
            res.status(400).send('Link vencido');
        }
    }
    catch (error) {
        res.status(500).send('server error');
    }
});
const changePass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pass } = req.body;
    const { id } = res.locals.userData;
    try {
        const user = yield db_1.User.findByPk(id);
        if (user) {
            const newPass = yield bcrypt_1.default.hash(pass, 5);
            yield user.update({
                pass: newPass
            });
            res.status(200).send('Contraseña cambiada');
        }
        else {
            res.status(400).send('Email no encontrado');
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
});
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    try {
        const userExist = yield db_1.User.findOne({
            where: {
                email: data.email
            }
        });
        const hashed = yield bcrypt_1.default.hash(data.pass, 5);
        if (!userExist) {
            res.status(404).send('Email no registrado');
        }
        if (userExist && userExist.pass !== hashed) {
            res.status(400).send('Contraseña incorrecta');
        }
        else {
            const payload = {
                id: userExist === null || userExist === void 0 ? void 0 : userExist.id,
                email: userExist === null || userExist === void 0 ? void 0 : userExist.email,
                name: userExist === null || userExist === void 0 ? void 0 : userExist.name,
                lastName: userExist === null || userExist === void 0 ? void 0 : userExist.lastName,
                phone: userExist === null || userExist === void 0 ? void 0 : userExist.phone,
                access: userExist === null || userExist === void 0 ? void 0 : userExist.access
            };
            const token = jwt.sign(payload, jwt_secret, { expiresIn: '24h' });
            res.cookie('token', token, { expires: expirationDate });
            res.send('Bienvenid@');
        }
    }
    catch (error) {
    }
});
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = res.locals.userData;
    try {
        const userExist = yield db_1.User.findByPk(id);
        if (userExist) {
            yield db_1.User.destroy({
                where: {
                    id: userExist.id
                }
            });
            res.status(200).send('Su cuenta se eleminará en 7 dias'); //setear cronjob
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
});
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = res.locals.userData;
    const data = req.body;
    try {
        const userData = yield db_1.User.findByPk(id);
        yield (userData === null || userData === void 0 ? void 0 : userData.update(data));
        res.status(200).send('Datos actualizados');
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.default = {
    createUser,
    recoverypass,
    mailValidation,
    changePass,
    deleteUser,
    loginUser,
    updateUser,
};
