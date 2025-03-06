import {useFrame} from '@react-three/fiber';
import {useGLTF} from '@react-three/drei';
import {Unit as UnitType} from '../types/UnitTypes';
import {useUnitStore} from '../systems/UnitSystem';

interface UnitProps {
    unit: UnitType;
}

export const Unit = ({unit}: UnitProps) => {
    const {updateUnit} = useUnitStore();

    // Load the appropriate cat model based on breed
    const {scene} = useGLTF(`/models/cats/${unit.breed.toLowerCase()}.glb`);

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

        updateUnit(unit.id, {abilities: updatedAbilities});
    });

    return (
        <group
            position={[unit.position.x, unit.position.y, unit.position.z]}
            rotation={[unit.rotation.x, unit.rotation.y, unit.rotation.z]}
        >
            <primitive object={scene.clone()}/>
            {/* Add status effects, health bars, etc. */}
            {unit.effects.map((effect, index) => (
                <StatusEffect key={index} type={effect}/>
            ))}
        </group>
    );
};

const StatusEffect = ({type}: { type: string }) => {
    // Implement various visual effects (healing, buffs, etc.)
    return <group data-effect-type={type}/>;
};