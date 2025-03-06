import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { BuildingType, BuildingStatus, ModuleType, BuildingSize } from '../types/BuildingTypes';
import { useGameStore } from '../engine/GameEngine';
const buildingTemplates = {
    [BuildingType.CAT_CONDO]: {
        type: BuildingType.CAT_CONDO,
        size: BuildingSize.LARGE,
        baseCost: { tuna: 100, yarn: 50, catnip: 20 },
        baseStats: {
            health: 1000,
            defense: 50,
            capacity: 10,
            range: 0,
            productionRate: 0
        },
        requirements: {
            level: 1,
            prerequisites: [],
            territory: true
        },
        allowedModules: [ModuleType.DEFENSE, ModuleType.STORAGE],
        maxModules: 4
    },
    [BuildingType.SCRATCHING_POST]: {
        type: BuildingType.SCRATCHING_POST,
        size: BuildingSize.MEDIUM,
        baseCost: { tuna: 50, yarn: 100, catnip: 10 },
        baseStats: {
            health: 500,
            defense: 20,
            capacity: 0,
            range: 5,
            productionRate: 0.1
        },
        requirements: {
            level: 1,
            prerequisites: [],
            territory: true
        },
        allowedModules: [ModuleType.UTILITY],
        maxModules: 2
    },
    [BuildingType.FOOD_BOWL]: {
        type: BuildingType.FOOD_BOWL,
        size: BuildingSize.SMALL,
        baseCost: { tuna: 30, yarn: 20, catnip: 50 },
        baseStats: {
            health: 200,
            defense: 10,
            capacity: 100,
            range: 3,
            productionRate: 0.5
        },
        requirements: {
            level: 1,
            prerequisites: [],
            territory: true
        },
        allowedModules: [ModuleType.PRODUCTION, ModuleType.STORAGE],
        maxModules: 2
    },
    [BuildingType.WATCH_TOWER]: {
        type: BuildingType.WATCH_TOWER,
        size: BuildingSize.MEDIUM,
        baseCost: { tuna: 80, yarn: 60, catnip: 30 },
        baseStats: {
            health: 400,
            defense: 40,
            capacity: 0,
            range: 10,
            productionRate: 0
        },
        requirements: {
            level: 2,
            prerequisites: [BuildingType.CAT_CONDO],
            territory: true
        },
        allowedModules: [ModuleType.DEFENSE, ModuleType.UTILITY],
        maxModules: 3
    },
    [BuildingType.TUNNEL]: {
        type: BuildingType.TUNNEL,
        size: BuildingSize.SMALL,
        baseCost: { tuna: 40, yarn: 80, catnip: 20 },
        baseStats: {
            health: 300,
            defense: 30,
            capacity: 5,
            range: 2,
            productionRate: 0
        },
        requirements: {
            level: 1,
            prerequisites: [],
            territory: false
        },
        allowedModules: [ModuleType.UTILITY],
        maxModules: 2
    },
    [BuildingType.MEDICAL_STATION]: {
        type: BuildingType.MEDICAL_STATION,
        size: BuildingSize.MEDIUM,
        baseCost: { tuna: 120, yarn: 70, catnip: 100 },
        baseStats: {
            health: 600,
            defense: 20,
            capacity: 20,
            range: 6,
            productionRate: 0.3
        },
        requirements: {
            level: 2,
            prerequisites: [BuildingType.FOOD_BOWL],
            territory: true
        },
        allowedModules: [ModuleType.UTILITY, ModuleType.STORAGE],
        maxModules: 3
    },
    [BuildingType.RESOURCE_PROCESSOR]: {
        type: BuildingType.RESOURCE_PROCESSOR,
        size: BuildingSize.LARGE,
        baseCost: { tuna: 150, yarn: 150, catnip: 80 },
        baseStats: {
            health: 800,
            defense: 30,
            capacity: 50,
            range: 4,
            productionRate: 1.0
        },
        requirements: {
            level: 3,
            prerequisites: [BuildingType.FOOD_BOWL],
            territory: true
        },
        allowedModules: [ModuleType.PRODUCTION, ModuleType.STORAGE],
        maxModules: 4
    },
    [BuildingType.DEFENSE_TURRET]: {
        type: BuildingType.DEFENSE_TURRET,
        size: BuildingSize.SMALL,
        baseCost: { tuna: 90, yarn: 60, catnip: 40 },
        baseStats: {
            health: 400,
            defense: 60,
            capacity: 0,
            range: 8,
            productionRate: 0
        },
        requirements: {
            level: 2,
            prerequisites: [BuildingType.WATCH_TOWER],
            territory: true
        },
        allowedModules: [ModuleType.DEFENSE],
        maxModules: 2
    },
    [BuildingType.STORAGE]: {
        type: BuildingType.STORAGE,
        size: BuildingSize.MEDIUM,
        baseCost: { tuna: 70, yarn: 90, catnip: 30 },
        baseStats: {
            health: 700,
            defense: 20,
            capacity: 200,
            range: 0,
            productionRate: 0
        },
        requirements: {
            level: 1,
            prerequisites: [],
            territory: true
        },
        allowedModules: [ModuleType.STORAGE],
        maxModules: 6
    },
    [BuildingType.TRAINING_FACILITY]: {
        type: BuildingType.TRAINING_FACILITY,
        size: BuildingSize.LARGE,
        baseCost: { tuna: 200, yarn: 150, catnip: 100 },
        baseStats: {
            health: 900,
            defense: 40,
            capacity: 30,
            range: 5,
            productionRate: 0.4
        },
        requirements: {
            level: 3,
            prerequisites: [BuildingType.CAT_CONDO],
            territory: true
        },
        allowedModules: [ModuleType.UTILITY, ModuleType.DEFENSE],
        maxModules: 4
    }
    // Add other building templates...
};
export const useBuildingStore = create((set, get) => ({
    buildings: [],
    templates: buildingTemplates,
    addBuilding: (type, position, owner) => {
        const template = buildingTemplates[type];
        if (!template || !get().canBuild(type, position, owner))
            return null;
        const gameStore = useGameStore.getState();
        const resources = gameStore.gameState.resources;
        // Check resources
        if (resources.tuna < template.baseCost.tuna ||
            resources.yarn < template.baseCost.yarn ||
            resources.catnip < template.baseCost.catnip) {
            return null;
        }
        // Deduct resources
        gameStore.updateResources({
            tuna: resources.tuna - template.baseCost.tuna,
            yarn: resources.yarn - template.baseCost.yarn,
            catnip: resources.catnip - template.baseCost.catnip
        });
        const newBuilding = {
            id: nanoid(),
            type,
            position,
            rotation: { x: 0, y: 0, z: 0 },
            size: template.size,
            owner,
            health: template.baseStats.health,
            level: 1,
            stats: { ...template.baseStats },
            status: BuildingStatus.CONSTRUCTION,
            connectedBuildings: [],
            modules: []
        };
        set(state => ({
            buildings: [...state.buildings, newBuilding]
        }));
        return newBuilding;
    },
    removeBuilding: (id) => {
        set(state => ({
            buildings: state.buildings.filter(b => b.id !== id)
        }));
    },
    upgradeBuilding: (id) => {
        const building = get().buildings.find(b => b.id === id);
        if (!building || building.status !== BuildingStatus.OPERATIONAL)
            return false;
        const template = buildingTemplates[building.type];
        const upgradeCost = {
            tuna: template.baseCost.tuna * building.level * 1.5,
            yarn: template.baseCost.yarn * building.level * 1.5,
            catnip: template.baseCost.catnip * building.level * 1.5
        };
        const gameStore = useGameStore.getState();
        const resources = gameStore.gameState.resources;
        if (resources.tuna < upgradeCost.tuna ||
            resources.yarn < upgradeCost.yarn ||
            resources.catnip < upgradeCost.catnip) {
            return false;
        }
        // Deduct resources and upgrade
        gameStore.updateResources({
            tuna: resources.tuna - upgradeCost.tuna,
            yarn: resources.yarn - upgradeCost.yarn,
            catnip: resources.catnip - upgradeCost.catnip
        });
        set(state => ({
            buildings: state.buildings.map(b => {
                if (b.id === id) {
                    return {
                        ...b,
                        level: b.level + 1,
                        stats: {
                            health: b.stats.health * 1.2,
                            defense: b.stats.defense * 1.2,
                            capacity: b.stats.capacity * 1.2,
                            range: b.stats.range * 1.1,
                            productionRate: b.stats.productionRate * 1.2
                        },
                        status: BuildingStatus.UPGRADING
                    };
                }
                return b;
            })
        }));
        return true;
    },
    addModule: (buildingId, moduleType, position) => {
        const building = get().buildings.find(b => b.id === buildingId);
        if (!building)
            return false;
        const template = buildingTemplates[building.type];
        if (!template.allowedModules.includes(moduleType) ||
            building.modules.length >= template.maxModules) {
            return false;
        }
        const newModule = {
            id: nanoid(),
            type: moduleType,
            position,
            status: BuildingStatus.CONSTRUCTION,
            stats: {
                // Module-specific stat boosts
                health: moduleType === ModuleType.DEFENSE ? 200 : 0,
                defense: moduleType === ModuleType.DEFENSE ? 20 : 0,
                capacity: moduleType === ModuleType.STORAGE ? 5 : 0,
                range: moduleType === ModuleType.UTILITY ? 2 : 0,
                productionRate: moduleType === ModuleType.PRODUCTION ? 0.2 : 0
            }
        };
        set(state => ({
            buildings: state.buildings.map(b => {
                if (b.id === buildingId) {
                    return {
                        ...b,
                        modules: [...b.modules, newModule]
                    };
                }
                return b;
            })
        }));
        return true;
    },
    damageBuilding: (id, amount) => {
        set(state => ({
            buildings: state.buildings.map(b => {
                if (b.id === id) {
                    const newHealth = Math.max(0, b.health - amount);
                    return {
                        ...b,
                        health: newHealth,
                        status: newHealth === 0 ? BuildingStatus.DESTROYED :
                            newHealth < b.stats.health / 2 ? BuildingStatus.DAMAGED :
                                BuildingStatus.OPERATIONAL
                    };
                }
                return b;
            })
        }));
    },
    repairBuilding: (id, amount) => {
        set(state => ({
            buildings: state.buildings.map(b => {
                if (b.id === id && b.status !== BuildingStatus.DESTROYED) {
                    const newHealth = Math.min(b.stats.health, b.health + amount);
                    return {
                        ...b,
                        health: newHealth,
                        status: newHealth === b.stats.health ? BuildingStatus.OPERATIONAL :
                            BuildingStatus.DAMAGED
                    };
                }
                return b;
            })
        }));
    },
    getBuildingsByOwner: (owner) => {
        return get().buildings.filter(b => b.owner === owner);
    },
    getBuildingsByType: (type) => {
        return get().buildings.filter(b => b.type === type);
    },
    canBuild: (type, position, owner) => {
        const template = buildingTemplates[type];
        if (!template)
            return false;
        // Check territory control
        if (template.requirements.territory) {
            const gameStore = useGameStore.getState();
            const territory = gameStore.gameState.territories.find(t => Math.abs(t.position.x - position.x) < 10 &&
                Math.abs(t.position.z - position.z) < 10);
            if (!territory || territory.owner !== owner)
                return false;
        }
        // Check building collisions
        const buildings = get().buildings;
        const collision = buildings.some(b => Math.abs(b.position.x - position.x) < 5 &&
            Math.abs(b.position.z - position.z) < 5);
        if (collision)
            return false;
        return true;
    }
}));
