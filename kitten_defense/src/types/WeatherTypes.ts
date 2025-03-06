export enum WeatherType {
    CLEAR = 'clear',
    HAIRBALL_STORM = 'hairballStorm',
    CATNIP_WIND = 'catnipWind',
    MILK_RAIN = 'milkRain',
    YARN_FOG = 'yarnFog',
    RAINBOW_BEAM = 'rainbowBeam'
}

export interface WeatherEffect {
    type: WeatherType;
    intensity: number; // 0 to 1
    duration: number; // in seconds
    position: THREE.Vector3;
    radius: number;
}

export interface WeatherState {
    currentWeather: WeatherType;
    effects: WeatherEffect[];
    globalIntensity: number;
    timeUntilChange: number;
    particleCount: number;
}

export interface WeatherModifier {
    movementSpeedMultiplier: number;
    visibilityRange: number;
    resourceConsumption: number;
    staminaDrain: number;
    specialEffects: string[];
}