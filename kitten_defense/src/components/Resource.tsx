import {useEffect, useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import {ResourceNode, ResourceType} from '../types/ResourceTypes';

interface ResourceProps {
    node: ResourceNode;
    onCollect?: (amount: number) => void;
}

const resourceColors = {
    [ResourceType.TUNA]: '#FF9999',
    [ResourceType.MILK]: '#FFFFFF',
    [ResourceType.CATNIP]: '#90EE90',
    [ResourceType.YARN]: '#FFB6C1',
    [ResourceType.FISH]: '#ADD8E6'
};

export const Resource = ({node, onCollect}: ResourceProps) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const hovered = useRef(false);

    useEffect(() => {
        document.body.style.cursor = hovered.current ? 'pointer' : 'auto';
    }, [hovered.current]);

    useFrame((state, delta) => {
        if (meshRef.current) {
            // Add floating animation
            meshRef.current.position.y += Math.sin(state.clock.elapsedTime) * 0.002;

            // Add rotation
            meshRef.current.rotation.y += delta * 0.5;
        }
    });

    return (
        <mesh
            ref={meshRef}
            position={[node.position.x, node.position.y, node.position.z]}
            onPointerOver={() => (hovered.current = true)}
            onPointerOut={() => (hovered.current = false)}
            onClick={() => onCollect && node.amount > 0 && onCollect(node.amount)}
        >
            <sphereGeometry args={[0.5, 32, 32]}/>
            <meshStandardMaterial
                color={resourceColors[node.type]}
                emissive={resourceColors[node.type]}
                emissiveIntensity={0.2}
                transparent
                opacity={0.8}
            />
            {/* Resource amount indicator */}
            <sprite scale={[1, 1, 1]} position={[0, 1.2, 0]}>
                <spriteMaterial attach="material" transparent opacity={0.8}>
                    <canvasTexture attach="map"/>
                </spriteMaterial>
            </sprite>
        </mesh>
    );
};