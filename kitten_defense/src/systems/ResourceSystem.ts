import {Vector3} from '../types/GameTypes';
import {create} from 'zustand';
import {
    ResourceGenerator,
    ResourceNode,
    ResourceStorage,
    ResourceTransaction,
    ResourceType
} from '../types/ResourceTypes';

interface ResourceState {
    nodes: Map<string, ResourceNode>;
    generators: Map<string, ResourceGenerator>;
    storage: Map<string, ResourceStorage>;
    transactions: ResourceTransaction[];
}

interface ResourceStore {
    state: ResourceState;
    addNode: (node: ResourceNode) => void;
    addGenerator: (generator: ResourceGenerator) => void;
    addStorage: (storage: ResourceStorage) => void;
    updateNode: (nodeId: string, updates: Partial<ResourceNode>) => void;
    updateGenerator: (generatorId: string, updates: Partial<ResourceGenerator>) => void;
    updateStorage: (storageId: string, updates: Partial<ResourceStorage>) => void;
    recordTransaction: (transaction: ResourceTransaction) => void;
}

export const useResourceStore = create<ResourceStore>((set) => ({
    state: {
        nodes: new Map(),
        generators: new Map(),
        storage: new Map(),
        transactions: []
    },

    addNode: (node) => set((state) => ({
        state: {
            ...state.state,
            nodes: new Map(state.state.nodes).set(node.id, node)
        }
    })),

    addGenerator: (generator) => set((state) => ({
        state: {
            ...state.state,
            generators: new Map(state.state.generators).set(generator.id, generator)
        }
    })),

    addStorage: (storage) => set((state) => ({
        state: {
            ...state.state,
            storage: new Map(state.state.storage).set(storage.id, storage)
        }
    })),

    updateNode: (nodeId, updates) => set((state) => {
        const nodes = new Map(state.state.nodes);
        const node = nodes.get(nodeId);
        if (node) {
            nodes.set(nodeId, {...node, ...updates});
        }
        return {state: {...state.state, nodes}};
    }),

    updateGenerator: (generatorId, updates) => set((state) => {
        const generators = new Map(state.state.generators);
        const generator = generators.get(generatorId);
        if (generator) {
            generators.set(generatorId, {...generator, ...updates});
        }
        return {state: {...state.state, generators}};
    }),

    updateStorage: (storageId, updates) => set((state) => {
        const storage = new Map(state.state.storage);
        const facility = storage.get(storageId);
        if (facility) {
            storage.set(storageId, {...facility, ...updates});
        }
        return {state: {...state.state, storage}};
    }),

    recordTransaction: (transaction) => set((state) => ({
        state: {
            ...state.state,
            transactions: [...state.state.transactions, transaction]
        }
    }))
}));

export class ResourceSystem {
    private lastUpdate: number = Date.now();

    update() {
        const currentTime = Date.now();
        const deltaTime = (currentTime - this.lastUpdate) / 1000; // Convert to seconds
        this.lastUpdate = currentTime;

        this.updateResourceNodes(deltaTime);
        this.updateResourceGeneration(deltaTime);
        this.updateStorageFacilities();
    }

    private updateResourceNodes(deltaTime: number) {
        const {state, updateNode} = useResourceStore.getState();

        state.nodes.forEach((node) => {
            if (node.isActive && node.amount < node.maxAmount) {
                const regeneratedAmount = node.regenerationRate * deltaTime;
                const newAmount = Math.min(node.maxAmount, node.amount + regeneratedAmount);

                updateNode(node.id, {
                    amount: newAmount,
                    lastUpdate: Date.now()
                });
            }
        });
    }

    private updateResourceGeneration(deltaTime: number) {
        const {state, updateStorage, recordTransaction} = useResourceStore.getState();

        state.generators.forEach((generator) => {
            if (!generator.isOperational) return;

            const production = generator.productionRate * generator.efficiency * deltaTime;
            const storage = this.findNearestStorage(generator.position);

            if (storage) {
                const currentAmount = storage.stored[generator.type] || 0;
                const capacity = storage.capacity[generator.type] || 0;
                const storable = Math.min(production, capacity - currentAmount);

                if (storable > 0) {
                    updateStorage(storage.id, {
                        stored: {
                            ...storage.stored,
                            [generator.type]: currentAmount + storable
                        }
                    });

                    recordTransaction({
                        id: crypto.randomUUID(),
                        type: 'production',
                        resources: {[generator.type]: storable},
                        source: generator.id,
                        destination: storage.id,
                        timestamp: Date.now()
                    });
                }
            }
        });
    }

    private updateStorageFacilities() {
        const {state} = useResourceStore.getState();

        state.storage.forEach((storage) => {
            // Validate storage contents
            Object.entries(storage.stored).forEach(([resourceType, amount]) => {
                if (amount < 0) {
                    const type = resourceType as keyof typeof ResourceType;
                    storage.stored[ResourceType[type]] = 0;
                }
            });
        });
    }

    private findNearestStorage(position: Vector3): ResourceStorage | null {
        const {state} = useResourceStore.getState();
        let nearest: ResourceStorage | null = null;
        let minDistance = Infinity;

        state.storage.forEach((storage) => {
            const distance = this.calculateDistance(position, storage.position);
            if (distance < minDistance) {
                minDistance = distance;
                nearest = storage;
            }
        });

        return nearest;
    }

    private calculateDistance(pos1: Vector3, pos2: Vector3): number {
        const dx = pos2.x - pos1.x;
        const dy = pos2.y - pos1.y;
        const dz = pos2.z - pos1.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
}