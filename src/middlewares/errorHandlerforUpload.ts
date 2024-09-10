import { Request, Response, NextFunction } from 'express';

import { ResponseReq } from "../interfaces/ResponseReq";


const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
    const response: ResponseReq = {
        code: 500,
        status: 'error',
        text: error.message || 'Internal Server Error',
    };

    if (error.message === 'File too large') {
        response.text = 'File too large fgvhbujnkml';
    }

    res.status(response.code).json(response);
};

export default { errorHandler };