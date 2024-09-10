import { User } from './../class/User';

declare global { 
    namespace Express {
        export interface Request {
            user: Partial<User>;
        }
    }
}