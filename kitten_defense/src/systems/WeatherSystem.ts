import {create} from 'zustand';
import * as THREE from 'three';
import {WeatherEffect, WeatherModifier, WeatherState, WeatherType} from '../types/WeatherTypes';

const WEATHER_MODIFIERS: Record<WeatherType, WeatherModifier> = {
    [WeatherType.CLEAR]: {
        movementSpeedMultiplier: 1,
        visibilityRange: 1000,
        resourceConsumption: 1,
        staminaDrain: 1,
        specialEffects: []
    },
    [WeatherType.HAIRBALL_STORM]: {
        movementSpeedMultiplier: 0.7,
        visibilityRange: 300,
        resourceConsumption: 1.2,
        staminaDrain: 1.3,
        specialEffects: ['reduced_accuracy', 'screen_shake']
    },
    [WeatherType.CATNIP_WIND]: {
        movementSpeedMultiplier: 1.3,
        visibilityRange: 800,
        resourceConsumption: 1.1,
        staminaDrain: 0.8,
        specialEffects: ['speed_boost', 'particle_trail']
    },
    [WeatherType.MILK_RAIN]: {
        movementSpeedMultiplier: 0.9,
        visibilityRange: 600,
        resourceConsumption: 0.9,
        staminaDrain: 0.7,
        specialEffects: ['healing', 'slippery_ground']
    },
    [WeatherType.YARN_FOG]: {
        movementSpeedMultiplier: 0.8,
        visibilityRange: 200,
        resourceConsumption: 1.1,
        staminaDrain: 1.1,
        specialEffects: ['stealth_bonus', 'blur_effect']
    },
    [WeatherType.RAINBOW_BEAM]: {
        movementSpeedMultiplier: 1.2,
        visibilityRange: 1200,
        resourceConsumption: 0.8,
        staminaDrain: 0.6,
        specialEffects: ['resource_bonus', 'rainbow_trail']
    }
};

interface WeatherStore {
    weatherState: WeatherState;
    setWeather: (type: WeatherType) => void;
    addEffect: (effect: WeatherEffect) => void;
    removeEffect: (effectId: string) => void;
    updateWeather: (deltaTime: number) => void;
}

export const useWeatherStore = create<WeatherStore>((set) => ({
    weatherState: {
        currentWeather: WeatherType.CLEAR,
        effects: [],
        globalIntensity: 0,
        timeUntilChange: 300,
        particleCount: 1000
    },

    setWeather: (type: WeatherType) => {
        set((state) => ({
            weatherState: {
                ...state.weatherState,
                currentWeather: type,
                timeUntilChange: 300 + Math.random() * 300
            }
        }));
    },

    addEffect: (effect: WeatherEffect) => {
        set((state) => ({
            weatherState: {
                ...state.weatherState,
                effects: [...state.weatherState.effects, effect]
            }
        }));
    },

    removeEffect: (effectId: string) => {
        set((state) => ({
            weatherState: {
                ...state.weatherState,
                effects: state.weatherState.effects.filter((e) => e.type !== effectId)
            }
        }));
    },

    updateWeather: (deltaTime: number) => {
        set((state) => {
            const newTimeUntilChange = state.weatherState.timeUntilChange - deltaTime;

            if (newTimeUntilChange <= 0) {
                const weatherTypes = Object.values(WeatherType);
                const newWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
                return {
                    weatherState: {
                        ...state.weatherState,
                        currentWeather: newWeather,
                        timeUntilChange: 300 + Math.random() * 300
                    }
                };
            }

            return {
                weatherState: {
                    ...state.weatherState,
                    timeUntilChange: newTimeUntilChange,
                    effects: state.weatherState.effects.filter((e) => e.duration > 0).map((e) => ({
                        ...e,
                        duration: e.duration - deltaTime
                    }))
                }
            };
        });
    }
}));

export class WeatherSystem {
    private particles: THREE.Points | null = null;
    private geometry: THREE.BufferGeometry | null = null;
    private material: THREE.PointsMaterial | null = null;

    constructor(scene: THREE.Scene) {
        this.initParticleSystem(scene);
    }

    update(deltaTime: number) {
        const {weatherState} = useWeatherStore.getState();

        // Update particle positions and colors based on weather type
        if (this.geometry && this.material) {
            const positions = this.geometry.attributes.position.array as Float32Array;

            for (let i = 0; i < positions.length; i += 3) {
                // Update particle positions based on weather type
                switch (weatherState.currentWeather) {
                    case WeatherType.HAIRBALL_STORM:
                        positions[i] += Math.sin(deltaTime + i) * 2;
                        positions[i + 1] -= 2;
                        break;
                    case WeatherType.CATNIP_WIND:
                        positions[i] += 3;
                        positions[i + 1] += Math.cos(deltaTime + i) * 0.5;
                        break;
                    case WeatherType.MILK_RAIN:
                        positions[i + 1] -= 5;
                        break;
                    // Add more weather type animations
                }

                // Reset particles that go out of bounds
                if (positions[i + 1] < 0) positions[i + 1] = 500;
                if (positions[i] > 500) positions[i] = -500;
                if (positions[i] < -500) positions[i] = 500;
                if (positions[i + 2] > 500) positions[i + 2] = -500;
                if (positions[i + 2] < -500) positions[i + 2] = 500;
            }

            this.geometry.attributes.position.needsUpdate = true;
        }

        // Update weather state
        useWeatherStore.getState().updateWeather(deltaTime);
    }

    getWeatherModifier(): WeatherModifier {
        const {currentWeather} = useWeatherStore.getState().weatherState;
        return WEATHER_MODIFIERS[currentWeather];
    }

    private initParticleSystem(scene: THREE.Scene) {
        this.geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(useWeatherStore.getState().weatherState.particleCount * 3);

        for (let i = 0; i < positions.length; i += 3) {
            positions[i] = (Math.random() - 0.5) * 1000;
            positions[i + 1] = Math.random() * 500;
            positions[i + 2] = (Math.random() - 0.5) * 1000;
        }

        this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        this.material = new THREE.PointsMaterial({
            size: 2,
            transparent: true,
            opacity: 0.6,
            vertexColors: true,
            blending: THREE.AdditiveBlending
        });

        this.particles = new THREE.Points(this.geometry, this.material);
        scene.add(this.particles);
    }
}