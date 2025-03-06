import {Vector2} from 'three';

export interface EffectsSettings {
    vhsIntensity: number;
    crtCurvature: number;
    scanlineIntensity: number;
    noiseIntensity: number;
    chromaticAberration: number;
    bloomIntensity: number;
    vignetteIntensity: number;
    staticAmount: number;
}

const DEFAULT_SETTINGS: EffectsSettings = {
    vhsIntensity: 0.3,
    crtCurvature: 2.0,
    scanlineIntensity: 0.15,
    noiseIntensity: 0.1,
    chromaticAberration: 0.005,
    bloomIntensity: 0.5,
    vignetteIntensity: 0.4,
    staticAmount: 0.03
};

export class EffectsSystem {
    private settings: EffectsSettings;
    private time: number = 0;

    constructor(settings: Partial<EffectsSettings> = {}) {
        this.settings = {...DEFAULT_SETTINGS, ...settings};
    }

    update(deltaTime: number) {
        this.time += deltaTime;
        // Update time-based effects
        this.updateVHSEffect();
        this.updateStaticNoise();
    }

    getUniforms() {
        return {
            time: this.time,
            vhsIntensity: this.settings.vhsIntensity,
            crtCurvature: this.settings.crtCurvature,
            scanlineIntensity: this.settings.scanlineIntensity,
            noiseIntensity: this.settings.noiseIntensity,
            chromaticAberration: this.settings.chromaticAberration,
            bloomIntensity: this.settings.bloomIntensity,
            vignetteIntensity: this.settings.vignetteIntensity,
            resolution: new Vector2()
        };
    }

    private updateVHSEffect() {
        // Calculate VHS tracking and distortion based on time
        const trackingOffset = Math.sin(this.time * 2) * this.settings.vhsIntensity;
        return trackingOffset;
    }

    private updateStaticNoise() {
        // Generate random static noise
        return Math.random() * this.settings.staticAmount;
    }
}