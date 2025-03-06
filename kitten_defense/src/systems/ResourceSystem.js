import { create } from 'zustand';
import { ResourceType } from '../types/ResourceTypes';
export const useResourceStore = create((set) => ({
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
            nodes.set(nodeId, { ...node, ...updates });
        }
        return { state: { ...state.state, nodes } };
    }),
    updateGenerator: (generatorId, updates) => set((state) => {
        const generators = new Map(state.state.generators);
        const generator = generators.get(generatorId);
        if (generator) {
            generators.set(generatorId, { ...generator, ...updates });
        }
        return { state: { ...state.state, generators } };
    }),
    updateStorage: (storageId, updates) => set((state) => {
        const storage = new Map(state.state.storage);
        const facility = storage.get(storageId);
        if (facility) {
            storage.set(storageId, { ...facility, ...updates });
        }
        return { state: { ...state.state, storage } };
    }),
    recordTransaction: (transaction) => set((state) => ({
        state: {
            ...state.state,
            transactions: [...state.state.transactions, transaction]
        }
    }))
}));
export class ResourceSystem {
    constructor() {
        Object.defineProperty(this, "lastUpdate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: Date.now()
        });
    }
    update() {
        const currentTime = Date.now();
        const deltaTime = (currentTime - this.lastUpdate) / 1000; // Convert to seconds
        this.lastUpdate = currentTime;
        this.updateResourceNodes(deltaTime);
        this.updateResourceGeneration(deltaTime);
        this.updateStorageFacilities();
    }
    updateResourceNodes(deltaTime) {
        const { state, updateNode } = useResourceStore.getState();
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
    updateResourceGeneration(deltaTime) {
        const { state, updateStorage, recordTransaction } = useResourceStore.getState();
        state.generators.forEach((generator) => {
            if (!generator.isOperational)
                return;
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
                        resources: { [generator.type]: storable },
                        source: generator.id,
                        destination: storage.id,
                        timestamp: Date.now()
                    });
                }
            }
        });
    }
    updateStorageFacilities() {
        const { state } = useResourceStore.getState();
        state.storage.forEach((storage) => {
            // Validate storage contents
            Object.entries(storage.stored).forEach(([resourceType, amount]) => {
                if (amount < 0) {
                    const type = resourceType;
                    storage.stored[ResourceType[type]] = 0;
                }
            });
        });
    }
    findNearestStorage(position) {
        const { state } = useResourceStore.getState();
        let nearest = null;
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
    calculateDistance(pos1, pos2) {
        const dx = pos2.x - pos1.x;
        const dy = pos2.y - pos1.y;
        const dz = pos2.z - pos1.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
}
