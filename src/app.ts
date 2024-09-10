import express from "express";
import router from "./routes";
import path from 'path';


const app = express();

app.use('/public', express.static(path.join(__dirname, '../public')));

app.use(express.json());

app.use(router);


export default app;