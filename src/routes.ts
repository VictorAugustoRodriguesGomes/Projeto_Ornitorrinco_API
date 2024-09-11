import { Router, Request, Response } from "express";

import UserController from "./controllers/userController";
import authenticationMiddlewares from "./middlewares/authenticationMiddlewares";
import { handleUpload } from './middlewares/uploadImage';
import errorHandlerforUpload from "./middlewares/errorHandlerforUpload";

const router = Router();
const userController = UserController;

router.get('/users', userController.getAll);

router.post('/user', userController.createUser);

router.delete('/user/:id', userController.deleteUsers);

router.put('/signInWithEmailAndPassword', userController.signInWithEmailAndPassword);
router.put('/sendPasswordResetEmail', userController.sendPasswordResetEmail);

router.put('/sendVerificationCodebyEmail', userController.sendVerificationCodebyEmail);
router.put('/validateVerificationCode', userController.validateVerificationCode);


// Protected Route
router.patch('/updateUsersPassword', authenticationMiddlewares.authenticationMiddlewares, userController.updateUsersPassword);
router.patch('/updateUsersDisplayName', authenticationMiddlewares.authenticationMiddlewares, userController.updateUsersDisplayName);
router.patch('/upload', authenticationMiddlewares.authenticationMiddlewares, handleUpload, userController.upload, errorHandlerforUpload.errorHandler);


export default router;