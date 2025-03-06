import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { ResourceType } from '../types/ResourceTypes';
const resourceColors = {
    [ResourceType.TUNA]: '#FF9999',
    [ResourceType.MILK]: '#FFFFFF',
    [ResourceType.CATNIP]: '#90EE90',
    [ResourceType.YARN]: '#FFB6C1',
    [ResourceType.FISH]: '#ADD8E6'
};
export const Resource = ({ node, onCollect }) => {
    const meshRef = useRef(null);
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
    return (_jsxs("mesh", { ref: meshRef, position: [node.position.x, node.position.y, node.position.z], onPointerOver: () => (hovered.current = true), onPointerOut: () => (hovered.current = false), onClick: () => onCollect && node.amount > 0 && onCollect(node.amount), children: [_jsx("sphereGeometry", { args: [0.5, 32, 32] }), _jsx("meshStandardMaterial", { color: resourceColors[node.type], emissive: resourceColors[node.type], emissiveIntensity: 0.2, transparent: true, opacity: 0.8 }), _jsx("sprite", { scale: [1, 1, 1], position: [0, 1.2, 0], children: _jsx("spriteMaterial", { attach: "material", transparent: true, opacity: 0.8, children: _jsx("canvasTexture", { attach: "map" }) }) })] }));
};
