"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const productHandler_1 = __importDefault(require("../controllers/productHandler"));
const accessMiddleware_1 = __importDefault(require("../middleware/accessMiddleware"));
const express_1 = require("express");
const productRouter = (0, express_1.Router)();
productRouter.post('/create', accessMiddleware_1.default.adminValidation, productHandler_1.default.createProduct);
productRouter.get('/active', productHandler_1.default.getActiveProducts);
productRouter.put('/update/:id', accessMiddleware_1.default.adminValidation, productHandler_1.default.updateProduct);
productRouter.delete('/delete/:id', accessMiddleware_1.default.adminValidation, productHandler_1.default.deleteProduct);
productRouter.get('/:id', productHandler_1.default.getProductById);
productRouter.get('/', accessMiddleware_1.default.adminValidation, productHandler_1.default.getAllProducts);
exports.default = productRouter;
