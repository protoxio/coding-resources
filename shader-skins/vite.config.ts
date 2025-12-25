import {defineConfig} from 'vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        {
        name: 'force-full-reload',
        handleHotUpdate({ server }) {
            server.ws.send({
                type: 'full-reload',
            });
        },
    },
    ],
    server: {
        port: 5156,
        hmr: {
            overlay: false, // Disables the error overlay
        },
    },
    build: {
        minify: true, // Terser for better dead code removal
        rollupOptions: {
            treeshake: true,
            output: {
                inlineDynamicImports: true,
                manualChunks: undefined,
                entryFileNames: 'js/bundle.js',
            },
        },
        cssCodeSplit: false,
    },

});
