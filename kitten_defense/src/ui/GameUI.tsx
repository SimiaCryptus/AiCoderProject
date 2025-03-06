import * as React from 'react';
import {HUD} from './HUD';
import {useGameStore} from '../engine/GameEngine';
import '../styles/ui.css';

export const GameUI: React.FC = () => {
    const {gameState} = useGameStore();

    return (
        <div className="game-ui">
            <div className="vhs-overlay"/>
            <div className="scanlines"/>
            <div className="crt-effect"/>

            <HUD gameState={gameState}/>

            <div className="ui-container">
                <div className="top-bar">
                    <div className="mission-info retro-panel">
                        <h2 className="glitch-text">CURRENT MISSION</h2>
                        <p>Defend Catnip Gardens</p>
                    </div>

                    <div className="weather-info retro-panel">
                        <h3>WEATHER</h3>
                        <div className="weather-status">
                            {gameState.weather.type}
                            <span className="intensity">{gameState.weather.intensity}%</span>
                        </div>
                    </div>
                </div>

                <div className="side-panel retro-panel">
                    <div className="resources-display">
                        <h3>SUPPLIES</h3>
                        <div className="resource-item">
                            <span className="icon">🐟</span>
                            <span className="value">{gameState.resources.tuna}</span>
                        </div>
                        <div className="resource-item">
                            <span className="icon">🥛</span>
                            <span className="value">{gameState.resources.milk}</span>
                        </div>
                        <div className="resource-item">
                            <span className="icon">🧶</span>
                            <span className="value">{gameState.resources.yarn}</span>
                        </div>
                    </div>

                    <div className="unit-controls">
                        <h3>UNITS</h3>
                        {/* Unit selection and controls */}
                    </div>
                </div>

                <div className="bottom-bar retro-panel">
                    <div className="action-buttons">
                        <button className="retro-button">BUILD</button>
                        <button className="retro-button">DEPLOY</button>
                        <button className="retro-button">SCOUT</button>
                    </div>

                    <div className="mini-map">
                        {/* Mini-map implementation */}
                    </div>
                </div>
            </div>
        </div>
    );
};