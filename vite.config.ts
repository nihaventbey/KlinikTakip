import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // Base path './' olarak ayarlandığında, dosyalar her dizinde çalışabilir hale gelir.
  // (Sets the base URL for the project so it works in subdirectories - Projenin alt dizinlerde çalışması için temel URL'yi ayarlar)
  base: './', 
  
  plugins: [react()],
  
  build: {
    // Çıktı klasörü (Output directory)
    outDir: 'dist',
    // Varlıkların (JS/CSS) yerleştirileceği klasör (Assets directory)
    assetsDir: 'assets',
    // Küçük resimleri base64 olarak gömer (Sets limit for inlining small assets - Küçük varlıkları satır içine alma sınırını ayarlar)
    assetsInlineLimit: 4096, 
    // Sourcemap hata ayıklama için gerekirse true yapılabilir (Generates source maps for debugging - Hata ayıklama için kaynak haritaları oluşturur)
    sourcemap: false,
  },
  
  server: {
    // Geliştirme sunucusu portu (Development server port)
    port: 5173,
    // Sunucu başladığında tarayıcıyı otomatik açar (Automatically opens the browser on start - Başlangıçta tarayıcıyı otomatik açar)
    open: true, 
  }
});