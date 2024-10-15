// src/services/websocketService.ts
import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { sendMessage } from '../utils/websocketUtils';

type ClientData = {
    client: WebSocket;
    subscriptions: Set<string>;
};

const clients = new Map<string, ClientData>();

export const addClient = (client: WebSocket) => {
    const clientId = uuidv4();
    clients.set(clientId, { client, subscriptions: new Set() });
    return clientId;
};

export const removeClient = (clientId: string) => {
    clients.delete(clientId);
};

export const subscribeToProduct = (clientId: string, product_id: string) => {
    const clientData = clients.get(clientId);
    if (clientData && !clientData.subscriptions.has(product_id)) {
        clientData.subscriptions.add(product_id);
    }
};

export const unsubscribeFromProduct = (clientId: string, product_id: string) => {
    const clientData = clients.get(clientId);
    if (clientData) {
        clientData.subscriptions.delete(product_id);
    }
};

export const distributeMessage = (message: any) => {
    clients.forEach(({ client, subscriptions }) => {
        if (message.product_id && subscriptions.has(message.product_id)) {
            sendMessage(client, message);
        }
    });
};
