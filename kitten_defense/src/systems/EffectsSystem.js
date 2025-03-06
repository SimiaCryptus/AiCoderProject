import { Vector2 } from 'three';
const DEFAULT_SETTINGS = {
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
    constructor(settings = {}) {
        Object.defineProperty(this, "settings", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "time", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        this.settings = { ...DEFAULT_SETTINGS, ...settings };
    }
    update(deltaTime) {
        this.time += deltaTime;
        // Update time-based effects
        this.updateVHSEffect();
        this.updateStaticNoise();
    }
    updateVHSEffect() {
        // Calculate VHS tracking and distortion based on time
        const trackingOffset = Math.sin(this.time * 2) * this.settings.vhsIntensity;
        return trackingOffset;
    }
    updateStaticNoise() {
        // Generate random static noise
        return Math.random() * this.settings.staticAmount;
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
}
