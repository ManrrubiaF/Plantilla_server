"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    JWT_SECRET: process.env.JWT_SECRET || '',
    DB_USER: process.env.DB_USER || '',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_HOST: process.env.DB_HOST || '',
    DB_NAME: process.env.DB_NAME || '',
    HOST_MAIL: process.env.HOST_MAIL || '',
    COMPANY_EMAIL: process.env.COMPANY_EMAIL || '',
    COMPANY_PASS: process.env.COMPANY_PASS || '',
    BACK_URL: process.env.BACK_URL || '',
    FRONT_URL: process.env.FRONT_URL || '',
};
exports.default = config;
