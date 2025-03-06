import {create} from 'zustand';
import {GameState, Resources, Territory, Unit, Weather, WeatherType} from '../types/GameTypes';

interface GameStore {
    gameState: GameState;
    initGame: () => void;
    updateTerritory: (territory: Territory) => void;
    updateUnit: (unit: Unit) => void;
    updateResources: (resources: Partial<Resources>) => void;
    updateWeather: (weather: Weather) => void;
}

const initialState: GameState = {
    territories: [],
    units: [],
    resources: {
        tuna: 100,
        milk: 50,
        catnip: 25,
        yarn: 75,
        fish: 10
    },
    weather: {
        type: WeatherType.CLEAR,
        intensity: 0,
        duration: 0
    }
};

export const useGameStore = create<GameStore>((set) => ({
    gameState: initialState,

    initGame: () => {
        set({gameState: initialState});
    },

    updateTerritory: (territory: Territory) => {
        set((state) => ({
            gameState: {
                ...state.gameState,
                territories: state.gameState.territories.map((t) =>
                    t.id === territory.id ? territory : t
                )
            }
        }));
    },

    updateUnit: (unit: Unit) => {
        set((state) => ({
            gameState: {
                ...state.gameState,
                units: state.gameState.units.map((u) =>
                    u.id === unit.id ? unit : u
                )
            }
        }));
    },

    updateResources: (resources: Partial<Resources>) => {
        set((state) => ({
            gameState: {
                ...state.gameState,
                resources: {
                    ...state.gameState.resources,
                    ...resources
                }
            }
        }));
    },

    updateWeather: (weather: Weather) => {
        set((state) => ({
            gameState: {
                ...state.gameState,
                weather
            }
        }));
    }
}));

export class GameEngine {
    private gameLoop: number | null = null;

    start() {
        if (this.gameLoop) return;

        const tick = () => {
            this.update();
            this.gameLoop = requestAnimationFrame(tick);
        };

        this.gameLoop = requestAnimationFrame(tick);
    }

    stop() {
        if (this.gameLoop) {
            cancelAnimationFrame(this.gameLoop);
            this.gameLoop = null;
        }
    }

    private update() {
        // Update game logic here
        this.updateUnits();
        this.updateTerritories();
        this.updateResources();
        this.updateWeather();
    }

    private updateUnits() {
        // Update unit positions, states, and actions
    }

    private updateTerritories() {
        // Update territory control and influence
    }

    private updateResources() {
        // Update resource generation and consumption
    }

    private updateWeather() {
        // Update weather conditions and effects
    }
}