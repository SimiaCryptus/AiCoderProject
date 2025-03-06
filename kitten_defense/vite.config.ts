import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';

export default defineConfig({
    root: '.',
    plugins: [react()],
    resolve: {
        alias: {
            'three/examples/jsm': path.resolve(__dirname, './node_modules/three/examples/jsm')
        }
    }
});