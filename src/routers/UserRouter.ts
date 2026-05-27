import express from 'express';
import { uploadMiddleware } from '../middlewares/uploadMiddleware';
import { UserController } from '../usecases/admin/users/controller/UserController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { GetProfileController } from '../usecases/profiles/get/controller/GetProfileController';
import { UpdateProfileController } from '../usecases/profiles/update/controller/UpdateProfileController';

const userController = new UserController();
const getProfileController = new GetProfileController();
const updateProfileController = new UpdateProfileController();

const UserRouter = express.Router();



// GET /api/v1/users/:id
UserRouter.get('/users/:id', userController.find.bind(userController));

// GET /api/v1/me - Recupera perfil do usuário logado
UserRouter.get('/me', authMiddleware, getProfileController.handle.bind(getProfileController));

// PUT /api/v1/me - Atualiza perfil do usuário logado
UserRouter.put('/me', authMiddleware, updateProfileController.handle.bind(updateProfileController));

// POST /api/v1/me/avatar - Upload de avatar
UserRouter.post('/me/avatar', authMiddleware, uploadMiddleware.single('avatar'), updateProfileController.updateAvatar.bind(updateProfileController));

// PATCH /api/v1/me/settings - Atualiza configs JSON do usuario
UserRouter.patch('/me/settings', authMiddleware, userController.updateSettings.bind(userController));

export default UserRouter;
