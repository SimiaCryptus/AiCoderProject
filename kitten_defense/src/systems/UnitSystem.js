import { create } from 'zustand';
import { UnitRole, UnitStatus } from '../types/UnitTypes';
// Helper function to get base stats for a unit role
const getBaseStats = (role) => {
    switch (role) {
        case UnitRole.SCOUT:
            return { health: 80, speed: 12, attack: 4, defense: 3, range: 8, stamina: 10 };
        case UnitRole.HEAVY:
            return { health: 150, speed: 6, attack: 8, defense: 8, range: 3, stamina: 7 };
        case UnitRole.MEDIC:
            return { health: 90, speed: 8, attack: 3, defense: 4, range: 6, stamina: 8 };
        case UnitRole.ENGINEER:
            return { health: 100, speed: 7, attack: 5, defense: 5, range: 4, stamina: 9 };
        case UnitRole.SUPPORT:
            return { health: 85, speed: 9, attack: 4, defense: 4, range: 7, stamina: 8 };
        default:
            return { health: 100, speed: 8, attack: 5, defense: 5, range: 5, stamina: 8 };
    }
};
// Helper function to get abilities for a unit role
const getUnitAbilities = (role) => {
    switch (role) {
        case UnitRole.SCOUT:
            return [
                {
                    id: 'nightVision',
                    name: 'Night Vision',
                    description: 'Increases vision range in darkness',
                    cooldown: 30,
                    currentCooldown: 0,
                    effect: (_unit) => { }
                },
                {
                    id: 'stealthMode',
                    name: 'Stealth Mode',
                    description: 'Temporary invisibility',
                    cooldown: 45,
                    currentCooldown: 0,
                    effect: (_unit) => { }
                }
            ];
        // Add abilities for other roles...
        default:
            return [];
    }
};
export const useUnitStore = create((set, get) => ({
    units: new Map(),
    selectedUnit: null,
    addUnit: (unit) => {
        // Apply base stats and abilities if not already set
        if (!unit.stats) {
            unit.stats = getBaseStats(unit.role);
        }
        if (!unit.abilities) {
            unit.abilities = getUnitAbilities(unit.role);
        }
        set((state) => ({
            units: new Map(state.units).set(unit.id, unit)
        }));
    },
    removeUnit: (id) => {
        set((state) => {
            const newUnits = new Map(state.units);
            newUnits.delete(id);
            return { units: newUnits };
        });
    },
    updateUnit: (id, updates) => {
        set((state) => {
            const unit = state.units.get(id);
            if (!unit)
                return state;
            const updatedUnit = { ...unit, ...updates };
            return {
                units: new Map(state.units).set(id, updatedUnit)
            };
        });
    },
    selectUnit: (id) => {
        set({ selectedUnit: id });
    },
    moveUnit: (id, position) => {
        set((state) => {
            const unit = state.units.get(id);
            if (!unit)
                return state;
            const updatedUnit = {
                ...unit,
                position,
                status: UnitStatus.MOVING
            };
            return {
                units: new Map(state.units).set(id, updatedUnit)
            };
        });
    },
    performAbility: (unitId, abilityId) => {
        const unit = get().units.get(unitId);
        if (!unit)
            return;
        const ability = unit.abilities.find(a => a.id === abilityId);
        if (!ability || ability.currentCooldown > 0)
            return;
        ability.effect(unit);
        ability.currentCooldown = ability.cooldown;
    }
}));
