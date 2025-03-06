import {Vector3} from './GameTypes';

export interface TerritoryConfig {
    captureTime: number;
    influenceRadius: number;
    maxControlPoints: number;
    resourceGenerationRate: Record<ResourceType, number>;
}

export interface TerritoryState {
    id: string;
    position: Vector3;
    owner: string | null;
    controlPoints: number;
    type: TerritoryType;
    influenceZones: InfluenceZone[];
    resources: TerritoryResources;
    structures: Structure[];
    contestedBy: string[];
    captureProgress: number;
}

export interface InfluenceZone {
    position: Vector3;
    radius: number;
    strength: number;
    owner: string | null;
}

export interface TerritoryResources {
    generators: ResourceGenerator[];
    storages: ResourceStorage[];
    collectionPoints: CollectionPoint[];
}

export interface ResourceGenerator {
    type: ResourceType;
    position: Vector3;
    productionRate: number;
    active: boolean;
}

export interface ResourceStorage {
    type: ResourceType;
    position: Vector3;
    capacity: number;
    current: number;
}

export interface CollectionPoint {
    position: Vector3;
    resourceType: ResourceType;
    amount: number;
    respawnTime: number;
}

export interface Structure {
    id: string;
    type: StructureType;
    position: Vector3;
    health: number;
    owner: string;
}

export enum ResourceType {
    TUNA = 'tuna',
    MILK = 'milk',
    CATNIP = 'catnip',
    YARN = 'yarn',
    FISH = 'fish'
}

export enum StructureType {
    CAT_CONDO = 'catCondo',
    YARN_FACTORY = 'yarnFactory',
    FOOD_BOWL = 'foodBowl',
    CAT_TREE = 'catTree',
    TUNNEL = 'tunnel'
}

export enum TerritoryType {
    RESIDENTIAL = 'residential',
    INDUSTRIAL = 'industrial',
    SUPPLY = 'supply',
    STRATEGIC = 'strategic'
}