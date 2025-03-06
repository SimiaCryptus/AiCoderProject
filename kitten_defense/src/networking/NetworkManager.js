import { useMultiplayerStore } from '../systems/MultiplayerSystem';
import { MessageType } from '../types/MultiplayerTypes';
export class NetworkManager {
    constructor() {
        Object.defineProperty(this, "messageQueue", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "maxQueueSize", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 100
        });
        Object.defineProperty(this, "sendInterval", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 50
        }); // ms
        this.startSendingMessages();
    }
    queueMessage(message) {
        if (this.messageQueue.length >= this.maxQueueSize) {
            this.messageQueue.shift(); // Remove oldest message
        }
        this.messageQueue.push(message);
    }
    startSendingMessages() {
        setInterval(() => {
            this.processMessageQueue();
        }, this.sendInterval);
    }
    processMessageQueue() {
        const { socket } = useMultiplayerStore.getState().state;
        if (!socket || this.messageQueue.length === 0)
            return;
        const messages = this.messageQueue.splice(0, 10); // Process up to 10 messages at once
        socket.emit('messages', messages);
    }
    sendPlayerAction(action) {
        this.queueMessage({
            type: MessageType.PLAYER_ACTION,
            data: action,
            timestamp: Date.now(),
            sender: useMultiplayerStore.getState().state.socket?.id || ''
        });
    }
    sendChatMessage(message) {
        this.queueMessage({
            type: MessageType.CHAT_MESSAGE,
            data: { message },
            timestamp: Date.now(),
            sender: useMultiplayerStore.getState().state.socket?.id || ''
        });
    }
}
