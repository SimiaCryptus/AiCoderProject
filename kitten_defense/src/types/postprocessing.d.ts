import {Effect} from 'postprocessing';

declare module '@react-three/postprocessing' {
    interface N8AOPostPassOptions {
        intensity?: number
        aoRadius?: number
        distanceFalloff?: number
        screenSpaceRadius?: boolean
        color?: string
    }

    interface SSREffectOptions {
        intensity?: number
        exponent?: number
        distance?: number
        fade?: number
        roughnessFade?: number
        thickness?: number
        ior?: number
        maxRoughness?: number
        maxDepthDifference?: number
        blend?: number
        correction?: number
        correctionRadius?: number
        blur?: number
        blurKernel?: number
        blurSharpness?: number
        jitter?: number
        jitterRoughness?: number
        steps?: number
        refineSteps?: number
        missedRays?: boolean
        useNormalMap?: boolean
        useRoughnessMap?: boolean
        resolutionScale?: number
        velocityResolutionScale?: number
    }

    export class N8AOPostPass extends Effect {
        constructor(options?: N8AOPostPassOptions)
    }

    export class SSREffect extends Effect {
        constructor(options?: SSREffectOptions)
    }
}