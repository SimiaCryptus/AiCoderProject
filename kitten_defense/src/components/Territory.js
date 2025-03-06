import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { TerritoryType } from '../types/TerritoryTypes';
export const Territory = ({ territory, onCapture }) => {
    const meshRef = useRef(null);
    const materialRef = useRef(null);
    // Territory appearance based on type
    const getTerritoryColor = (type, owner) => {
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
        if (!meshRef.current || !materialRef.current)
            return;
        // Pulse effect for contested territories
        if (territory.contestedBy.length > 0) {
            const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 0.9;
            meshRef.current.scale.setScalar(pulse);
        }
        // Capture progress indicator
        if (territory.captureProgress > 0) {
            const progress = territory.captureProgress / 100;
            materialRef.current.emissiveIntensity = progress;
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
    return (_jsxs("group", { position: [territory.position.x, territory.position.y, territory.position.z], children: [_jsxs("mesh", { ref: meshRef, children: [_jsx("cylinderGeometry", { args: [5, 5, 0.2, 32] }), _jsx("meshStandardMaterial", { ref: materialRef, color: getTerritoryColor(territory.type, territory.owner), transparent: true, opacity: 0.8, emissive: "#ffffff", emissiveIntensity: 0 })] }), territory.influenceZones.map((zone, index) => (_jsxs("mesh", { position: [zone.position.x, 0.1, zone.position.z], children: [_jsx("ringGeometry", { args: [0, zone.radius, 32] }), _jsx("meshBasicMaterial", { color: zone.owner ? getTerritoryColor(territory.type, zone.owner) : '#ffffff', transparent: true, opacity: 0.3 })] }, index))), territory.structures.map((structure) => (_jsxs("mesh", { position: [structure.position.x, structure.position.y, structure.position.z], children: [_jsx("boxGeometry", { args: [1, 1, 1] }), _jsx("meshStandardMaterial", { color: getTerritoryColor(territory.type, structure.owner) })] }, structure.id)))] }));
};
