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
const createData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const oneData = req.body;
    try {
        yield db_1.Data.create(oneData);
        res.status(201).send('Datos empresariales cargados');
    }
    catch (error) {
        res.status(500).json(error);
    }
});
const updateData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    try {
        const dataExist = yield db_1.Data.findOne({ where: { id: id } });
        if (dataExist) {
            yield dataExist.update(req.body);
            res.status(200).send('Datos actualizados');
        }
        else {
            res.status(404).send('Ha habido un error, por favor intenta de nuevo');
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
});
const deleteData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const dataExist = yield db_1.Data.findByPk(id);
        if (dataExist) {
            yield dataExist.destroy();
            res.status(200).send('Los datos de la empresa han sido borrados');
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
});
const getAllData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield db_1.Data.findAll();
        res.status(200).json(data);
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.default = {
    getAllData,
    createData,
    updateData,
    deleteData,
};
