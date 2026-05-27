import express from 'express';
import LoginController from '../usecases/auth/login/controller/LoginController';
import { VerifyTokenController } from '../usecases/auth/verify-token/controller/VerifyTokenController';
import ChangePasswordController from '../usecases/auth/password/controller/ChangePasswordController';

const loginController = new LoginController();
const changePasswordController = new ChangePasswordController();
const verifyTokenController = new VerifyTokenController();

const AuthRouter = express.Router();

AuthRouter.post('/login', loginController.login.bind(loginController));
AuthRouter.patch('/change-password', changePasswordController.change.bind(changePasswordController));
AuthRouter.get('/verify-token', verifyTokenController.handle.bind(verifyTokenController));

export default AuthRouter;
