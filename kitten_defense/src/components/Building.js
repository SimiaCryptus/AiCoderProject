import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { BuildingStatus } from '../types/BuildingTypes';
export const Building = ({ building }) => {
    const meshRef = useRef(null);
    useFrame(() => {
        // Handle building animations and status effects
        if (building.status === BuildingStatus.CONSTRUCTION) {
            // Construction animation
        }
        else if (building.status === BuildingStatus.DAMAGED) {
            // Damage effects
        }
    });
    return (_jsxs("group", { position: [building.position.x, building.position.y, building.position.z], children: [_jsx("mesh", { ref: meshRef }), building.modules.map(module => (_jsx("mesh", { position: [module.position.x, module.position.y, module.position.z] }, module.id)))] }));
};
