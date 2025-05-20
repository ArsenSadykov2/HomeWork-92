import express from 'express';
import expressWs from "express-ws";
import cors from 'cors';
import WebSocket from 'ws';


const app = express();
const wsInstance = expressWs(app);

const port = 8000;
app.use(cors());

const connectedClients: WebSocket[] = [];

const router = express.Router();
wsInstance.applyTo(router);

router.ws('/chat', (ws, req) => {
    console.log('Client connection');

    connectedClients.push(ws);
    console.log('Total clients: ' + connectedClients.length);

    ws.on('message', (message) => {
        try{
            const decodedMessage = JSON.parse(message.toString());

            console.log(message);
            connectedClients.forEach(clientWs => {
                clientWs.send(JSON.stringify(decodedMessage.user + ": " + decodedMessage.message));
            })
        } catch (e) {
            ws.send(JSON.stringify({error: "Invalid message format"}))
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        const index = connectedClients.indexOf(ws);
        connectedClients.splice(index, 1);
        console.log('Total clients: ' + connectedClients.length);
    });
});

app.use(router);
app.listen(port, () => console.log(`Listening on port ${port}`));