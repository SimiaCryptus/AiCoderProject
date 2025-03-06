import {useFrame, useThree} from '@react-three/fiber';
import {Bloom, ChromaticAberration, EffectComposer, Noise, Vignette} from '@react-three/postprocessing';
import {Camera, Scene, Vector2} from 'three';
import {RetroShader} from '../shaders/RetroShader';
import {EffectsSettings, EffectsSystem} from '../systems/EffectsSystem';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass';
import {ShaderPass} from 'three/examples/jsm/postprocessing/ShaderPass';

interface RenderPassProps {
    scene: Scene;
    camera: Camera;
}

interface ShaderPassProps {
    shader: {
        uniforms: Record<string, any>;
        vertexShader: string;
        fragmentShader: string;
    };
    uniforms: Record<string, any>;
}


// Create wrapper components for Three.js passes
const RenderPassWrapper = ({scene, camera}: RenderPassProps) => {
    const pass = new RenderPass(scene, camera);
    return <primitive object={pass}/>;
};
const ShaderPassWrapper = ({shader, uniforms}: ShaderPassProps) => {
    const pass = new ShaderPass(shader);
    Object.assign(pass.uniforms, uniforms);
    return <primitive object={pass}/>;
};

interface PostProcessingProps {
    settings?: Partial<EffectsSettings>;
}

export function PostProcessing({settings = {}}: PostProcessingProps) {
    const {scene, camera, size} = useThree();
    const effectsSystem = new EffectsSystem(settings);

    useFrame((_, delta) => {
        effectsSystem.update(delta);
    });

    return (
        <EffectComposer>
            <RenderPassWrapper scene={scene} camera={camera}/>

            {/* VHS Effect */}
            <ShaderPassWrapper
                shader={RetroShader}
                uniforms={{
                    resolution: {value: new Vector2(size.width, size.height)},
                    time: {value: effectsSystem.getUniforms().time},
                    vhsIntensity: {value: effectsSystem.getUniforms().vhsIntensity}
                }}
            />

            {/* CRT Effect */}
            <ShaderPassWrapper
                shader={RetroShader.CRT}
                uniforms={{
                    curvature: {value: effectsSystem.getUniforms().crtCurvature},
                    scanlineIntensity: {value: effectsSystem.getUniforms().scanlineIntensity}
                }}
            />

            {/* Additional Effects */}
            <Bloom intensity={effectsSystem.getUniforms().bloomIntensity}/>
            <Vignette darkness={effectsSystem.getUniforms().vignetteIntensity}/>
            <Noise opacity={effectsSystem.getUniforms().noiseIntensity}/>
            <ChromaticAberration
                offset={new Vector2(effectsSystem.getUniforms().chromaticAberration, 0)}
                radialModulation={false}
                modulationOffset={0}
            />
        </EffectComposer>
    );
}