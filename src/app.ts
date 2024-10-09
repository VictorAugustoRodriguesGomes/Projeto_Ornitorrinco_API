import express from "express";
import router from "./routes";
import path from 'path';
import cors from 'cors';

const app = express();

app.use('/public', express.static(path.join(__dirname, '../public')));

app.use(express.json());

app.use(cors());

app.use(router);

export default app;