// src/server.ts
import http from 'http';
import WebSocket from 'ws';
import dotenv from 'dotenv';
import app from './app';
import { verifyToken } from './middleware/jwtAuth';
import { addClient, removeClient, subscribeToProduct, unsubscribeFromProduct } from './services/websocketService';
import { sendToCoinbase } from './services/coinbaseService';
dotenv.config();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (client: WebSocket, req) => {
    
    const token = new URLSearchParams(req.url?.split('?')[1]).get('token');
    const decoded = token ? verifyToken(token) : null;
    if (!decoded) {
        client.close(1008, 'Invalid or missing token');
        return;
    }

    const clientId = addClient(client);

    client.on('message', (message) => {
        const parsedMessage = JSON.parse(message.toString());
        const { type, product_id } = parsedMessage;
        
        if (type === 'subscribe') {
            subscribeToProduct(clientId, product_id);
            sendToCoinbase({ type: 'subscribe', channels: [{ name: 'level2', product_ids: [product_id] },{ name: 'matches', product_ids: [product_id] }] });
        } else if (type === 'unsubscribe') {
            unsubscribeFromProduct(clientId, product_id);
            sendToCoinbase({ type: 'unsubscribe', channels: [{ name: 'level2', product_ids: [product_id] },{ name: 'matches', product_ids: [product_id] }] });
        }
    });

    client.on('close', () => removeClient(clientId));
});

server.listen(process.env.PORT, () => console.log('Server running on port 4000'));
