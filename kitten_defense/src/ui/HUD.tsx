import * as React from 'react';
import {GameState} from '../types/GameTypes';

interface HUDProps {
    gameState: GameState;
}

export const HUD: React.FC<HUDProps> = ({gameState}) => {
    return (
        <div className="hud-overlay">
            <div className="territory-info">
                <div className="control-points">
                    <div className="progress-bar">
                        <div
                            className="progress"
                            style={{width: `${calculateTerritoryControl(gameState)}%`}}
                        />
                    </div>
                    <span className="territory-label">TERRITORY CONTROL</span>
                </div>
            </div>

            <div className="alerts-container">
                {/* Dynamic alerts will be rendered here */}
            </div>

            <div className="unit-status">
                {gameState.units.map(unit => (
                    <div key={unit.id} className="unit-indicator">
                        <div className="unit-health">
                            <div
                                className="health-bar"
                                style={{width: `${unit.health}%`}}
                            />
                        </div>
                        <span className="unit-type">{unit.type}</span>
                    </div>
                ))}
            </div>

            <div className="compass">
                <div className="compass-inner">
                    <div className="compass-marker"/>
                </div>
            </div>
        </div>
    );
};

function calculateTerritoryControl(gameState: GameState): number {
    // Calculate territory control percentage
    const totalTerritories = gameState.territories.length;
    const controlledTerritories = gameState.territories.filter(t => t.owner).length;
    return (controlledTerritories / totalTerritories) * 100;
}