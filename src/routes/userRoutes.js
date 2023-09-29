"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userHandler_1 = __importDefault(require("../controllers/userHandler"));
const accessMiddleware_1 = __importDefault(require("../middleware/accessMiddleware"));
const userRouter = (0, express_1.Router)();
userRouter.post('/create', userHandler_1.default.createUser);
userRouter.post('/recover', userHandler_1.default.recoverypass);
userRouter.get('/validation', userHandler_1.default.mailValidation);
userRouter.post('/change', accessMiddleware_1.default.accessValidation, userHandler_1.default.changePass);
userRouter.delete('/delete', accessMiddleware_1.default.accessValidation, userHandler_1.default.deleteUser);
userRouter.post('/login', userHandler_1.default.loginUser);
userRouter.put('/update', accessMiddleware_1.default.accessValidation, userHandler_1.default.updateUser);
exports.default = userRouter;
