import {create} from 'zustand';
import {io, Socket} from 'socket.io-client';
import {GameState} from '../types/GameTypes';
import {Player} from '../types/MultiplayerTypes';

interface MultiplayerState {
    connected: boolean;
    players: Map<string, Player>;
    roomId: string | null;
    socket: Socket | null;
    latency: number;
}

interface MultiplayerStore {
    state: MultiplayerState;
    connect: (serverUrl: string) => Promise<void>;
    disconnect: () => void;
    joinRoom: (roomId: string) => Promise<void>;
    leaveRoom: () => void;
    sendGameState: (state: Partial<GameState>) => void;
    updatePlayer: (playerId: string, updates: Partial<Player>) => void;
}

export const useMultiplayerStore = create<MultiplayerStore>((set, get) => ({
    state: {
        connected: false,
        players: new Map(),
        roomId: null,
        socket: null,
        latency: 0
    },

    connect: async (serverUrl: string) => {
        try {
            const socket = io(serverUrl, {
                transports: ['websocket'],
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000
            });

            socket.on('connect', () => {
                set(state => ({
                    state: {
                        ...state.state,
                        connected: true,
                        socket
                    }
                }));
            });

            socket.on('disconnect', () => {
                set(state => ({
                    state: {
                        ...state.state,
                        connected: false
                    }
                }));
            });

            // Set up event listeners
            setupSocketListeners(socket);

        } catch (error) {
            console.error('Failed to connect:', error);
            throw error;
        }
    },

    disconnect: () => {
        const {socket} = get().state;
        if (socket) {
            socket.disconnect();
            set(state => ({
                state: {
                    ...state.state,
                    connected: false,
                    socket: null,
                    roomId: null
                }
            }));
        }
    },

    joinRoom: async (roomId: string) => {
        const {socket} = get().state;
        if (!socket) throw new Error('Not connected');

        return new Promise((resolve, reject) => {
            socket.emit('joinRoom', {roomId}, (response: any) => {
                if (response.success) {
                    set(state => ({
                        state: {
                            ...state.state,
                            roomId,
                            players: new Map(response.players.map((p: Player) => [p.id, p]))
                        }
                    }));
                    resolve(response);
                } else {
                    reject(new Error(response.error));
                }
            });
        });
    },

    leaveRoom: () => {
        const {socket, roomId} = get().state;
        if (socket && roomId) {
            socket.emit('leaveRoom', {roomId});
            set(state => ({
                state: {
                    ...state.state,
                    roomId: null,
                    players: new Map()
                }
            }));
        }
    },

    sendGameState: (state: Partial<GameState>) => {
        const {socket, roomId} = get().state;
        if (socket && roomId) {
            socket.emit('gameState', {
                roomId,
                state,
                timestamp: Date.now()
            });
        }
    },

    updatePlayer: (playerId: string, updates: Partial<Player>) => {
        set(state => {
            const players = new Map(state.state.players);
            const player = players.get(playerId);
            if (player) {
                players.set(playerId, {...player, ...updates});
            }
            return {
                state: {
                    ...state.state,
                    players
                }
            };
        });
    }
}));

function setupSocketListeners(socket: Socket) {
    socket.on('playerJoined', (player: Player) => {
        useMultiplayerStore.getState().updatePlayer(player.id, player);
    });

    socket.on('playerLeft', (playerId: string) => {
        const state = useMultiplayerStore.getState().state;
        const players = new Map(state.players);
        players.delete(playerId);
        useMultiplayerStore.setState({
            state: {
                ...state,
                players
            }
        });
    });

    socket.on('gameState', (_data: { state: Partial<GameState>, timestamp: number }) => {
        // Handle incoming game state
        // Implement state reconciliation here
    });

    socket.on('ping', () => {
        socket.emit('pong', Date.now());
    });

    socket.on('latency', (latency: number) => {
        useMultiplayerStore.setState(state => ({
            state: {
                ...state.state,
                latency
            }
        }));
    });
}