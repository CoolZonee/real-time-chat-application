import { Server } from 'socket.io';
import app from '../app';

const http = require('http').createServer(app);

const io = new Server(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
    path: "/socket"
});

export default io;