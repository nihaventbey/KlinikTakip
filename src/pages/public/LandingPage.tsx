import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* --- NAVBAR --- */}
      <nav className="bg-white border-b sticky top-0 z-50 bg-opacity-90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {/* Logo İkonu */}
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">
              KT
            </div>
            <span className="text-2xl font-bold text-gray-800 tracking-tight">Klinik Takip</span>
          </div>
          <div className="flex gap-4">
            <Link to="/login">
              <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">Giriş</Button>
            </Link>
            <Link to="/sys-login">
              <Button variant="secondary" className="bg-gray-800 text-white hover:bg-gray-900">Yönetici</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION (Ana Görsel Alanı) --- */}
      <header className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 pt-20 px-4 sm:px-6 lg:px-8">
            <main className="mt-10 mx-auto max-w-7xl sm:mt-12 md:mt-16 lg:mt-20 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Kliniğinizi Dijitalleştirin,</span>{' '}
                  <span className="block text-blue-600 xl:inline">Hastalarınıza Odaklanın</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Randevu karmaşasına son verin. Hasta takibi, stok yönetimi, personel işlemleri ve finansal raporlar artık tek bir ekranda. Klinik Takip ile işlerinizi kolaylaştırın.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start gap-4">
                  <Button className="w-full sm:w-auto px-8 py-4 text-lg bg-blue-600 hover:bg-blue-700 shadow-xl rounded-xl">
                    Ücretsiz Deneyin
                  </Button>
                  <Button variant="outline" className="w-full sm:w-auto px-8 py-4 text-lg border-2 rounded-xl">
                    Demo Talep Edin
                  </Button>
                </div>
              </div>
            </main>
          </div>
        </div>
        {/* Sağ Taraf Görseli */}
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-gray-50">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full opacity-90 hover:opacity-100 transition duration-500"
            src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=2068"
            alt="Modern Klinik"
          />
        </div>
      </header>

      {/* --- TEMEL ÖZELLİKLER --- */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Özellikler</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              İhtiyacınız Olan Her Şey
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Karmaşık excel tablolarından kurtulun. Profesyonel bir klinik yönetimi için gerekli tüm araçlar burada.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard 
              icon="📅" 
              title="Akıllı Randevu Takvimi" 
              desc="Sürükle bırak özelliği ile randevuları yönetin. Çakışmaları otomatik engelleyin ve SMS hatırlatmaları gönderin."
            />
            <FeatureCard 
              icon="🗂️" 
              title="Detaylı Hasta Dosyası" 
              desc="Anamnez formları, röntgenler, reçeteler ve geçmiş tedaviler. Hastanızın tüm geçmişi tek tıkla elinizin altında."
            />
            <FeatureCard 
              icon="💰" 
              title="Finansal Yönetim" 
              desc="Gelir-gider takibi, personel maaşları ve hakediş hesaplamaları. Kliniğinizin kârlılığını anlık grafiklerle izleyin."
            />
          </div>
        </div>
      </section>

      {/* --- YAPAY ZEKA MODÜLÜ (Özel Bölüm) --- */}
      <section className="py-24 bg-gray-900 text-white overflow-hidden relative">
        {/* Arkaplan Efekti */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
             <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover" alt="AI Background" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <div className="inline-block px-4 py-1 rounded-full bg-blue-500 bg-opacity-20 text-blue-300 font-semibold text-sm mb-4 border border-blue-500/30">
              YENİ ÖZELLİK
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Yapay Zeka Modülü <br/> 
              <span className="text-blue-400">Teşhis ve Analiz Asistanı</span>
            </h2>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Klinik Takip, sadece kayıt tutmaz; size yardımcı olur. Entegre yapay zeka modülü sayesinde röntgen analizlerinde ön değerlendirme yapabilir, tedavi planlamasında öneriler alabilirsiniz.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-black text-xs">✓</span>
                <span>Otomatik röntgen analizi ve işaretleme</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-black text-xs">✓</span>
                <span>Tedavi süresi ve maliyet tahmini</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-black text-xs">✓</span>
                <span>Akıllı stok tüketim tahmini</span>
              </li>
            </ul>
            <Button className="bg-blue-500 hover:bg-blue-600 border-none text-white px-8 py-3 rounded-xl">
              Modülü İncele
            </Button>
          </div>
          
          <div className="md:w-1/2">
             <img 
                src="https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&q=80&w=2000" 
                alt="AI Tech" 
                className="rounded-2xl shadow-2xl border border-gray-700 transform hover:scale-105 transition duration-500"
             />
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-2xl font-bold text-gray-800 mb-4">Klinik Takip</div>
          <p className="text-gray-500 mb-8">Modern klinikler için güvenilir çözüm ortağı.</p>
          <div className="flex justify-center gap-6 text-gray-400 text-sm">
            <a href="#" className="hover:text-gray-900">Gizlilik Politikası</a>
            <a href="#" className="hover:text-gray-900">Kullanım Şartları</a>
            <a href="#" className="hover:text-gray-900">İletişim</a>
          </div>
          <div className="mt-8 text-gray-400 text-xs">
            © 2025 Resul YILMAZ Tüm hakları saklıdır.
          </div>
        </div>
      </footer>
    </div>
  );
}

// Kart Bileşeni
function FeatureCard({ icon, title, desc }: { icon: string, title: string, desc: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-3xl mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{desc}</p>
    </div>
  );
}