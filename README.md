<div align="center">
<img width="1200" height="475" alt="KlinikTakip Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Klinik Takip - Diş Polikliniği Yönetim Sistemi

Bu depo, yerel ortamınızda uygulamayı çalıştırmak ve yayına almak için gereken tüm dosyaları içerir.

## Özellikler

- **Tedavi Planlamalı Diş Şeması:** Diş seçimi yaparak özel fiyatlandırma ve notlarla tedavi planları oluşturun.
- **Hasta Randevuları:** Durum ve detaylarla birlikte hasta randevu listesini görüntüleyin ve yönetin.
- **Gelişmiş Arayüz:** Özel kaydırma çubukları (scrollbar) ile modern kullanıcı deneyimi.
- **Akıllı Modallar:** Yumuşak geçiş efektlerine sahip modal bileşenleri.
- **Finansal Takip:** Klinik cirosu, ödemeler ve finansal raporlama.

## Yerel Kurulum

**Gereksinimler:** Node.js (v18 veya üzeri önerilir)

1. Bağımlılıkları yükleyin:
   `npm install`
2. `.env` dosyasını oluşturun ve gerekli veritabanı/servis anahtarlarını ekleyin.
3. Uygulamayı başlatın:
   `npm run dev`

## Yayına Alma

Proje Vite ve React ile geliştirilmiştir. Production build almak için:
`npm run build`