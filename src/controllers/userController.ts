import { Request, Response } from "express";
import userModel from "../models/userModel";
import authenticationModel from "../models/authenticationModel";


import { User } from "../interfaces/User";
import { ResponseReq } from "../interfaces/ResponseReq";
import multer from "multer";


const getAll = async (_req: Request, res: Response) => {
    const user = await userModel.getAll();
    return res.status(200).json(user);
}

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
    const { id } = req.params;

    const deleteUsers = await userModel.deleteUsers(id);
    return res.status(201).json(deleteUsers);
};

const signInWithEmailAndPassword = async (req: Request, res: Response) => {
    const signInWithEmailAndPassword = await authenticationModel.signInWithEmailAndPassword(req.body);
    return res.status(signInWithEmailAndPassword.code).json(signInWithEmailAndPassword);
};

const sendVerificationCodebyEmail = async (req: Request, res: Response) => {
    const sendVerificationCodebyEmail = await authenticationModel.sendVerificationCodebyEmail(req.body);
    return res.status(sendVerificationCodebyEmail.code).json(sendVerificationCodebyEmail);
};

const validateVerificationCode = async (req: Request, res: Response) => {
    const validateVerificationCode = await authenticationModel.validateVerificationCode(req.body);
    return res.status(validateVerificationCode.code).json(validateVerificationCode);
};


const upload = async (req: Request, res: Response) => {
    const response: ResponseReq = {
        code: 200,
        status: 'success',
        text: 'Image uploaded successfully',
    };

    if (!req.file) {
        response.code = 400;
        response.status = 'error';
        response.text = 'Image upload failed';
        return res.status(response.code).json(response);
    }
    const fileUrl = `${req.protocol}://${req.get('host')}/public/uploads/profile/${req.file.filename}`;

    response.text = response.text + ' ' + fileUrl;
    return res.status(response.code).json(response);
};


const sendPasswordResetEmail = async (req: Request, res: Response) => {
    const sendPasswordResetEmail = await authenticationModel.sendPasswordResetEmail(req.body);
    return res.status(sendPasswordResetEmail.code).json(sendPasswordResetEmail);
};

export default {
    getAll,
    createUser,
    updateUsersDisplayName,
    deleteUsers,
    updateUsersPassword,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    sendVerificationCodebyEmail,
    validateVerificationCode,
    upload
};