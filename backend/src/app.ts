import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoute from './route/auth.route';
import messageRoute from './route/message.route';
import userRoute from './route/user.route';
import bodyParser from 'body-parser';

dotenv.config();

const app: Express = express();

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(authRoute)
app.use(messageRoute)
app.use(userRoute)

export default app;