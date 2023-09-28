import productHandler from "../controllers/productHandler";
import accessMiddleware from "../middleware/accessMiddleware";
import { Router } from "express";

const productRouter = Router();

productRouter.post('/create', accessMiddleware.adminValidation, productHandler.createProduct);
productRouter.get('/', productHandler.getAllProducts);
productRouter.put('/update/:id', accessMiddleware.adminValidation, productHandler.updateProduct);
productRouter.delete('/delete/:id', accessMiddleware.adminValidation, productHandler.deleteProduct);

export default productRouter;