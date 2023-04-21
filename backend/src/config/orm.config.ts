import { DataSource } from "typeorm";
import { User } from "../entity/User.entity";
import { Message } from "../entity/Message.entity";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "127.0.0.1",
    port: 3306,
    username: "root",
    password: "password",
    database: "chat",
    synchronize: true,
    logging: false,
    entities: [
        User,
        Message
    ],
    migrations: [],
    subscribers: []
});