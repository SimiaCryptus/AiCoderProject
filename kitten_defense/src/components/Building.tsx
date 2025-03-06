import {useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import {Building as BuildingType, BuildingStatus} from '../types/BuildingTypes';

interface BuildingProps {
    building: BuildingType;
}

export const Building = ({building}: BuildingProps) => {
    const meshRef = useRef<THREE.Mesh>(null);


    useFrame(() => {
        // Handle building animations and status effects
        if (building.status === BuildingStatus.CONSTRUCTION) {
            // Construction animation
        } else if (building.status === BuildingStatus.DAMAGED) {
            // Damage effects
        }
    });

    return (
        <group position={[building.position.x, building.position.y, building.position.z]}>
            <mesh ref={meshRef}>
                {/* Building model and modules */}
            </mesh>
            {building.modules.map(module => (
                <mesh key={module.id} position={[module.position.x, module.position.y, module.position.z]}>
                    {/* Module model */}
                </mesh>
            ))}
        </group>
    );
};