import { ResourceType } from '../types/TerritoryTypes';
import { UnitRole } from '../types/UnitTypes';
export class TerritorySystem {
    groupUnitsByOwner(units) {
        const groups = new Map();
        units.forEach(unit => {
            const owner = unit.owner;
            if (!groups.has(owner)) {
                groups.set(owner, []);
            }
            groups.get(owner)?.push(unit);
        });
        return groups;
    }
    calculateDominantForce(zones) {
        const totalStrength = new Map();
        zones.forEach(zone => {
            if (zone.owner) {
                const current = totalStrength.get(zone.owner) || 0;
                totalStrength.set(zone.owner, current + zone.strength);
            }
        });
        let dominantForce = null;
        let maxStrength = 0;
        totalStrength.forEach((strength, owner) => {
            if (strength > maxStrength) {
                maxStrength = strength;
                dominantForce = owner;
            }
        });
        return dominantForce;
    }
    checkOwnershipChange(territory) {
        // Implement ownership change logic based on control points and influence
        if (territory.captureProgress >= this.config.captureTime) {
            const dominantForce = this.calculateDominantForce(territory.influenceZones);
            if (dominantForce && dominantForce !== territory.owner) {
                this.captureTerritory(territory, dominantForce);
            }
        }
    }
    addResourcesToStorage(territory, resourceType, amount) {
        const storage = territory.resources.storages.find(s => s.type === resourceType);
        if (storage) {
            storage.current = Math.min(storage.current + amount, storage.capacity);
        }
    }
    getCollectionPointAmount(resourceType) {
        // Define base amounts for different resource types
        const baseAmounts = {
            [ResourceType.TUNA]: 100,
            [ResourceType.MILK]: 75,
            [ResourceType.CATNIP]: 50,
            [ResourceType.YARN]: 150,
            [ResourceType.FISH]: 125
        };
        return baseAmounts[resourceType] || 50;
    }
    constructor(config) {
        Object.defineProperty(this, "territories", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.config = config;
    }
    createTerritory(id, position, type) {
        const territory = {
            id,
            position,
            type,
            owner: null,
            controlPoints: 0,
            influenceZones: [],
            resources: {
                generators: [],
                storages: [],
                collectionPoints: []
            },
            structures: [],
            contestedBy: [],
            captureProgress: 0
        };
        this.territories.set(id, territory);
        return territory;
    }
    updateTerritory(territoryId, units) {
        const territory = this.territories.get(territoryId);
        if (!territory)
            return;
        // Update influence zones based on unit presence
        this.updateInfluenceZones(territory, units);
        // Update capture progress
        this.updateCaptureProgress(territory, units);
        // Update resource generation
        this.updateResources(territory);
        // Check for territory ownership changes
        this.checkOwnershipChange(territory);
    }
    updateInfluenceZones(territory, units) {
        const newInfluenceZones = [];
        // Group units by owner
        const unitsByOwner = this.groupUnitsByOwner(units);
        // Calculate influence for each owner's units
        for (const [owner, ownerUnits] of unitsByOwner) {
            const influence = this.calculateInfluence(territory.position, ownerUnits);
            if (influence.strength > 0) {
                newInfluenceZones.push({
                    position: influence.position,
                    radius: this.config.influenceRadius,
                    strength: influence.strength,
                    owner
                });
            }
        }
        territory.influenceZones = newInfluenceZones;
    }
    updateCaptureProgress(territory, _units) {
        const dominantForce = this.calculateDominantForce(territory.influenceZones);
        if (!dominantForce) {
            territory.captureProgress = Math.max(0, territory.captureProgress - 1);
            return;
        }
        if (dominantForce !== territory.owner) {
            territory.captureProgress += 1;
            if (territory.captureProgress >= this.config.captureTime) {
                this.captureTerritory(territory, dominantForce);
            }
        }
    }
    updateResources(territory) {
        // Update resource generators
        for (const generator of territory.resources.generators) {
            if (generator.active && territory.owner) {
                const production = this.config.resourceGenerationRate[generator.type];
                this.addResourcesToStorage(territory, generator.type, production);
            }
        }
        // Update collection points
        for (const point of territory.resources.collectionPoints) {
            if (point.amount <= 0 && point.respawnTime > 0) {
                point.respawnTime -= 1;
                if (point.respawnTime <= 0) {
                    point.amount = this.getCollectionPointAmount(point.resourceType);
                }
            }
        }
    }
    captureTerritory(territory, newOwner) {
        territory.owner = newOwner;
        territory.captureProgress = 0;
        territory.controlPoints = this.config.maxControlPoints;
        this.onTerritoryCapture(territory);
    }
    calculateInfluence(position, units) {
        // Calculate weighted average position and total strength
        let totalWeight = 0;
        const weightedPosition = { x: 0, y: 0, z: 0 };
        units.forEach(unit => {
            const weight = this.getUnitWeight(unit);
            totalWeight += weight;
            weightedPosition.x += unit.position.x * weight;
            weightedPosition.y += unit.position.y * weight;
            weightedPosition.z += unit.position.z * weight;
        });
        if (totalWeight === 0) {
            return { position, strength: 0 };
        }
        return {
            position: {
                x: weightedPosition.x / totalWeight,
                y: weightedPosition.y / totalWeight,
                z: weightedPosition.z / totalWeight
            },
            strength: totalWeight
        };
    }
    getUnitWeight(unit) {
        // Define unit type weights
        const weights = {
            [UnitRole.HEAVY]: 2,
            [UnitRole.SCOUT]: 0.5,
            [UnitRole.MEDIC]: 1,
            [UnitRole.ENGINEER]: 1,
            [UnitRole.SUPPORT]: 1
        };
        return weights[unit.role] || 1;
    }
    onTerritoryCapture(territory) {
        // Emit territory capture event
        const event = new CustomEvent('territoryCaptured', {
            detail: {
                territoryId: territory.id,
                newOwner: territory.owner,
                type: territory.type
            }
        });
        window.dispatchEvent(event);
    }
    // Utility methods
    getTerritory(id) {
        return this.territories.get(id);
    }
    getTerritoryByPosition(position) {
        // Find territory closest to position
        return Array.from(this.territories.values()).find(t => this.isPositionInTerritory(position, t));
    }
    isPositionInTerritory(position, territory) {
        const distance = this.calculateDistance(position, territory.position);
        return distance <= this.config.influenceRadius;
    }
    calculateDistance(pos1, pos2) {
        return Math.sqrt(Math.pow(pos2.x - pos1.x, 2) +
            Math.pow(pos2.y - pos1.y, 2) +
            Math.pow(pos2.z - pos1.z, 2));
    }
}
