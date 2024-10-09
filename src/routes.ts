import { Router, Request, Response } from "express";

import UserController from "./controllers/userController";
import authenticationMiddlewares from "./middlewares/authenticationMiddlewares";
import { handleUpload } from './middlewares/uploadImage';
import errorHandlerforUpload from "./middlewares/errorHandlerforUpload";

const router = Router();
const userController = UserController;

router.get('/users', userController.getAll);

router.post('/user/createUser', userController.createUser);

router.put('/user/signInWithEmailAndPassword', userController.signInWithEmailAndPassword);
router.put('/user/sendPasswordResetEmail', userController.sendPasswordResetEmail);

router.put('/user/validateVerificationCode', userController.validateVerificationCode);

// Protected Route
router.get('/user/profile', authenticationMiddlewares.authenticationMiddlewares, userController.userProfile);

router.patch('/user/profile/updateUsersPassword', authenticationMiddlewares.authenticationMiddlewares, userController.updateUsersPassword);
router.patch('/user/profile/updateUsersDisplayName', authenticationMiddlewares.authenticationMiddlewares, userController.updateUsersDisplayName);

router.patch('/user/profile/updateUsersPhoto', authenticationMiddlewares.authenticationMiddlewares, handleUpload, userController.upload, errorHandlerforUpload.errorHandler);

router.delete('/user/profile/deleteUsers', authenticationMiddlewares.authenticationMiddlewares, userController.deleteUsers);

export default router;