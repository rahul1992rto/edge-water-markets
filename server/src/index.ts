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
    try {
        // Extract and verify token
        const token = new URLSearchParams(req.url?.split('?')[1]).get('token');
        if (!token) {
            client.close(1008, 'Missing token');
            return;
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            client.close(1008, 'Invalid token');
            return;
        }

        // Add client to the list and get the client ID
        const clientId = addClient(client);

        client.on('message', (message) => {
            try {
                // Validate and parse incoming message
                const parsedMessage = JSON.parse(message.toString());
                const { type, product_id } = parsedMessage;

                if (!type || !product_id) {
                    client.send(JSON.stringify({ error: 'Invalid message format' }));
                    return;
                }

                if (type === 'subscribe') {
                    subscribeToProduct(clientId, product_id);
                    sendToCoinbase({
                        type: 'subscribe',
                        channels: [
                            { name: 'level2', product_ids: [product_id] },
                            { name: 'matches', product_ids: [product_id] }
                        ]
                    });
                } else if (type === 'unsubscribe') {
                    unsubscribeFromProduct(clientId, product_id);
                    sendToCoinbase({
                        type: 'unsubscribe',
                        channels: [
                            { name: 'level2', product_ids: [product_id] },
                            { name: 'matches', product_ids: [product_id] }
                        ]
                    });
                } else {
                    client.send(JSON.stringify({ error: 'Unknown message type' }));
                }
            } catch (error) {
                console.error('Error processing client message:', error);
                client.send(JSON.stringify({ error: 'Failed to process message' }));
            }
        });

        client.on('close', () => {
            removeClient(clientId);
        });

        client.on('error', (error) => {
            console.error(`WebSocket error for client ID ${clientId}:`, error);
            client.close();
        });
    } catch (error) {
        console.error('Connection error:', error);
        client.close(1011, 'Unexpected server error');
    }
});

server.listen(process.env.PORT || 4000, () => console.log(`Server running on port ${process.env.PORT || 4000}`));
