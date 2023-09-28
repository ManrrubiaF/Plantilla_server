import { Router } from "express";
import dataHandler from "../controllers/dataHandler";
import accessMiddleware from "../middleware/accessMiddleware";

const dataRouter = Router();

dataRouter.post('/new', accessMiddleware.adminValidation, dataHandler.createData);
dataRouter.get('/', dataHandler.getAllData);
dataRouter.put('/update', accessMiddleware.adminValidation,dataHandler.updateData);
dataRouter.delete('/delete/:id', accessMiddleware.adminValidation, dataHandler.deleteData);

export default dataRouter;
