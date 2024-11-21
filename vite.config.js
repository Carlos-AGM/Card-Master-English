import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: './dist/stats.html', // Genera un reporte de análisis del bundle
      open: true, // Abre el reporte automáticamente después del build
    }),
  ],
  base: 'https://carlos-agm.github.io/Card-Master-English/', // Base para GitHub Pages
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Agrupa bibliotecas grandes en un chunk llamado "vendor"
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Aumenta el límite de advertencia a 1MB
  },
});