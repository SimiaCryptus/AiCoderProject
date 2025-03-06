export interface Vector3 {
    x: number;
    y: number;
    z: number;
}

export interface GameState {
    territories: Territory[];
    units: Unit[];
    resources: Resources;
    weather: Weather;
}

export interface Territory {
    id: string;
    position: Vector3;
    owner: string | null;
    controlPoints: number;
    type: TerritoryType;
}

export interface Unit {
    id: string;
    position: Vector3;
    type: UnitType;
    owner: string;
    health: number;
    status: UnitStatus;
}

export interface Resources {
    tuna: number;
    milk: number;
    catnip: number;
    yarn: number;
    fish: number;
}

export interface Weather {
    type: WeatherType;
    intensity: number;
    duration: number;
}

export enum TerritoryType {
    RESIDENTIAL = 'residential',
    INDUSTRIAL = 'industrial',
    STRATEGIC = 'strategic',
    SUPPLY = 'supply'
}

export enum UnitType {
    SCOUT = 'scout',
    HEAVY = 'heavy',
    MEDIC = 'medic',
    ENGINEER = 'engineer',
    SUPPORT = 'support'
}

export enum UnitStatus {
    IDLE = 'idle',
    MOVING = 'moving',
    ATTACKING = 'attacking',
    DEFENDING = 'defending',
    BUILDING = 'building'
}

export enum WeatherType {
    CLEAR = 'clear',
    RAIN = 'rain',
    SNOW = 'snow',
    FOG = 'fog',
    HEAT_WAVE = 'heatWave'
}