const express = require('express');
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const app = express();
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });
const COINBASE_WS_URL = 'wss://ws-feed-public.sandbox.exchange.coinbase.com';


// Store subscriptions and clients
const clients = new Map();

wss.on('connection', (client) => {
    const clientId = uuidv4();
    clients.set(clientId, { client, subscriptions: new Set() });
    console.log("haiiiiiiiiii")
    // Handle user subscribe/unsubscribe requests
    client.on('message', (message) => {
        const { type, product_id } = JSON.parse(message);

        if (type === 'subscribe') {
            console.log("Subscribed");
            subscribeToProduct(clientId, product_id);
        } else if (type === 'unsubscribe') {
            console.log("unSubscribed");

            unsubscribeFromProduct(clientId, product_id);
        }
    });

    client.on('close', () => {
        clients.delete(clientId);
    });
});

function subscribeToProduct(clientId, product_id) {
    const clientData = clients.get(clientId);
    console.log(clientId)
    console.log(product_id)
    if (!clientData.subscriptions.has(product_id)) {
    console.log("inside")

        clientData.subscriptions.add(product_id);
        sendToCoinbase({ type: 'subscribe', channels: [{ name: 'level2', product_ids: [product_id] }, { name: 'matches', product_ids: [product_id] }] });
    }
}

function unsubscribeFromProduct(clientId, product_id) {
    const clientData = clients.get(clientId);
    console.log(clientId)

    clientData.subscriptions.delete(product_id);
    sendToCoinbase({ type: 'unsubscribe', channels: [{ name: 'level2', product_ids: [product_id] }, { name: 'matches', product_ids: [product_id] }] });
}

// Coinbase WebSocket connection for receiving updates
const coinbaseWs = new WebSocket(COINBASE_WS_URL);
coinbaseWs.on('message', (data) => {
    // console.log("inside distributeMessage")

    const message = JSON.parse(data);
    console.log("type : " + message.type)
    distributeMessage(message);
});

function sendToCoinbase(message) {
    
    coinbaseWs.send(JSON.stringify(message));
}

function distributeMessage(message) {
    clients.forEach(({ client, subscriptions }) => {
        if (subscriptions.has(message.product_id)) {
            client.send(JSON.stringify(message));
        }
    });
}
coinbaseWs.on('close', () => {
    console.log('Coinbase WebSocket disconnected');
});

coinbaseWs.on('error', (error) => {
    console.error('Coinbase WebSocket error:', error);
});
server.listen(4000, () => console.log('Server running on port 4000'));