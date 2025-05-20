import express from 'express';
import expressWs from "express-ws";
import cors from 'cors';
import WebSocket from 'ws';


const app = express();
const wsInstance = expressWs(app);

const port = 8000;
app.use(cors());

const connectedClients: WebSocket[] = [];

interface IncomingMessages {
    type: string;
    payload: string;
}

let username = "Anonymous";

const router = express.Router();
wsInstance.applyTo(router);

router.ws('/chat', (ws, req) => {
    console.log('Client connection');

    connectedClients.push(ws);
    console.log('Total clients: ' + connectedClients.length);



    ws.on('message', (message) => {
        try{
            const decodedMessage = JSON.parse(message.toString()) as IncomingMessages;
            console.log(decodedMessage);
            if(decodedMessage.type === "SEND_MESSAGE"){
                connectedClients.forEach(clientWs => {
                    clientWs.send(JSON.stringify({
                        type: "NEW_MESSAGE",
                        payload: `${username}: ${decodedMessage.payload}`
                    }));
                })
            } else if(decodedMessage.type === "SET_USERNAME"){
                username = decodedMessage.payload;
            }
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