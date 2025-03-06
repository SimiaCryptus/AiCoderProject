import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useUnitStore } from '../systems/UnitSystem';
export const Unit = ({ unit }) => {
    const { updateUnit } = useUnitStore();
    // Load the appropriate cat model based on breed
    const { scene } = useGLTF(`/models/cats/${unit.breed.toLowerCase()}.glb`);
    useFrame((_, delta) => {
        // Handle unit animations and movement
        if (unit.status === 'moving') {
            // Implement movement logic
        }
        // Update abilities cooldowns
        const updatedAbilities = unit.abilities.map(ability => ({
            ...ability,
            currentCooldown: Math.max(0, ability.currentCooldown - delta)
        }));
        updateUnit(unit.id, { abilities: updatedAbilities });
    });
    return (_jsxs("group", { position: [unit.position.x, unit.position.y, unit.position.z], rotation: [unit.rotation.x, unit.rotation.y, unit.rotation.z], children: [_jsx("primitive", { object: scene.clone() }), unit.effects.map((effect, index) => (_jsx(StatusEffect, { type: effect }, index)))] }));
};
const StatusEffect = ({ type }) => {
    // Implement various visual effects (healing, buffs, etc.)
    return _jsx("group", { "data-effect-type": type });
};
