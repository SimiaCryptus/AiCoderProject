import {create} from 'zustand';
import {AudioManager} from '../audio/AudioManager';
import {AmbientSound, AudioSettings, MusicTrack, SoundEffect} from '../types/AudioTypes';

interface AudioState {
    settings: AudioSettings;
    currentMusic: MusicTrack | null;
    activeAmbient: Set<AmbientSound>;
    audioManager: AudioManager;
}

interface AudioStore extends AudioState {
    playMusic: (track: MusicTrack) => void;
    playAmbient: (sound: AmbientSound) => void;
    playSoundEffect: (effect: SoundEffect) => void;
    updateSettings: (settings: Partial<AudioSettings>) => void;
    stopMusic: () => void;
    stopAmbient: (sound: AmbientSound) => void;
}

export const useAudioStore = create<AudioStore>((set, get) => {
    const audioManager = new AudioManager();

    return {
        settings: {
            masterVolume: 1,
            musicVolume: 0.7,
            sfxVolume: 1,
            ambientVolume: 0.5,
            uiVolume: 1,
            voiceVolume: 1,
            reverbEnabled: true,
            retroEffectsEnabled: true
        },
        currentMusic: null,
        activeAmbient: new Set(),
        audioManager,

        playMusic: (track: MusicTrack) => {
            const {currentMusic, audioManager} = get();
            if (currentMusic !== track) {
                audioManager.playMusic(track);
                set({currentMusic: track});
            }
        },

        playAmbient: (sound: AmbientSound) => {
            const {activeAmbient, audioManager} = get();
            if (!activeAmbient.has(sound)) {
                audioManager.playAmbient(sound);
                activeAmbient.add(sound);
                set({activeAmbient: new Set(activeAmbient)});
            }
        },

        playSoundEffect: (effect: SoundEffect) => {
            const {audioManager} = get();
            audioManager.playSoundEffect(effect);
        },

        updateSettings: (newSettings: Partial<AudioSettings>) => {
            const {settings, audioManager} = get();
            const updatedSettings = {...settings, ...newSettings} as AudioSettings;
            audioManager.updateSettings(updatedSettings);
            set({settings: updatedSettings});
        },

        stopMusic: () => {
            const {audioManager} = get();
            audioManager.playMusic(null as unknown as MusicTrack);  // Temporary type cast until proper null handling is implemented
            set({currentMusic: null});
        },

        stopAmbient: (sound: AmbientSound) => {
            const {activeAmbient, audioManager} = get();
            if (activeAmbient.has(sound)) {
                if (typeof audioManager.stopAmbient === 'function') {
                    audioManager.stopAmbient(sound);
                }
                activeAmbient.delete(sound);
                set({activeAmbient: new Set(activeAmbient)});
            }
        }
    };
});