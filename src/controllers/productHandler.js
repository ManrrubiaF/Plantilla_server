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
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db");
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const oneProduct = req.body;
    try {
        const productExist = yield db_1.Product.findOne({
            where: {
                name: oneProduct.name
            }
        });
        if (!productExist) {
            const productCreated = yield db_1.Product.create({
                price: oneProduct.price,
                name: oneProduct.name,
                description: oneProduct.description,
                active: oneProduct.active,
                category: oneProduct.category,
            });
            for (const oneColor of oneProduct.details) {
                yield db_1.ProductDetail.create({
                    color: oneColor.color,
                    stock: oneColor.stock,
                    image: oneColor.image,
                    productId: productCreated.id
                });
            }
            res.status(201).send('Producto añadido');
        }
        else {
            res.status(400).send('Producto existente, revisa el stock');
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
});
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const { id } = req.params;
    try {
        const productExist = yield db_1.Product.findOne({
            where: {
                id: id
            },
            include: db_1.ProductDetail
        });
        if (productExist) {
            const updateData = {};
            for (const key in data) {
                if (key === 'details' && Array.isArray(data[key])) {
                    const details = data[key];
                    for (const detail of details) {
                        const existingDetail = yield db_1.ProductDetail.findOne({
                            where: {
                                productId: productExist.id,
                                color: detail.color
                            }
                        });
                        if (existingDetail) {
                            yield existingDetail.update(detail);
                        }
                        else {
                            yield db_1.ProductDetail.create(Object.assign(Object.assign({}, detail), { productId: productExist.id }));
                        }
                    }
                }
                else {
                    updateData[key] = data[key];
                }
            }
            yield productExist.update(updateData);
            res.status(200).send('Producto actualizado');
        }
        else {
            res.status(404).send('Hubo un error al encontrar el producto');
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
});
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const productExist = yield db_1.Product.findByPk(id);
        if (productExist) {
            yield productExist.destroy();
            res.status(200).send('El producto se eliminará en 7 dias'); //setear cronjob
        }
        else {
            res.status(404).send('Hubo un error al buscar el producto');
        }
    }
    catch (error) {
        res.status(500).send('server error');
    }
});
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield db_1.Product.findAll({
            include: db_1.ProductDetail
        });
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json(error);
    }
});
const getActiveProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const activeProducts = yield db_1.Product.findAll({
            where: {
                active: true
            },
            include: db_1.ProductDetail
        });
        res.status(200).json(activeProducts);
    }
    catch (error) {
        res.status(500).json(error);
    }
});
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const product = yield db_1.Product.findOne({
            where: {
                id: id,
            },
            include: db_1.ProductDetail
        });
        if (product) {
            res.status(200).json(product);
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.default = {
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    getActiveProducts
};
