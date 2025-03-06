import {useMultiplayerStore} from '../systems/MultiplayerSystem';
import {MessageType, NetworkMessage, PlayerAction} from '../types/MultiplayerTypes';

export class NetworkManager {
    private messageQueue: NetworkMessage[] = [];
    private readonly maxQueueSize = 100;
    private readonly sendInterval = 50; // ms

    constructor() {
        this.startSendingMessages();
    }

    queueMessage(message: NetworkMessage) {
        if (this.messageQueue.length >= this.maxQueueSize) {
            this.messageQueue.shift(); // Remove oldest message
        }
        this.messageQueue.push(message);
    }

    sendPlayerAction(action: PlayerAction) {
        this.queueMessage({
            type: MessageType.PLAYER_ACTION,
            data: action,
            timestamp: Date.now(),
            sender: useMultiplayerStore.getState().state.socket?.id || ''
        });
    }

    sendChatMessage(message: string) {
        this.queueMessage({
            type: MessageType.CHAT_MESSAGE,
            data: {message},
            timestamp: Date.now(),
            sender: useMultiplayerStore.getState().state.socket?.id || ''
        });
    }

    private startSendingMessages() {
        setInterval(() => {
            this.processMessageQueue();
        }, this.sendInterval);
    }

    private processMessageQueue() {
        const {socket} = useMultiplayerStore.getState().state;
        if (!socket || this.messageQueue.length === 0) return;

        const messages = this.messageQueue.splice(0, 10); // Process up to 10 messages at once
        socket.emit('messages', messages);
    }
}