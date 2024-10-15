// src/services/coinbaseService.ts
import WebSocket from 'ws';
import { distributeMessage } from './websocketService';
import dotenv from 'dotenv';
dotenv.config();
console.log("COINBASE_WS_UR : " + process.env.COINBASE_WS_UR);
const coinbaseWs = new WebSocket(process.env.COINBASE_WS_URL);

coinbaseWs.on('message', (data: WebSocket.Data) => {
    const message = JSON.parse(data.toString());
    distributeMessage(message);
});

export const sendToCoinbase = (message: any) => {
    if (coinbaseWs.readyState === WebSocket.OPEN) {
        coinbaseWs.send(JSON.stringify(message));
    }
};
