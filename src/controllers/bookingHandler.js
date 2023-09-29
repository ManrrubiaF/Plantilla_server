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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db");
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../lib/config"));
const companyEmail = config_1.default.COMPANY_EMAIL || '';
const companyPass = config_1.default.COMPANY_PASS || '';
const host_email = config_1.default.HOST_MAIL || '';
const transporter = nodemailer_1.default.createTransport({
    host: `${host_email}`,
    port: 465,
    secure: true,
    auth: {
        user: companyEmail,
        pass: companyPass,
    },
});
const discountStock = (dataProducts) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        for (const details of dataProducts.details) {
            const product = yield db_1.ProductDetail.findOne({
                where: {
                    productId: details.productId,
                    color: details.color
                }
            });
            if (product) {
                product.stock -= details.stock;
                yield product.save();
            }
        }
        return ('updated');
    }
    catch (error) {
        return error;
    }
});
const increaseProduct = (bookingExist) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        for (const details of bookingExist.details) {
            const product = yield db_1.ProductDetail.findOne({
                where: {
                    productId: details.productId,
                    color: details.color
                }
            });
            if (product) {
                product.stock += details.stock;
                yield product.save();
            }
        }
        return ('updated');
    }
    catch (error) {
    }
});
const createBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dataProducts = req.body;
    const { id } = res.locals.userData;
    try {
        let enoughStock = true;
        const details = dataProducts.details;
        for (const product of details) {
            const productExist = yield db_1.Product.findOne({
                where: {
                    id: product.productId
                },
                include: db_1.ProductDetail
            });
            const detailsProduct = productExist === null || productExist === void 0 ? void 0 : productExist.details;
            let index = 0;
            if (detailsProduct) {
                while (enoughStock && index < detailsProduct.length) {
                    if (product.color === detailsProduct[index].color && detailsProduct[index].stock < product.stock) {
                        enoughStock = false;
                    }
                    index++;
                }
            }
        }
        if (enoughStock) {
            yield db_1.Booking.create({
                userId: id,
                details: details,
            });
            const user = yield db_1.User.findByPk(id);
            yield transporter.sendMail({
                from: `${companyEmail}`,
                to: `${user === null || user === void 0 ? void 0 : user.email}`,
                subject: 'Confirmaciòn de reserva',
                html: 'Gracias por comprar en esta empresa, su reserva ha sido guardada.'
            });
            yield discountStock(dataProducts);
            res.status(201).send('Reserva/Compra creada');
        }
        else {
            res.status(400).send('Lo sentimos,no hay suficiente stock');
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
});
const deleteBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dataProduct = req.body;
    const { id } = res.locals.userData;
    try {
        const bookingExist = yield db_1.Booking.findOne({
            where: {
                id: dataProduct.id,
                userId: id
            }
        });
        if (!bookingExist) {
            res.status(404).send('Reserva/Compra no encontrada');
        }
        else {
            yield increaseProduct(bookingExist);
            yield (bookingExist === null || bookingExist === void 0 ? void 0 : bookingExist.destroy({ force: true }));
            res.status(200).send('Su reserva/compra ha sido cancelada');
        }
    }
    catch (error) {
        res.status(500).send('Server error');
    }
});
const getByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = res.locals.userData;
    try {
        const bookingByUser = yield db_1.Booking.findAll({
            where: {
                userId: id
            }
        });
        if (bookingByUser) {
            res.status(200).json(bookingByUser);
        }
        else {
            res.status(400).send('No se hicieron reservas o compras aún');
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
});
const getAllBookig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allBooking = yield db_1.Booking.findAll();
        if (allBooking) {
            res.status(200).json(allBooking);
        }
        else {
            res.status(404).send('No te han reservado/comprado aún');
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.default = {
    createBooking,
    deleteBooking,
    getByUser,
    getAllBookig,
};
