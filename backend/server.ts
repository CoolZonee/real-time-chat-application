
import dotenv from 'dotenv';
import app from './src/app';
import { AppDataSource } from './src/config/orm.config';
import WebSocket from 'ws';

dotenv.config();

const port = process.env.PORT;

const wss = new WebSocket.Server({ port: 8080 });
const startServer = async () => {
    // Array to store connected WebSocket clients
    const clients: any = {};

    let nextClientId = 0;
    await AppDataSource.initialize()
    wss.on('connection', function connection(ws, req) {
        // Add client to the list of connected clients
        const clientId = req.url?.split('=')[1] || nextClientId++;
        console.log(`Client connected with ID: ${clientId}`);
        clients[clientId] = ws;
        console.log("total clients: ", Object.keys(clients).length)

        // Send the client ID to the client
        ws.send(JSON.stringify({
            type: 'clientId',
            data: clientId
        }));

        ws.on('message', function incoming(message: any) {
            console.log('received: %s', message);
            // Parse the message to extract the recipient ID
            const data = JSON.parse(message);
            const recipientId = data.receiver;

            // Send the message to the recipient
            if (clients[recipientId]) {
                console.log(`Sending message to client ${recipientId}`)
                clients[recipientId].send(message);
            }

            // Echo back the message to the client
            ws.send(message);
        });

        ws.on('close', function close() {
            console.log('Client disconnected');
            // Remove client from the list of connected clients
            delete clients[clientId];
        });
    });

    app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
    });
}

startServer();