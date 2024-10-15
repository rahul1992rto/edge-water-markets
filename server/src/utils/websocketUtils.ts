// src/utils/websocketUtils.ts
import WebSocket from 'ws';

export const sendMessage = (ws: WebSocket, message: object) => {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
    }
};

export const parseMessage = (data: WebSocket.Data) => {
    try {
        return JSON.parse(data.toString());
    } catch {
        console.error('Invalid JSON format');
        return null;
    }
};
