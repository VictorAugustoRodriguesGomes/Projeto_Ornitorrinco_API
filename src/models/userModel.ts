import bcrypt from "bcrypt";

import Connection from "./connection";
import userServices from "../services/userServices";
import authenticationModel from "./authenticationModel";

import { User } from "../interfaces/User";
import { ResponseReq } from "../interfaces/ResponseReq";

import * as fs from 'fs';

const connection = Connection;

const getAll = async () => {
    const [users] = await connection.execute("SELECT * FROM users");
    return users;
};

const getUID = async (uid: string) => {
    const [users] = await connection.execute('SELECT * FROM users WHERE uid = ?', [uid]);
    return users;
};

const getEmail = async (email: string) => {
    const [users] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
    return users;
};

const createUser = async (user: User) => {

    const { displayName, email, password } = user;
    const [users]: User[] = await getEmail(email) as User[];

    if (users) {
        const response: ResponseReq = {
            code: 409,
            status: 'error',
            text: 'The "email" entered is invalid',
        }
        return response;
    }

    const uid: string = userServices.create_UUID();
    const emailVerification: boolean = false;
    const photoUser: string = "/public/uploads/profile/user.webp";
    const hashPassword = await bcrypt.hash(password ?? '', 10);
    const codeVerification: null = null;

    const query = "INSERT INTO users(uid, displayName, email, password, photo, emailVerification, codeVerification) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const [createUser] = await connection.execute(query, [uid, displayName, email, hashPassword, photoUser, emailVerification, codeVerification]);

    const userResponse: User = {
        uid: uid,
        displayName: displayName,
        email: email,
        photo: photoUser,
        emailVerification: emailVerification,
    }

    const sendVerificationCodebyEmail = await authenticationModel.sendVerificationCodebyEmail(userResponse, "Código para verificar seu endereço de e-mail: ");

    if (sendVerificationCodebyEmail.code != 200) {
        const response: ResponseReq = {
            code: 404,
            status: 'error',
            text: 'The "email" entered is non-existent'
        };
        return response;
    }

    const response: ResponseReq = {
        code: 201,
        status: 'success',
        text: 'user created successfully / verification email sent',
        user: userResponse
    };
    return response;
};

const updateUsersCodeVerification = async (uid: string, codeVerification: string | null) => {

    const [users]: User[] = await getUID(uid) as User[];

    if (!users) {
        const response: ResponseReq = {
            code: 404,
            status: 'error',
            text: 'The "user" does not exist'
        };
        return response;
    }

    const { email, displayName, photo, password, emailVerification } = users;

    const query = 'UPDATE users SET uid = ?, displayName = ?, email = ?, password = ?, photo = ?, emailVerification = ?, codeVerification = ? WHERE uid = ?';

    const [updatedUsers] = await connection.execute(query, [uid, displayName, email, password, photo, emailVerification, codeVerification, uid]);

    const response: ResponseReq = {
        code: 200,
        status: 'success',
        text: 'verification code updated successfully',
        user: null
    };

    return response;
};

const updateUsersEmailVerification = async (uid: string, emailVerification: boolean) => {

    const [users]: User[] = await getUID(uid) as User[];

    if (!users) {
        const response: ResponseReq = {
            code: 404,
            status: 'error',
            text: 'The "user" does not exist'
        };
        return response;
    }

    const { email, displayName, photo, password, codeVerification } = users;

    const query = 'UPDATE users SET uid = ?, displayName = ?, email = ?, password = ?, photo = ?, emailVerification = ?, codeVerification = ? WHERE uid = ?';

    const [updatedUsers] = await connection.execute(query, [uid, displayName, email, password, photo, emailVerification, codeVerification, uid]);

    const response: ResponseReq = {
        code: 200,
        status: 'success',
        text: 'Email verification updated successfully',
    };

    return response;
};

const updateUsersPassword = async (tokenUid: string, user: User) => {

    const { password } = user;
    const [users]: User[] = await getUID(tokenUid) as User[];

    if (!users) {
        const response: ResponseReq = {
            code: 404,
            status: 'error',
            text: 'The "user" does not exist'
        };
        return response;
    }

    const { email, displayName, photo, emailVerification, codeVerification } = users;

    const hashPassword = await bcrypt.hash(password ?? '', 10);

    const query = 'UPDATE users SET uid = ?, displayName = ?, email = ?, password = ?, photo = ?, emailVerification = ?, codeVerification = ? WHERE uid = ?';

    const [updatedUsers] = await connection.execute(query, [tokenUid, displayName, email, hashPassword, photo, emailVerification, codeVerification, tokenUid]);

    const response: ResponseReq = {
        code: 200,
        status: 'success',
        text: 'user password updated successfully'
    };

    return response;
};

const updateUsersDisplayName = async (tokenUid: string, user: User) => {

    const newDisplayName = user.displayName;
    const [users]: User[] = await getUID(tokenUid) as User[];

    if (!users) {
        const response: ResponseReq = {
            code: 404,
            status: 'error',
            text: 'The "user" does not exist'
        };
        return response;
    }

    const { email, password, photo, emailVerification, codeVerification } = users;

    const query = 'UPDATE users SET uid = ?, displayName = ?, email = ?, password = ?, photo = ?, emailVerification = ?, codeVerification = ? WHERE uid = ?';

    const [updatedUsers] = await connection.execute(query, [tokenUid, newDisplayName, email, password, photo, emailVerification, codeVerification, tokenUid]);

    const response: ResponseReq = {
        code: 200,
        status: 'success',
        text: 'displayName updated successfully'
    };

    return response;
};

const updateUsersPhoto = async (tokenUid: string, linkPhoto: string) => {

    const [users]: User[] = await getUID(tokenUid) as User[];

    if (!users) {
        const response: ResponseReq = {
            code: 404,
            status: 'error',
            text: 'The "user" does not exist'
        };
        return response;
    }

    const { email, displayName, password, emailVerification, codeVerification } = users;

    if (users.photo == "/public/uploads/profile/user.webp") {
        const query = 'UPDATE users SET uid = ?, displayName = ?, email = ?, password = ?, photo = ?, emailVerification = ?, codeVerification = ? WHERE uid = ?';

        const [updatedUsers] = await connection.execute(query, [tokenUid, displayName, email, password, linkPhoto, emailVerification, codeVerification, tokenUid]);
    }

    const userResponse: User = {
        uid: tokenUid,
        displayName: displayName,
        email: email,
        photo: linkPhoto,
        emailVerification: emailVerification,
    }

    const response: ResponseReq = {
        code: 200,
        status: 'success',
        text: 'Image uploaded successfully',
        user: userResponse
    };

    return response;
};

const deleteUsers = async (uid: string) => {

    const [users]: User[] = await getUID(uid) as User[];

    if (!users) {
        const response: ResponseReq = {
            code: 404,
            status: 'error',
            text: 'The "user" entered is non-existent'
        };
        return response;
    }

    if (users.photo != "/public/uploads/profile/user.webp") {
        fs.unlink(users.photo.slice(1), (err) => {});
    }

    const removedUsers = await connection.execute('DELETE FROM users WHERE uid = ?', [uid]);

    const response: ResponseReq = {
        code: 200,
        status: 'success',
        text: 'successfully deleted user'
    };

    return response;
};

export default {
    getAll,
    getUID,
    getEmail,
    createUser,
    deleteUsers,
    updateUsersPhoto,
    updateUsersPassword,
    updateUsersDisplayName,
    updateUsersCodeVerification,
    updateUsersEmailVerification
}