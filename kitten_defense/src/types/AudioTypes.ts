export enum SoundCategory {
    MUSIC = 'music',
    AMBIENT = 'ambient',
    SFX = 'sfx',
    UI = 'ui',
    VOICE = 'voice'
}

export enum MusicTrack {
    MAIN_THEME = 'mainTheme',
    BATTLE = 'battle',
    STEALTH = 'stealth',
    VICTORY = 'victory',
    DEFEAT = 'defeat'
}

export enum AmbientSound {
    PURRING = 'purring',
    WIND = 'wind',
    RAIN = 'rain',
    STATIC = 'static',
    VINYL_CRACKLE = 'vinylCrackle'
}

export enum SoundEffect {
    MEOW = 'meow',
    HISS = 'hiss',
    LASER_POINTER = 'laserPointer',
    YARN_THROW = 'yarnThrow',
    CARDBOARD_BREAK = 'cardboardBreak',
    PAW_STEPS = 'pawSteps',
    TERRITORY_CAPTURE = 'territoryCapture',
    RESOURCE_COLLECT = 'resourceCollect'
}

export interface AudioSettings {
    masterVolume: number;
    musicVolume: number;
    sfxVolume: number;
    ambientVolume: number;
    uiVolume: number;
    voiceVolume: number;
    reverbEnabled: boolean;
    retroEffectsEnabled: boolean;

    [key: `${string}Volume`]: number | undefined;  // Allow undefined for dynamic volume properties
}

export interface AudioTrack {
    id: string;
    category: SoundCategory;
    source: string;
    loop: boolean;
    volume: number;
    playbackRate: number;
    effects: AudioEffect[];
    buffer?: AudioBuffer;
    sourceNode?: AudioBufferSourceNode;
}

export type NullableMusicTrack = MusicTrack | null;

export interface AudioEffect {
    type: AudioEffectType;
    params: Record<string, number>;
}

export enum AudioEffectType {
    REVERB = 'reverb',
    DISTORTION = 'distortion',
    FILTER = 'filter',
    DELAY = 'delay',
    BITCRUSHER = 'bitcrusher'
}