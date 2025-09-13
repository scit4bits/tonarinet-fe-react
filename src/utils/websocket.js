import {Client} from '@stomp/stompjs';

class WebSocketService {
    constructor() {
        this.client = null;
        this.connected = false;
    }

    connect(url, onConnected, onError) {
        this.client = new Client({
            brokerURL: url || import.meta.env.VITE_WS_URL, // e.g., 'ws://localhost:8080/ws'
            connectHeaders: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            },
            debug: (str) => {
                console.log('STOMP Debug:', str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        this.client.onConnect = (frame) => {
            console.log('Connected to WebSocket:', frame);
            this.connected = true;
            if (onConnected) onConnected(frame);
        };

        this.client.onStompError = (frame) => {
            console.error('STOMP error:', frame);
            if (onError) onError(frame);
        };

        this.client.onDisconnect = () => {
            console.log('Disconnected from WebSocket');
            this.connected = false;
        };

        this.client.activate();
    }

    subscribe(destination, callback) {
        if (this.client && this.connected) {
            return this.client.subscribe(destination, callback);
        }
        console.warn('WebSocket not connected');
        return null;
    }

    publish(destination, body, headers = {}) {
        if (this.client && this.connected) {
            this.client.publish({
                destination,
                body: JSON.stringify(body),
                headers
            });
        } else {
            console.warn('WebSocket not connected');
        }
    }

    disconnect() {
        if (this.client) {
            this.client.deactivate();
            this.connected = false;
        }
    }

    isConnected() {
        return this.connected;
    }
}

export default new WebSocketService();