import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import userModel from "./userModel";
import Connection from "./connection";
import userServices from "../services/userServices";

import  { User }  from "../interfaces/User";
import { ResponseReq } from "../interfaces/ResponseReq";

const connection = Connection;

const signInWithEmailAndPassword = async (user: User) => {

    const { email, password } = user;
    const [users]: User[] = await userModel.getEmail(email) as User[];

    if (!users) {
        const response: ResponseReq = {
            code: 404,
            status: 'error',
            text: 'The "email" entered is non-existent'
        };

        return response;
    }

    if (await bcrypt.compare(password ?? '', users.password ?? '0')) {

        const userResponse: User = {
            uid: users.uid,
            displayName: users.displayName,
            email: users.email,
            photo: users.photo,
            emailVerification: users.emailVerification,
        }
        
        const sendEmail = await sendVerificationCodebyEmail(userResponse, 'Código de segurança para acessar sua conta: ')

        if(sendEmail.code != 200){
            const response: ResponseReq = {
                code: 404,
                status: 'error',
                text: 'The "email" entered is non-existent'
            };
            return response;
        }

        const response: ResponseReq = {
            code: 200,
            status: 'success',
            text: 'Login successful / verification email sent',
            user: userResponse
        };

        return response;
    }

    const response: ResponseReq = {
        code: 404,
        status: 'error',
        text: 'The "password" entered is non-existent'
    };

    return response;
};

const sendPasswordResetEmail = async (user: User) => {

    const { email } = user;
    const [users]: User[] = await userModel.getEmail(email) as User[];

    if (!users) {
        const response: ResponseReq = {
            code: 404,
            status: 'error',
            text: 'The "email" entered is non-existent'
        };
        return response;
    }

    const userResponse: User = {
        uid: users.uid,
        displayName: users.displayName,
        email: users.email,
        photo: users.photo,
        emailVerification: users.emailVerification,
    }
    
    const sendEmail = await sendVerificationCodebyEmail(userResponse, 'Código para redefinir sua senha: ')

    if(sendEmail.code != 200){
        const response: ResponseReq = {
            code: 404,
            status: 'error',
            text: 'The "email" entered is non-existent'
        };
        return response;
    }
    const response: ResponseReq = {
        code: 200,
        status: 'success',
        text: 'email to change password sent',
        user: userResponse
    };

    return response;
};

const sendVerificationCodebyEmail = async (user: User, message: string) => {

    const { email } = user;
    const [users]: User[] = await userModel.getEmail(email) as User[];

    if (!users) {
        const response: ResponseReq = {
            code: 404,
            status: 'error',
            text: 'The "email" entered is non-existent'
        };

        return response;
    }

    const code: string = await userServices.createCodeVerifyEmail();
    const expiresAt = Date.now() + 10 * 60 * 1000;
    const hashCode = await bcrypt.hash(code, 10);

    const updateUsers = await userModel.updateUsersCodeVerification(users.uid, hashCode + '---' + expiresAt);
    const emailVerification = await userServices.sendEmailVerification(users.displayName, users.email, message, code);

    const response: ResponseReq = {
        code: 200,
        status: 'success',
        text: 'verification email sent'
    };

    return response;

};

const validateVerificationCode = async (user: User) => {

    const { uid, codeVerification } = user;
    const [users]: User[] = await userModel.getUID(uid) as User[];

    if (!users) {
        const response: ResponseReq = {
            code: 404,
            status: 'error',
            text: 'The "email" entered is non-existent'
        };
        return response;
    }

    const code: string = codeVerification ?? '';
    const usersCode = users.codeVerification?.split('---')[0] ?? '';
    const usersDate = Number(users.codeVerification?.split('---')[1]) ?? 0;

    if (Date.now() <= usersDate && await bcrypt.compare(code, usersCode)) {

        const updateUsers = await userModel.updateUsersCodeVerification(users.uid, null);

        const usersEmailVerification: boolean = Boolean(users.emailVerification);

        if (usersEmailVerification != true) {
            const updateEmailVerification = await userModel.updateUsersEmailVerification(users.uid, true);
        }

        const token = jwt.sign({ uid: users.uid }, process.env.JWT_PASS || '', { expiresIn: '100h' });

        const userResponse: User = {
            uid: users.uid,
            displayName: users.displayName,
            email: users.email,
            photo: users.photo,
            emailVerification: users.emailVerification,
        }

        const response: ResponseReq = {
            code: 200,
            status: 'success',
            text: 'The "code" provided is correct',
            user: userResponse,
            token: token
        };

        return response;
    }

    const response: ResponseReq = {
        code: 409,
        status: 'error',
        text: 'The "code" entered has expired or is invalid'
    };

    return response;
}

export default { 
    sendPasswordResetEmail,
    validateVerificationCode,
    signInWithEmailAndPassword, 
    sendVerificationCodebyEmail
}