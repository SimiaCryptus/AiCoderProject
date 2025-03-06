import {Vector3} from './GameTypes';

export enum BuildingType {
    CAT_CONDO = 'catCondo',
    SCRATCHING_POST = 'scratchingPost',
    FOOD_BOWL = 'foodBowl',
    WATCH_TOWER = 'watchTower',
    TUNNEL = 'tunnel',
    MEDICAL_STATION = 'medicalStation',
    RESOURCE_PROCESSOR = 'resourceProcessor',
    DEFENSE_TURRET = 'defenseTurret',
    STORAGE = 'storage',
    TRAINING_FACILITY = 'trainingFacility'
}

export enum BuildingSize {
    SMALL = 'small',
    MEDIUM = 'medium',
    LARGE = 'large'
}

export interface BuildingCost {
    tuna: number;
    yarn: number;
    catnip: number;
}

export interface BuildingRequirements {
    level: number;
    prerequisites: BuildingType[];
    territory: boolean;
}

export interface BuildingStats {
    health: number;
    defense: number;
    capacity: number;
    range: number;
    productionRate: number;
}

export interface Building {
    id: string;
    type: BuildingType;
    position: Vector3;
    rotation: Vector3;
    size: BuildingSize;
    owner: string;
    health: number;
    level: number;
    stats: BuildingStats;
    status: BuildingStatus;
    connectedBuildings: string[];
    modules: BuildingModule[];
}

export interface BuildingModule {
    id: string;
    type: ModuleType;
    position: Vector3;
    status: BuildingStatus;
    stats: Partial<BuildingStats>;
}

export enum ModuleType {
    DEFENSE = 'defense',
    STORAGE = 'storage',
    PRODUCTION = 'production',
    UTILITY = 'utility'
}

export enum BuildingStatus {
    CONSTRUCTION = 'construction',
    OPERATIONAL = 'operational',
    DAMAGED = 'damaged',
    DESTROYED = 'destroyed',
    UPGRADING = 'upgrading'
}

export interface BuildingTemplate {
    type: BuildingType;
    size: BuildingSize;
    baseCost: BuildingCost;
    baseStats: BuildingStats;
    requirements: BuildingRequirements;
    allowedModules: ModuleType[];
    maxModules: number;
}