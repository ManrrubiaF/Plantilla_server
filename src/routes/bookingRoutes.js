"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookingHandler_1 = __importDefault(require("../controllers/bookingHandler"));
const accessMiddleware_1 = __importDefault(require("../middleware/accessMiddleware"));
const bookingRouter = (0, express_1.Router)();
bookingRouter.post('/create', accessMiddleware_1.default.accessValidation, bookingHandler_1.default.createBooking);
bookingRouter.delete('/delete', accessMiddleware_1.default.accessValidation, bookingHandler_1.default.deleteBooking);
bookingRouter.get('/mybooking', accessMiddleware_1.default.accessValidation, bookingHandler_1.default.getByUser);
bookingRouter.get('/allbooking', accessMiddleware_1.default.adminValidation, bookingHandler_1.default.getAllBookig);
exports.default = bookingRouter;
