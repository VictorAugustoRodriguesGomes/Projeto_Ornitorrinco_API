import { User } from './../interfaces/User';
import { Request, Response } from "express";
import userModel from "../models/userModel";
import authenticationModel from "../models/authenticationModel";

import { ResponseReq } from "../interfaces/ResponseReq";
import multer from "multer";

const getAll = async (_req: Request, res: Response) => {
    const user = await userModel.getAll();
    return res.status(200).json(user);
}

const userProfile = async (req: Request, res: Response) => {
    const userResponse: User = {
        uid: req.user.uid,
        displayName: req.user.displayName,
        email: req.user.email,
        photo: req.user.photo,
        emailVerification: req.user.emailVerification,
    }

    const response: ResponseReq = {
        code: 201,
        status: 'success',
        text: 'Success in searching for user profile',
        user: userResponse
    };
    
    return res.status(response.code).json(response);
};

const createUser = async (req: Request, res: Response) => {
    const createUser: ResponseReq = await userModel.createUser(req.body);
    return res.status(createUser.code).json(createUser);
};

const updateUsersDisplayName = async (req: Request, res: Response) => {
    const updateUsersDisplayName = await userModel.updateUsersDisplayName(req.user.uid, req.body);
    return res.status(updateUsersDisplayName.code).json(updateUsersDisplayName);
};

const updateUsersPassword = async (req: Request, res: Response) => {
    const updateUsersPassword: ResponseReq = await userModel.updateUsersPassword(req.user.uid, req.body);
    return res.status(updateUsersPassword.code).json(updateUsersPassword);
};

const deleteUsers = async (req: Request, res: Response) => {
    const deleteUsers = await userModel.deleteUsers(req.user.uid);
    return res.status(deleteUsers.code).json(deleteUsers);
};

const signInWithEmailAndPassword = async (req: Request, res: Response) => {
    const signInWithEmailAndPassword = await authenticationModel.signInWithEmailAndPassword(req.body);
    return res.status(signInWithEmailAndPassword.code).json(signInWithEmailAndPassword);
};

const sendPasswordResetEmail = async (req: Request, res: Response) => {
    const sendPasswordResetEmail = await authenticationModel.sendPasswordResetEmail(req.body);
    return res.status(sendPasswordResetEmail.code).json(sendPasswordResetEmail);
};

const validateVerificationCode = async (req: Request, res: Response) => {
    const validateVerificationCode = await authenticationModel.validateVerificationCode(req.body);
    return res.status(validateVerificationCode.code).json(validateVerificationCode);
};

const upload = async (req: Request, res: Response) => {
    
    if (!req.file) {
        const response: ResponseReq = {
            code: 400,
            status: 'error',
            text: 'Image upload failed',
        };
        return res.status(response.code).json(response);
    }

    const updateUsersPhoto = await userModel.updateUsersPhoto(req.user.uid, `/public/uploads/profile/${req.file.filename}`);
    updateUsersPhoto.text = updateUsersPhoto.text + ` ${req.protocol}://${req.get('host')}/public/uploads/profile/${req.file.filename}`;
    return res.status(updateUsersPhoto.code).json(updateUsersPhoto);
};

export default {
    getAll,
    upload,
    createUser,
    deleteUsers,
    userProfile,
    updateUsersPassword,
    sendPasswordResetEmail,
    updateUsersDisplayName,
    validateVerificationCode,
    signInWithEmailAndPassword
};