import {Vector3} from './GameTypes';

export enum ResourceType {
    TUNA = 'tuna',
    MILK = 'milk',
    CATNIP = 'catnip',
    YARN = 'yarn',
    FISH = 'fish'
}

export interface ResourceNode {
    id: string;
    type: ResourceType;
    position: Vector3;
    amount: number;
    maxAmount: number;
    regenerationRate: number;
    lastUpdate: number;
    isActive: boolean;
    controlledBy: string | null;
}

export interface ResourceGenerator {
    id: string;
    type: ResourceType;
    position: Vector3;
    productionRate: number;
    efficiency: number;
    owner: string;
    isOperational: boolean;
    maintenanceCost: ResourceCost;
}

export interface ResourceStorage {
    id: string;
    position: Vector3;
    capacity: Record<ResourceType, number>;
    stored: Record<ResourceType, number>;
    owner: string;
}

export interface ResourceCost {
    [ResourceType.TUNA]?: number;
    [ResourceType.MILK]?: number;
    [ResourceType.CATNIP]?: number;
    [ResourceType.YARN]?: number;
    [ResourceType.FISH]?: number;
}

export interface ResourceTransaction {
    id: string;
    type: 'production' | 'consumption' | 'transfer';
    resources: Partial<Record<ResourceType, number>>;
    source: string;
    destination: string;
    timestamp: number;
}