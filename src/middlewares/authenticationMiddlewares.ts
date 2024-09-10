import jwt from "jsonwebtoken";
import userModel from '../models/userModel';
import { NextFunction, Request, Response } from "express";


import { User } from "../interfaces/User";
import { ResponseReq } from "../interfaces/ResponseReq";


type JwtPayload = {
    uid: string;
}

const authenticationMiddlewares = async (req: Request, res: Response, next: NextFunction) => {

    const { authorization } = req.headers;

    let uidUser: string;

    const response: ResponseReq = {
        code: 401,
        status: 'error',
        text: 'The "token" is invalid'
    };

    if (!authorization) { return res.status(response.code).json(response); }
    const token = authorization.split(' ')[1];

    try {
        let { uid } = jwt.verify(token, process.env.JWT_PASS ?? '') as JwtPayload;
        uidUser = uid;
    } catch (error) {
        return res.status(response.code).json(response);
    }

    const [user]: User[] = await userModel.getUID(uidUser) as User[];
    if (!user) { return res.status(response.code).json(response); }

    req.user = user;

    next();

}

export default { authenticationMiddlewares };