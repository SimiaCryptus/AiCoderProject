import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useWeatherStore } from '../systems/WeatherSystem';
import { WeatherType } from '../types/WeatherTypes';
export const Weather = ({ intensity = 1 }) => {
    const weatherRef = useRef(null);
    const { weatherState } = useWeatherStore();
    useFrame(() => {
        if (weatherRef.current) {
            // Update weather effects based on current weather type
            switch (weatherState.currentWeather) {
                case WeatherType.HAIRBALL_STORM:
                    // Add storm visual effects
                    break;
                case WeatherType.CATNIP_WIND:
                    // Add wind visual effects
                    break;
                case WeatherType.MILK_RAIN:
                    // Add rain visual effects
                    break;
                case WeatherType.YARN_FOG:
                    // Add fog visual effects
                    break;
                case WeatherType.RAINBOW_BEAM:
                    // Add rainbow visual effects
                    break;
            }
        }
    });
    return (_jsxs("group", { ref: weatherRef, children: [weatherState.currentWeather === WeatherType.HAIRBALL_STORM && (_jsx(HairballStorm, { intensity: intensity })), weatherState.currentWeather === WeatherType.CATNIP_WIND && (_jsx(CatnipWind, { intensity: intensity })), weatherState.currentWeather === WeatherType.MILK_RAIN && (_jsx(MilkRain, { intensity: intensity })), weatherState.currentWeather === WeatherType.YARN_FOG && (_jsx(YarnFog, { intensity: intensity })), weatherState.currentWeather === WeatherType.RAINBOW_BEAM && (_jsx(RainbowBeam, { intensity: intensity }))] }));
};
// Weather effect components
const HairballStorm = ({ intensity }) => {
    return (_jsx("points", { scale: [intensity, intensity, intensity] }));
};
const CatnipWind = ({ intensity }) => {
    return (_jsx("points", { scale: [intensity * 1.2, intensity * 0.8, intensity] }));
};
const MilkRain = ({ intensity }) => {
    return (_jsx("points", { scale: [intensity, intensity * 1.5, intensity] }));
};
const YarnFog = ({ intensity }) => {
    return (_jsx("mesh", { scale: [intensity * 2, intensity * 0.5, intensity * 2] }));
};
const RainbowBeam = ({ intensity }) => {
    return (_jsx("mesh", { scale: [intensity * 1.5, intensity * 3, intensity * 1.5] }));
};
