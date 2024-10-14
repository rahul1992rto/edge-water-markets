import express, { Request, Response, NextFunction } from 'express';
import WebSocket, { Server as WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import http from 'http';
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import cors from 'cors';
import bodyParser from 'body-parser';
// Secret key for signing JWTs (in production, keep it in an environment variable)
const JWT_SECRET = 'your_secret_key';
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const COINBASE_WS_URL = 'wss://ws-feed-public.sandbox.exchange.coinbase.com';
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from React app
    methods: ['GET', 'POST'], // Allowed methods
    credentials: true // Allow credentials (like cookies, authorization headers, etc.)
}));
// Middleware to parse JSON requests
app.use(bodyParser.json());

// Middleware to parse URL-encoded requests
app.use(bodyParser.urlencoded({ extended: true }));
// const COINBASE_WS_URL = 'wss://ws-feed.pro.coinbase.com';
export interface CustomRequest extends Request {
    token: string | JwtPayload;
}
type ClientData = {
    client: WebSocket;
    subscriptions: Set<string>;
};

type CoinbaseMessage = {
    type: string;
    product_id?: string;
    channels?: { name: string; product_ids: string[] }[];
};

const clients = new Map<string, ClientData>();
// app.use(cors());
// app.use(bodyParser.json());
// Middleware to protect routes


app.post('/api/login', (req: Request, res: Response) => {
    const { username, password } = req.body;

    // Dummy credentials for demonstration
    if (username === 'testuser' && password === 'testpass') {
        const user = { username }; // Payload for JWT

        // Sign the token with user payload and secret key
        const token = jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Invalid username or password' });
    }
});

wss.on('connection', (client: WebSocket, req: Request) => {
    const token = req.url.split('?token=')[1]; // Or extract from cookies
    if (!token) {
        client.close(1008, 'No token provided');
        return;
    }

    // Verify the token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            client.close(1008, 'Invalid token');
            return;
        }
        const clientId = uuidv4();
        clients.set(clientId, { client, subscriptions: new Set() });
        console.log("Client connected with ID:", clientId);

        // Handle user subscribe/unsubscribe requests
        client.on('message', (message: string) => {
            try {
                const { type, product_id } = JSON.parse(message) as CoinbaseMessage;

                if (type === 'subscribe') {
                    console.log("Subscribed");
                    subscribeToProduct(clientId, product_id as string);
                } else if (type === 'unsubscribe') {
                    console.log("Unsubscribed");
                    unsubscribeFromProduct(clientId, product_id as string);
                }
            } catch (error) {
                console.error(`Error processing client message: ${error}`);
                client.send(JSON.stringify({ error: 'Invalid message format' }));
            }
        });

        client.on('close', () => {
            clients.delete(clientId);
            console.log("Client disconnected with ID:", clientId);
        });

        client.on('error', (error) => {
            console.error(`Client WebSocket error for ID ${clientId}:`, error);
            client.close();
        });
    });
});

function subscribeToProduct(clientId: string, product_id: string) {
    const clientData = clients.get(clientId);
    if (clientData && !clientData.subscriptions.has(product_id)) {
        console.log("Subscribing to product:", product_id);
        clientData.subscriptions.add(product_id);
        sendToCoinbase({
            type: 'subscribe',
            channels: [
                { name: 'level2', product_ids: [product_id] },
                { name: 'matches', product_ids: [product_id] }
            ]
        });
    }
}

function unsubscribeFromProduct(clientId: string, product_id: string) {
    const clientData = clients.get(clientId);
    if (clientData) {
        console.log("Unsubscribing from product:", product_id);
        clientData.subscriptions.delete(product_id);
        sendToCoinbase({
            type: 'unsubscribe',
            channels: [
                { name: 'level2', product_ids: [product_id] },
                { name: 'matches', product_ids: [product_id] }
            ]
        });
    }
}

// Coinbase WebSocket connection for receiving updates
const coinbaseWs = new WebSocket(COINBASE_WS_URL);

coinbaseWs.on('message', (data: WebSocket.Data) => {
    try {
        const message = JSON.parse(data.toString()) as CoinbaseMessage;
        console.log("Received message from Coinbase:", message);
        distributeMessage(message);
    } catch (error) {
        console.error('Error parsing message from Coinbase:', error);
    }
});

function sendToCoinbase(message: CoinbaseMessage) {
    if (coinbaseWs.readyState === WebSocket.OPEN) {
        coinbaseWs.send(JSON.stringify(message));
    }
}

function distributeMessage(message: CoinbaseMessage) {
    clients.forEach(({ client, subscriptions }) => {
        if (message.product_id && subscriptions.has(message.product_id)) {
            try {
                client.send(JSON.stringify(message));
            } catch (error) {
                console.error('Error sending message to client:', error);
            }
        }
    });
}


server.listen(4000, () => console.log('Server running on port 4000'));
