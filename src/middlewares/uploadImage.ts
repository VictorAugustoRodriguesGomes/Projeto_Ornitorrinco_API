import { Request, Response, NextFunction } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { ResponseReq } from "../interfaces/ResponseReq";


// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const uploadPath: string = './public/uploads/profile';
//         if (!fs.existsSync(uploadPath)) {
//             fs.mkdirSync(uploadPath, { recursive: true });
//         }
//         cb(null, uploadPath);
//     },
//     filename: (req: Request, file, cb) => {

//         if (file && file.size > 1024 * 1024 * 1) {
//             const userUID = req.user[0].uid;
//             cb(null, userUID + '.png');
//         } else {
//             cb(null, 'file.png');
//         }
//     }
// });

const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: any) => {
    const extensionIMG = /jpeg|jpg|png/;
    const mimeType = extensionIMG.test(file.mimetype);
    const extname = extensionIMG.test(path.extname(file.originalname).toLowerCase());

    if (mimeType && extname) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type, only JPEG and PNG is allowed! rtfgyhuk'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 1,
    },
}).single('image');

export const handleUpload = (req: Request, res: Response, next: NextFunction) => {
    upload(req, res, function (error) {
        if (error) {
            return next(error);
        }

        if (!req.file) {
            return next(new Error('No file uploaded4gbhjnkm'));
        }

        const uid = req.user.uid + '.webp';
        const uploadPath: string = './public/uploads/profile';

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        const destination = path.join(uploadPath, uid);

        require('fs').writeFile(destination, req.file.buffer, (error: any) => {
            if (error) {
                return next(error);
            }
            if (req.file) {
                req.file.filename = uid;
                next();
            } else {
                return next(new Error('File Error'));
            }
        });
    });
};