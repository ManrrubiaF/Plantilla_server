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
const axios_1 = __importDefault(require("axios"));
const db_1 = require("../db");
function firstload() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios_1.default.get('http://localhost:5000/products');
        const products = response.data;
        try {
            for (const product of products) {
                const { price, name, description, active, category, details } = product;
                const productCreated = yield db_1.Product.create({
                    price,
                    name,
                    description,
                    active,
                    category
                });
                for (const oneDetail of details) {
                    yield db_1.ProductDetail.create({
                        color: oneDetail.color,
                        stock: oneDetail.stock,
                        image: oneDetail.image,
                        productId: productCreated.id
                    });
                }
            }
            console.log("Data embedded successfully");
        }
        catch (error) {
            console.error('failed to load api', error);
        }
    });
}
exports.default = firstload;
