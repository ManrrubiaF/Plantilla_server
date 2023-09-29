"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookingRoutes_1 = __importDefault(require("./bookingRoutes"));
const userRoutes_1 = __importDefault(require("./userRoutes"));
const dataRoutes_1 = __importDefault(require("./dataRoutes"));
const productRoutes_1 = __importDefault(require("./productRoutes"));
const routerr = (0, express_1.Router)();
routerr.use('/booking', bookingRoutes_1.default);
routerr.use('/user', userRoutes_1.default);
routerr.use('/data', dataRoutes_1.default);
routerr.use('/product', productRoutes_1.default);
exports.default = routerr;
