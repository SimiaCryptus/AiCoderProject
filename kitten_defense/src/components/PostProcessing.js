import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useThree, useFrame } from '@react-three/fiber';
import { Bloom, Vignette, Noise, ChromaticAberration, EffectComposer } from '@react-three/postprocessing';
import { Vector2 } from 'three';
import { RetroShader } from '../shaders/RetroShader';
import { EffectsSystem } from '../systems/EffectsSystem';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
// Create wrapper components for Three.js passes
const RenderPassWrapper = ({ scene, camera }) => {
    const pass = new RenderPass(scene, camera);
    return _jsx("primitive", { object: pass });
};
const ShaderPassWrapper = ({ shader, uniforms }) => {
    const pass = new ShaderPass(shader);
    Object.assign(pass.uniforms, uniforms);
    return _jsx("primitive", { object: pass });
};
export function PostProcessing({ settings = {} }) {
    const { scene, camera, size } = useThree();
    const effectsSystem = new EffectsSystem(settings);
    useFrame((_, delta) => {
        effectsSystem.update(delta);
    });
    return (_jsxs(EffectComposer, { children: [_jsx(RenderPassWrapper, { scene: scene, camera: camera }), _jsx(ShaderPassWrapper, { shader: RetroShader, uniforms: {
                    resolution: { value: new Vector2(size.width, size.height) },
                    time: { value: effectsSystem.getUniforms().time },
                    vhsIntensity: { value: effectsSystem.getUniforms().vhsIntensity }
                } }), _jsx(ShaderPassWrapper, { shader: RetroShader.CRT, uniforms: {
                    curvature: { value: effectsSystem.getUniforms().crtCurvature },
                    scanlineIntensity: { value: effectsSystem.getUniforms().scanlineIntensity }
                } }), _jsx(Bloom, { intensity: effectsSystem.getUniforms().bloomIntensity }), _jsx(Vignette, { darkness: effectsSystem.getUniforms().vignetteIntensity }), _jsx(Noise, { opacity: effectsSystem.getUniforms().noiseIntensity }), _jsx(ChromaticAberration, { offset: new Vector2(effectsSystem.getUniforms().chromaticAberration, 0), radialModulation: false, modulationOffset: 0 })] }));
}
