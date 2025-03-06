import {Vector3} from '../types/GameTypes';
import {InfluenceZone, ResourceType, TerritoryConfig, TerritoryState, TerritoryType} from '../types/TerritoryTypes';
import {Unit, UnitRole} from '../types/UnitTypes';

export class TerritorySystem {
    private territories: Map<string, TerritoryState> = new Map();
    private config: TerritoryConfig;

    constructor(config: TerritoryConfig) {
        this.config = config;
    }

    createTerritory(id: string, position: Vector3, type: TerritoryType): TerritoryState {
        const territory: TerritoryState = {
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

    updateTerritory(territoryId: string, units: Unit[]): void {
        const territory = this.territories.get(territoryId);
        if (!territory) return;

        // Update influence zones based on unit presence
        this.updateInfluenceZones(territory, units);

        // Update capture progress
        this.updateCaptureProgress(territory, units);

        // Update resource generation
        this.updateResources(territory);

        // Check for territory ownership changes
        this.checkOwnershipChange(territory);
    }

    // Utility methods
    getTerritory(id: string): TerritoryState | undefined {
        return this.territories.get(id);
    }

    getTerritoryByPosition(position: Vector3): TerritoryState | undefined {
        // Find territory closest to position
        return Array.from(this.territories.values()).find(t =>
            this.isPositionInTerritory(position, t)
        );
    }

    private groupUnitsByOwner(units: Unit[]): Map<string, Unit[]> {
        const groups = new Map<string, Unit[]>();
        units.forEach(unit => {
            const owner = unit.owner;
            if (!groups.has(owner)) {
                groups.set(owner, []);
            }
            groups.get(owner)?.push(unit);
        });
        return groups;
    }

    private calculateDominantForce(zones: InfluenceZone[]): string | null {
        const totalStrength = new Map<string, number>();
        zones.forEach(zone => {
            if (zone.owner) {
                const current = totalStrength.get(zone.owner) || 0;
                totalStrength.set(zone.owner, current + zone.strength);
            }
        });
        let dominantForce: string | null = null;
        let maxStrength = 0;
        totalStrength.forEach((strength, owner) => {
            if (strength > maxStrength) {
                maxStrength = strength;
                dominantForce = owner;
            }
        });
        return dominantForce;
    }

    private checkOwnershipChange(territory: TerritoryState): void {
        // Implement ownership change logic based on control points and influence
        if (territory.captureProgress >= this.config.captureTime) {
            const dominantForce = this.calculateDominantForce(territory.influenceZones);
            if (dominantForce && dominantForce !== territory.owner) {
                this.captureTerritory(territory, dominantForce);
            }
        }
    }

    private addResourcesToStorage(territory: TerritoryState, resourceType: ResourceType, amount: number): void {
        const storage = territory.resources.storages.find(s => s.type === resourceType);
        if (storage) {
            storage.current = Math.min(storage.current + amount, storage.capacity);
        }
    }

    private getCollectionPointAmount(resourceType: ResourceType): number {
        // Define base amounts for different resource types
        const baseAmounts: Record<ResourceType, number> = {
            [ResourceType.TUNA]: 100,
            [ResourceType.MILK]: 75,
            [ResourceType.CATNIP]: 50,
            [ResourceType.YARN]: 150,
            [ResourceType.FISH]: 125
        };
        return baseAmounts[resourceType] || 50;
    }

    private updateInfluenceZones(territory: TerritoryState, units: Unit[]): void {
        const newInfluenceZones: InfluenceZone[] = [];

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

    private updateCaptureProgress(territory: TerritoryState, _units: Unit[]): void {
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

    private updateResources(territory: TerritoryState): void {
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

    private captureTerritory(territory: TerritoryState, newOwner: string): void {
        territory.owner = newOwner;
        territory.captureProgress = 0;
        territory.controlPoints = this.config.maxControlPoints;
        this.onTerritoryCapture(territory);
    }

    private calculateInfluence(position: Vector3, units: Unit[]): { position: Vector3, strength: number } {
        // Calculate weighted average position and total strength
        let totalWeight = 0;
        const weightedPosition = {x: 0, y: 0, z: 0};

        units.forEach(unit => {
            const weight = this.getUnitWeight(unit);
            totalWeight += weight;
            weightedPosition.x += unit.position.x * weight;
            weightedPosition.y += unit.position.y * weight;
            weightedPosition.z += unit.position.z * weight;
        });

        if (totalWeight === 0) {
            return {position, strength: 0};
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

    private getUnitWeight(unit: Unit): number {
        // Define unit type weights
        const weights: Record<string, number> = {
            [UnitRole.HEAVY]: 2,
            [UnitRole.SCOUT]: 0.5,
            [UnitRole.MEDIC]: 1,
            [UnitRole.ENGINEER]: 1,
            [UnitRole.SUPPORT]: 1
        };
        return weights[unit.role] || 1;
    }

    private onTerritoryCapture(territory: TerritoryState): void {
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

    private isPositionInTerritory(position: Vector3, territory: TerritoryState): boolean {
        const distance = this.calculateDistance(position, territory.position);
        return distance <= this.config.influenceRadius;
    }

    private calculateDistance(pos1: Vector3, pos2: Vector3): number {
        return Math.sqrt(
            Math.pow(pos2.x - pos1.x, 2) +
            Math.pow(pos2.y - pos1.y, 2) +
            Math.pow(pos2.z - pos1.z, 2)
        );
    }
}