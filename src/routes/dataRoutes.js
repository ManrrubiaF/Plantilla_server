"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dataHandler_1 = __importDefault(require("../controllers/dataHandler"));
const accessMiddleware_1 = __importDefault(require("../middleware/accessMiddleware"));
const dataRouter = (0, express_1.Router)();
dataRouter.post('/new', accessMiddleware_1.default.adminValidation, dataHandler_1.default.createData);
dataRouter.get('/', dataHandler_1.default.getAllData);
dataRouter.put('/update', accessMiddleware_1.default.adminValidation, dataHandler_1.default.updateData);
dataRouter.delete('/delete/:id', accessMiddleware_1.default.adminValidation, dataHandler_1.default.deleteData);
exports.default = dataRouter;
