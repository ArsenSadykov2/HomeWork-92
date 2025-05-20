import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import WebSocket from 'ws';
import { IncomingMessage, OutgoingMessage, User } from './types';

const app = express();
const wsInstance = expressWs(app);
const port = 8000;
app.use(cors());

interface Client {
    ws: WebSocket;
    username: string;
}

const connectedClients: Client[] = [];

const router = express.Router();
wsInstance.applyTo(router);

router.ws('/chat', (ws, req) => {
    console.log('Client connected');
    let username = 'Anonymous';
    connectedClients.push({ ws, username });
    broadcastUserList();

    ws.on('message', (message) => {
        try {
            const decoded = JSON.parse(message.toString()) as IncomingMessage;

            if (decoded.type === 'SEND_MESSAGE') {
                const msg: OutgoingMessage = {
                    type: 'NEW_MESSAGE',
                    payload: { username, text: decoded.payload }
                };
                broadcast(msg);
            } else if (decoded.type === 'SET_USERNAME') {
                username = decoded.payload;
                const client = connectedClients.find(c => c.ws === ws);
                if (client) client.username = username;
                broadcastUserList();
            }
        } catch (e) {
            ws.send(JSON.stringify({ error: 'Invalid message format' }));
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        const index = connectedClients.findIndex(c => c.ws === ws);
        if (index !== -1) connectedClients.splice(index, 1);
        broadcastUserList();
    });
});

const broadcast = (message: OutgoingMessage) => {
    connectedClients.forEach(client => {
        if (client.ws.readyState === WebSocket.OPEN) {
            client.ws.send(JSON.stringify(message));
        }
    });
};

const broadcastUserList = () => {
    const userList: User[] = connectedClients.map(c => ({ username: c.username }));
    broadcast({ type: 'USER_LIST', payload: userList });
};

app.use(router);
app.listen(port, () => console.log(`Listening on port ${port}`));
