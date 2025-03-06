import {Vector2} from 'three';

export const RetroShader = {
    name: 'RetroShader',

    uniforms: {
        tDiffuse: {value: null},
        time: {value: 0},
        resolution: {value: new Vector2()},
        vhsIntensity: {value: 0.3},
        noiseIntensity: {value: 0.1},
        scanlineIntensity: {value: 0.15},
        chromaticAberration: {value: 0.005}
    },

    vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

    fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float time;
    uniform vec2 resolution;
    uniform float vhsIntensity;
    uniform float noiseIntensity;
    uniform float scanlineIntensity;
    uniform float chromaticAberration;
    
    varying vec2 vUv;
    
    // Random noise function
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }
    
    // VHS distortion
    vec2 vhsDistortion(vec2 uv) {
      float y = uv.y;
      float distortion = sin(y * 10.0 + time) * vhsIntensity;
      return vec2(uv.x + distortion, y);
    }
    
    // Scanline effect
    float scanline(vec2 uv) {
      return sin(uv.y * resolution.y * 2.0) * scanlineIntensity;
    }
    
    // Static noise
    float staticNoise(vec2 uv) {
      return random(uv + time) * noiseIntensity;
    }
    
    void main() {
      // Apply VHS distortion
      vec2 distortedUV = vhsDistortion(vUv);
      
      // Chromatic aberration
      vec4 colorR = texture2D(tDiffuse, distortedUV + vec2(chromaticAberration, 0.0));
      vec4 colorG = texture2D(tDiffuse, distortedUV);
      vec4 colorB = texture2D(tDiffuse, distortedUV - vec2(chromaticAberration, 0.0));
      
      // Combine color channels
      vec4 color = vec4(colorR.r, colorG.g, colorB.b, 1.0);
      
      // Add scanlines
      color.rgb += scanline(distortedUV);
      
      // Add static noise
      color.rgb += staticNoise(vUv);
      
      // CRT color bleeding
      color.rgb *= 0.9 + 0.1 * sin(time + vUv.y * 10.0);
      
      gl_FragColor = color;
    }
  `,

    // Additional CRT shader
    CRT: {
        uniforms: {
            tDiffuse: {value: null},
            curvature: {value: 2.0},
            scanlineIntensity: {value: 0.15}
        },

        vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,

        fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform float curvature;
      uniform float scanlineIntensity;
      
      varying vec2 vUv;
      
      vec2 curveRemapUV(vec2 uv) {
        uv = uv * 2.0 - 1.0;
        vec2 offset = abs(uv.yx) / vec2(curvature);
        uv = uv + uv * offset * offset;
        uv = uv * 0.5 + 0.5;
        return uv;
      }
      
      void main() {
        vec2 remappedUV = curveRemapUV(vUv);
        vec4 color = texture2D(tDiffuse, remappedUV);
        
        // CRT screen edge mask
        if (remappedUV.x < 0.0 || remappedUV.x > 1.0 || 
            remappedUV.y < 0.0 || remappedUV.y > 1.0) {
          color = vec4(0.0);
        }
        
        gl_FragColor = color;
      }
    `
    }
};