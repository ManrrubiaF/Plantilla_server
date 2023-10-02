import { Router } from "express";
import userHandlers from '../controllers/userHandler';
import accessMiddleware from '../middleware/accessMiddleware'

const userRouter = Router()

userRouter.post('/create', userHandlers.createUser);
userRouter.post('/recover', userHandlers.recoverypass);
userRouter.get('/validation', userHandlers.mailValidation);
userRouter.post('/change', accessMiddleware.accessValidation, userHandlers.changePass );
userRouter.delete('/delete', accessMiddleware.accessValidation, userHandlers.deleteUser);
userRouter.post('/login', userHandlers.loginUser);
userRouter.put('/update', accessMiddleware.accessValidation, userHandlers.updateUser);
userRouter.post('/logout', userHandlers.logout);
export default userRouter;