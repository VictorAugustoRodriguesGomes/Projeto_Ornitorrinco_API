import { User } from "../interfaces/User";


export interface ResponseReq {
    code: number;
    status: string;
    text: string;
    user?: User | null;
    token?: string;
}