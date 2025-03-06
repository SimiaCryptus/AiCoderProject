import {Vector3} from './GameTypes';

export interface Player {
    id: string;
    name: string;
    team: string;
    position: Vector3;
    rotation: Vector3;
    status: PlayerStatus;
    lastUpdate: number;
}

export enum PlayerStatus {
    CONNECTED = 'connected',
    DISCONNECTED = 'disconnected',
    IDLE = 'idle',
    PLAYING = 'playing',
    SPECTATING = 'spectating'
}

export interface NetworkMessage {
    type: MessageType;
    data: any;
    timestamp: number;
    sender: string;
}

export enum MessageType {
    GAME_STATE = 'gameState',
    PLAYER_ACTION = 'playerAction',
    CHAT_MESSAGE = 'chatMessage',
    SYSTEM_MESSAGE = 'systemMessage'
}

export interface GameStateMessage {
    territories: any[];
    units: any[];
    resources: any[];
    weather: any;
}

export interface PlayerAction {
    type: ActionType;
    payload: any;
    timestamp: number;
}

export enum ActionType {
    MOVE = 'move',
    BUILD = 'build',
    ATTACK = 'attack',
    COLLECT = 'collect',
    USE_ABILITY = 'useAbility'
}