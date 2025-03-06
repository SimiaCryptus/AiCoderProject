import {Vector3} from './GameTypes';

export enum UnitRole {
    SCOUT = 'scout',
    HEAVY = 'heavy',
    MEDIC = 'medic',
    ENGINEER = 'engineer',
    SUPPORT = 'support'
}

export enum UnitBreed {
    SIAMESE = 'siamese',
    MAINE_COON = 'maineCoon',
    PERSIAN = 'persian',
    RUSSIAN_BLUE = 'russianBlue',
    SCOTTISH_FOLD = 'scottishFold'
}

export enum UnitStatus {
    IDLE = 'idle',
    MOVING = 'moving',
    ATTACKING = 'attacking',
    HEALING = 'healing',
    BUILDING = 'building',
    SCOUTING = 'scouting',
    DEFENDING = 'defending'
}

export interface UnitStats {
    health: number;
    speed: number;
    attack: number;
    defense: number;
    range: number;
    stamina: number;
}

export interface UnitAbility {
    id: string;
    name: string;
    description: string;
    cooldown: number;
    currentCooldown: number;
    effect: (unit: Unit) => void;
}

export interface UnitEquipment {
    weapon?: string;
    armor?: string;
    accessory?: string;
}

export interface Unit {
    id: string;
    name: string;
    role: UnitRole;
    breed: UnitBreed;
    level: number;
    experience: number;
    position: Vector3;
    rotation: Vector3;
    status: UnitStatus;
    owner: string;
    stats: UnitStats;
    abilities: UnitAbility[];
    equipment: UnitEquipment;
    effects: string[];
}