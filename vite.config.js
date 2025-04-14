import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite'; // Add this back

export default defineConfig({
  plugins: [react(), tailwindcss()], // Add tailwindcss() back
  build: {
    rollupOptions: {
      output: {},
    },
    "compilerOptions": {
    "baseUrl": "src"
  },
  },
});
