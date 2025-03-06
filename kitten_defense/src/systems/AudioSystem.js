import { create } from 'zustand';
import { AudioManager } from '../audio/AudioManager';
export const useAudioStore = create((set, get) => {
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
        playMusic: (track) => {
            const { currentMusic, audioManager } = get();
            if (currentMusic !== track) {
                audioManager.playMusic(track);
                set({ currentMusic: track });
            }
        },
        playAmbient: (sound) => {
            const { activeAmbient, audioManager } = get();
            if (!activeAmbient.has(sound)) {
                audioManager.playAmbient(sound);
                activeAmbient.add(sound);
                set({ activeAmbient: new Set(activeAmbient) });
            }
        },
        playSoundEffect: (effect) => {
            const { audioManager } = get();
            audioManager.playSoundEffect(effect);
        },
        updateSettings: (newSettings) => {
            const { settings, audioManager } = get();
            const updatedSettings = { ...settings, ...newSettings };
            audioManager.updateSettings(updatedSettings);
            set({ settings: updatedSettings });
        },
        stopMusic: () => {
            const { audioManager } = get();
            audioManager.playMusic(null); // Temporary type cast until proper null handling is implemented
            set({ currentMusic: null });
        },
        stopAmbient: (sound) => {
            const { activeAmbient, audioManager } = get();
            if (activeAmbient.has(sound)) {
                if (typeof audioManager.stopAmbient === 'function') {
                    audioManager.stopAmbient(sound);
                }
                activeAmbient.delete(sound);
                set({ activeAmbient: new Set(activeAmbient) });
            }
        }
    };
});
