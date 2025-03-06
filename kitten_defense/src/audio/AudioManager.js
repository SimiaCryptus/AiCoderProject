import { SoundCategory } from '../types/AudioTypes';
export class AudioManager {
    constructor() {
        Object.defineProperty(this, "context", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "tracks", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "settings", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "masterGain", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "categoryGains", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "retroEffectsChain", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.context = new AudioContext();
        this.tracks = new Map();
        this.settings = {
            masterVolume: 1,
            musicVolume: 0.7,
            sfxVolume: 1,
            ambientVolume: 0.5,
            uiVolume: 1,
            voiceVolume: 1,
            reverbEnabled: true,
            retroEffectsEnabled: true
        };
        this.masterGain = this.context.createGain();
        this.categoryGains = new Map();
        this.retroEffectsChain = this.createRetroEffectsChain();
        this.initializeGainNodes();
    }
    createRetroEffectsChain() {
        // Create retro-style audio effects
        const distortion = this.context.createWaveShaper();
        const filter = this.context.createBiquadFilter();
        const bitcrusher = this.createBitcrusher();
        // Configure effects for lo-fi sound
        distortion.curve = this.createDistortionCurve(50);
        filter.type = 'lowpass';
        filter.frequency.value = 4000;
        return [distortion, filter, bitcrusher];
    }
    createBitcrusher() {
        const bitcrusherCode = `
      class BitcrusherProcessor extends AudioWorkletProcessor {
        process(inputs, outputs) {
          const input = inputs[0];
          const output = outputs[0];
          
          for (let channel = 0; channel < input.length; channel++) {
            const inputChannel = input[channel];
            const outputChannel = output[channel];
            
            for (let i = 0; i < inputChannel.length; i++) {
              // Reduce bit depth and sample rate
              outputChannel[i] = Math.round(inputChannel[i] * 8) / 8;
            }
          }
          return true;
        }
      }
      registerProcessor('bitcrusher', BitcrusherProcessor);
    `;
        // Create and use the blob
        const blob = new Blob([bitcrusherCode], { type: 'application/javascript' });
        const url = URL.createObjectURL(blob);
        this.context.audioWorklet.addModule(url).catch(console.error);
        return new AudioWorkletNode(this.context, 'bitcrusher');
    }
    createDistortionCurve(amount) {
        const samples = 44100;
        const curve = new Float32Array(samples);
        const deg = Math.PI / 180;
        for (let i = 0; i < samples; i++) {
            const x = (i * 2) / samples - 1;
            curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
        }
        return curve;
    }
    initializeGainNodes() {
        Object.values(SoundCategory).forEach(category => {
            const gain = this.context.createGain();
            gain.connect(this.masterGain);
            this.categoryGains.set(category, gain);
        });
        this.masterGain.connect(this.context.destination);
    }
    async loadSound(track) {
        try {
            const response = await fetch(track.source);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
            const source = this.context.createBufferSource();
            source.buffer = audioBuffer;
            // Connect through effects chain if retro effects are enabled
            let currentNode = source;
            if (this.settings.retroEffectsEnabled) {
                this.retroEffectsChain.forEach(effect => {
                    currentNode.connect(effect);
                    currentNode = effect;
                });
            }
            const categoryGain = this.categoryGains.get(track.category);
            if (categoryGain) {
                currentNode.connect(categoryGain);
            }
            this.tracks.set(track.id, { ...track, source: source.toString() });
        }
        catch (error) {
            console.error(`Failed to load sound: ${track.id}`, error);
        }
    }
    playMusic(track) {
        if (!track) {
            // Handle stopping music
            // TODO: Implement proper fade out
            return;
        }
        // TODO: Implement full crossfading
        const audioTrack = this.tracks.get(track);
        if (audioTrack) {
            const source = this.context.createBufferSource();
            source.loop = true;
            // Additional implementation...
        }
    }
    stopAmbient(sound) {
        const track = this.tracks.get(sound);
        if (track) {
            // TODO: Implement proper cleanup and fade out
            // For now just remove from tracks
            this.tracks.delete(sound);
        }
    }
    playAmbient(sound) {
        const track = this.tracks.get(sound);
        if (track) {
            const source = this.context.createBufferSource();
            source.loop = true;
            // Additional implementation...
        }
    }
    playSoundEffect(_effect) {
        // Play one-shot sound effects
    }
    setVolume(category, volume) {
        const gain = this.categoryGains.get(category);
        if (gain) {
            gain.gain.value = volume;
        }
    }
    toggleRetroEffects(enabled) {
        this.settings.retroEffectsEnabled = enabled;
        // Reconnect audio nodes based on new setting
    }
    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        this.applySettings();
    }
    applySettings() {
        this.masterGain.gain.value = this.settings.masterVolume;
        Object.values(SoundCategory).forEach(category => {
            const gain = this.categoryGains.get(category);
            if (gain) {
                const volumeKey = `${category.toLowerCase()}Volume`;
                const volume = this.settings[volumeKey];
                if (typeof volume === 'number') {
                    gain.gain.value = volume;
                }
            }
        });
    }
}
