import bcrypt from "bcrypt";

import Connection from "./connection";

import userServices from "../services/userServices";

import userModel from "./userModel";
import jwt from "jsonwebtoken";

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
        // const token = jwt.sign({ uid: users[index].uid }, 'secret', { expiresIn: '1h' });

        const token = jwt.sign({ uid: users.uid }, process.env.JWT_PASS || '', { expiresIn: '100h' });

        const userResponse: User = {
            uid: users.uid,
            displayName: users.displayName,
            email: users.email,
            password: '"password" not available',
            photo: users.photo,
            emailVerification: users.emailVerification,
        }

        const response: ResponseReq = {
            code: 200,
            status: 'success',
            text: 'Login successful',
            user: userResponse,
            token: token
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

const sendVerificationCodebyEmail = async (user: User) => {

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

    const message: string = "Código para verificar seu endereço de e-mail: ";

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

    const { email, codeVerification } = user;
    const [users]: User[] = await userModel.getEmail(email) as User[];

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
            password: '"password" not available',
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
        code: 404,
        status: 'error',
        text: 'The "code" entered has expired or is invalid'
    };

    return response;
}

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

    const code: string = await userServices.createCodeVerifyEmail();
    const expiresAt = Date.now() + 10 * 60 * 1000;
    const hashCode = await bcrypt.hash(code, 10);
    
    const message: string = "Código para redefinir sua senha: ";
    
    const updateUsers = await userModel.updateUsersCodeVerification(users.uid, hashCode + '---' + expiresAt);
    const emailVerification = await userServices.sendEmailVerification(users.displayName, users.email, message, code);

    const response: ResponseReq = {
        code: 200,
        status: 'success',
        text: 'email to change password sent'
    };

    return response;
};





// const updateEmailVerification = async (uid, user) => {

//     const [users] = await connection.execute('SELECT * FROM users WHERE uid = ?', [uid]);

//     let emailVerificationUser = user.emailVerification;
//     const { email, password, emailVerification, displayName, photo } = users[0];

//     if (emailVerificationUser === undefined) emailVerificationUser = emailVerification;

//     const query = 'UPDATE users SET uid = ?, displayName = ?, email = ?, password = ?, photo = ?, emailVerification = ? WHERE uid = ?';

//     const [updatedUsers] = await connection.execute(query, [uid, displayName, email, password, photo, emailVerificationUser, uid]);

//     return {
//         status: 'success',
//         text: 'user updated with successful email verification',
//         updatedUsers: updatedUsers
//     };
// };

// const updatePassword = async (uid, user) => {

//     const [users] = await connection.execute('SELECT * FROM users WHERE uid = ?', [uid]);

//     let passwordUser = user.password;
//     const { email, password, emailVerification, displayName, photo } = users[0];

//     if (passwordUser === undefined) passwordUser = password;

//     const query = 'UPDATE users SET uid = ?, displayName = ?, email = ?, password = ?, photo = ?, emailVerification = ? WHERE uid = ?';

//     const [updatedUsers] = await connection.execute(query, [uid, displayName, email, passwordUser, photo, emailVerification, uid]);

//     return {
//         status: 'success',
//         text: 'user password updated successfully',
//         email: email,
//         updatedUsers: updatedUsers
//     };
// };






export default { signInWithEmailAndPassword, sendVerificationCodebyEmail, validateVerificationCode, sendPasswordResetEmail }