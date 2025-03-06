import {useEffect, useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import {TerritoryState, TerritoryType} from '../types/TerritoryTypes';
import {MeshStandardMaterial} from 'three';

interface TerritoryProps {
    territory: TerritoryState;
    onCapture?: (territoryId: string, newOwner: string) => void;
}

export const Territory: React.FC<TerritoryProps> = ({territory, onCapture}) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<MeshStandardMaterial>(null);

    // Territory appearance based on type
    const getTerritoryColor = (type: TerritoryType, owner: string | null) => {
        const baseColors = {
            [TerritoryType.RESIDENTIAL]: '#8bc34a',
            [TerritoryType.INDUSTRIAL]: '#ff9800',
            [TerritoryType.SUPPLY]: '#2196f3',
            [TerritoryType.STRATEGIC]: '#f44336'
        };

        const baseColor = baseColors[type] || '#ffffff';
        return owner ? `${baseColor}cc` : `${baseColor}66`;
    };

    // Update visual effects based on territory state
    useFrame((state) => {
        if (!meshRef.current || !materialRef.current) return;

        // Pulse effect for contested territories
        if (territory.contestedBy.length > 0) {
            const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 0.9;
            meshRef.current.scale.setScalar(pulse);
        }

        // Capture progress indicator
        if (territory.captureProgress > 0) {
            const progress = territory.captureProgress / 100;
            (materialRef.current as THREE.MeshStandardMaterial).emissiveIntensity = progress;
        }
    });

    useEffect(() => {
        const handleCapture = () => {
            if (onCapture && territory.owner) {
                onCapture(territory.id, territory.owner);
            }
        };

        window.addEventListener('territoryCaptured', handleCapture);
        return () => window.removeEventListener('territoryCaptured', handleCapture);
    }, [territory, onCapture]);

    return (
        <group position={[territory.position.x, territory.position.y, territory.position.z]}>
            <mesh ref={meshRef}>
                <cylinderGeometry args={[5, 5, 0.2, 32]}/>
                <meshStandardMaterial
                    ref={materialRef}
                    color={getTerritoryColor(territory.type, territory.owner)}
                    transparent
                    opacity={0.8}
                    emissive="#ffffff"
                    emissiveIntensity={0}
                />
            </mesh>

            {/* Influence Zones Visualization */}
            {territory.influenceZones.map((zone, index) => (
                <mesh key={index} position={[zone.position.x, 0.1, zone.position.z]}>
                    <ringGeometry args={[0, zone.radius, 32]}/>
                    <meshBasicMaterial
                        color={zone.owner ? getTerritoryColor(territory.type, zone.owner) : '#ffffff'}
                        transparent
                        opacity={0.3}
                    />
                </mesh>
            ))}

            {/* Structures */}
            {territory.structures.map((structure) => (
                <mesh key={structure.id} position={[structure.position.x, structure.position.y, structure.position.z]}>
                    <boxGeometry args={[1, 1, 1]}/>
                    <meshStandardMaterial color={getTerritoryColor(territory.type, structure.owner)}/>
                </mesh>
            ))}
        </group>
    );
};