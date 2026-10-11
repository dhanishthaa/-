import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/biznessOwners/Calculatorrr/',
  server: {
    allowedHosts: ['4173-imc8k1ebpecx6e11xah45-ef2073cb.sg2.manus.computer']
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/@supabase/')) return 'supabase-vendor';
          if (id.includes('node_modules/lucide-react/')) return 'icons-vendor';
          if (id.includes('node_modules/qrcode/')) return 'qr-vendor';
          if (id.includes('node_modules/pdf-lib/')) return 'pdf-lib-vendor';
          if (id.includes('node_modules/@pdf-lib/fontkit/') || id.includes('node_modules/fontkit/')) return 'fontkit-vendor';
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/scheduler/')) return 'react-vendor';
        }
      }
    }
  }
});
