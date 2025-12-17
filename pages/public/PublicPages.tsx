import React, { useState } from 'react';
import { Card, Button, BeforeAfterSlider } from '../../components/UI';
import { DOCTORS } from '../../constants';

// --- Home Page ---
export const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative px-4 md:px-10">
        <div className="max-w-7xl mx-auto rounded-3xl overflow-hidden relative bg-gray-900 h-[600px] md:h-[700px] flex items-center">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-60 transition-transform hover:scale-105 duration-[2s]" 
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBoWVnboAPotbuMVzwO8-LNwL6PCbT5bD7BtWYD-bVEfX9kFbRZW_7FBumDbFx_e3lYisDJljhxv-n5jridN7ND5Nj_XlP39waNLfGTDU7ldTtjIeCYbSoZ5UwlRyKNist0c8NxHRlvFzYj-Zqld_zFkD5FvNbCJzHtqRugoxtgYUlJRWb4HtJqJ5FSGut2Xc_wOjnjJawSfczkTS8yv96c32vsyB6CTityXxZCL_Jq6LrcQdVpoVkIRJ-KRa3fpj8IGqNoQJEXsHxd")' }} 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/40 to-transparent"></div>
          <div className="relative z-10 p-8 md:p-16 max-w-2xl text-white">
            <div className="flex items-center gap-2 mb-6 animate-fade-in">
                 <span className="bg-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-block">Yapay Zeka Destekli</span>
                 <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-block">Ağrısız Tedavi</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Hayalinizdeki Gülüşe <br/> <span className="text-primary-light">Sanal Olarak</span> Bakın
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
              Yapay zeka destekli simülatörümüzle tedavinizi önceden görün. Ağrısız, hızlı ve konforlu bir deneyim için hemen randevu alın.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="h-14 px-8 text-base shadow-xl shadow-primary/20">Hemen Randevu Al</Button>
              <Button variant="secondary" className="h-14 px-8 text-base bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm" icon="play_circle">Kliniği İzle</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="px-4 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'İmplant Tedavisi', icon: 'medical_services', desc: 'Eksik dişleriniz için kalıcı ve doğal görünümlü çözümler.' },
              { title: 'Diş Beyazlatma', icon: 'auto_awesome', desc: 'Lazer teknolojisi ile daha parlak ve beyaz bir gülüş.' },
              { title: 'Ortodonti', icon: 'face', desc: 'Şeffaf plaklar ve tellerle diş çapraşıklıklarını düzeltiyoruz.' }
            ].map((s, i) => (
              <Card key={i} className="p-8 hover:shadow-lg transition-shadow group border-t-4 border-t-transparent hover:border-t-primary">
                <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-3xl">{s.icon}</span>
                </div>
                <h4 className="text-xl font-bold mb-3">{s.title}</h4>
                <p className="text-gray-500 leading-relaxed">{s.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Patient Stories (Testimonials) */}
      <section className="bg-gray-900 py-20 px-4 md:px-10 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-primary-light font-bold text-sm uppercase tracking-wide mb-2">Başarı Hikayeleri</h2>
                <h3 className="text-3xl font-bold">Hastalarımız Ne Diyor?</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-colors">
                        <div className="flex gap-1 text-yellow-400 mb-4">
                            {[1,2,3,4,5].map(s => <span key={s} className="material-symbols-outlined text-lg material-symbols-filled">star</span>)}
                        </div>
                        <p className="text-gray-300 italic mb-6">"İmplant sürecim korktuğumdan çok daha rahat geçti. Dr. Ahmet Bey'e ilgisi için çok teşekkür ederim. Artık rahatça gülebiliyorum."</p>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-700 rounded-full overflow-hidden">
                                <img src={`https://i.pravatar.cc/150?img=${i + 10}`} alt="Patient" />
                            </div>
                            <div>
                                <p className="font-bold text-sm">Zeynep K.</p>
                                <p className="text-xs text-gray-400">İmplant Tedavisi</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Doctors Preview */}
      <section className="bg-gray-50 py-16 px-4 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-primary font-bold text-sm uppercase tracking-wide mb-2">Uzman Kadromuz</h2>
              <h3 className="text-3xl font-bold text-gray-900">Hekimlerimizle Tanışın</h3>
            </div>
            <Button variant="secondary">Tüm Ekibi Gör</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {DOCTORS.map((doc) => (
              <div key={doc.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
                <div className="h-64 overflow-hidden relative">
                  <div 
                    className="w-full h-full bg-cover bg-top transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url('${doc.image}')` }}
                  />
                  {/* Video Play Overlay */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center border border-white/50">
                          <span className="material-symbols-outlined text-white text-4xl ml-1">play_arrow</span>
                      </div>
                      <span className="absolute bottom-4 text-white text-xs font-bold tracking-wider">TANIŞMA VİDEOSU</span>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-bold text-gray-900">{doc.name}</h4>
                  <p className="text-primary text-sm font-medium mb-4">{doc.title}</p>
                  <Button variant="secondary" className="w-full text-xs">Profil Detayı</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Fixed Alignment & Visibility */}
      <section className="px-4 md:px-10">
        <div className="max-w-7xl mx-auto bg-primary rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Sağlıklı Gülüşlere İlk Adımı Atın</h2>
            <p className="text-blue-100 mb-8 text-lg">Randevunuzu hemen online oluşturun, beklemeden tedavinize başlayalım.</p>
            <button className="h-14 px-10 bg-white hover:bg-gray-100 text-primary text-base font-bold rounded-lg shadow-xl transition-colors">
              Hemen Randevu Al
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- Services Page ---
export const ServicesPage: React.FC = () => {
    const [selectedTreatments, setSelectedTreatments] = useState<string[]>([]);
    
    const treatments = [
        { id: 't1', name: 'Diş Beyazlatma', price: 3000 },
        { id: 't2', name: 'İmplant (Tek Diş)', price: 15000 },
        { id: 't3', name: 'Zirkonyum Kaplama', price: 4500 },
        { id: 't4', name: 'Diş Taşı Temizliği', price: 1200 },
        { id: 't5', name: 'Şeffaf Plak (Ortodonti)', price: 35000 },
    ];

    const toggleTreatment = (id: string) => {
        setSelectedTreatments(prev => 
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const totalEstimate = selectedTreatments.reduce((acc, curr) => {
        const t = treatments.find(x => x.id === curr);
        return acc + (t ? t.price : 0);
    }, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-12 flex flex-col gap-16">
      
      {/* Introduction */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Tedavilerimiz & Teknolojiler</h1>
        <p className="text-gray-500 text-lg">Modern diş hekimliğinin tüm imkanlarını kullanarak sunduğumuz tedavi yöntemleri.</p>
      </div>

      {/* Before / After Slider Section */}
      <section>
          <h2 className="text-2xl font-bold mb-8 text-center">Değişime Tanık Olun</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <BeforeAfterSlider 
                before="https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=2070&auto=format&fit=crop" 
                after="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=2070&auto=format&fit=crop" 
             />
             <div className="flex flex-col justify-center p-6 bg-gray-50 rounded-2xl">
                 <h3 className="text-xl font-bold mb-4">Gülüş Tasarımı (Hollywood Smile)</h3>
                 <p className="text-gray-600 mb-6 leading-relaxed">
                     Hastamızın çapraşık diş yapısı ve renk tonu şikayetleri, 6 günlük zirkonyum kaplama tedavisi ile giderildi. 
                     Yüz hattına uygun, doğal ve parlak bir gülüş tasarlandı.
                 </p>
                 <div className="flex gap-4 text-sm font-semibold text-gray-900">
                     <div className="flex items-center gap-2">
                         <span className="material-symbols-outlined text-primary">schedule</span> 6 Gün
                     </div>
                     <div className="flex items-center gap-2">
                         <span className="material-symbols-outlined text-primary">dentistry</span> 20 Diş
                     </div>
                 </div>
             </div>
          </div>
      </section>

      {/* Treatment Calculator */}
      <section className="bg-primary/5 rounded-3xl p-8 md:p-12 border border-primary/10">
          <div className="flex flex-col md:flex-row gap-12">
              <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">Hızlı Fiyat Hesaplayıcı</h2>
                  <p className="text-gray-500 mb-6">İhtiyacınız olan tedavileri seçin, tahmini bütçenizi görün.</p>
                  <div className="space-y-3">
                      {treatments.map(t => (
                          <label key={t.id} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${selectedTreatments.includes(t.id) ? 'bg-white border-primary shadow-md' : 'bg-white/50 border-gray-200 hover:bg-white'}`}>
                              <div className="flex items-center gap-3">
                                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedTreatments.includes(t.id) ? 'bg-primary border-primary' : 'border-gray-300'}`}>
                                      {selectedTreatments.includes(t.id) && <span className="material-symbols-outlined text-white text-xs">check</span>}
                                  </div>
                                  <span className="font-medium text-gray-900">{t.name}</span>
                              </div>
                              <span className="text-gray-500 text-sm">₺{t.price.toLocaleString()}</span>
                              <input type="checkbox" className="hidden" onChange={() => toggleTreatment(t.id)} checked={selectedTreatments.includes(t.id)} />
                          </label>
                      ))}
                  </div>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                  <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
                      <p className="text-gray-500 font-medium mb-2">Tahmini Toplam Tutar</p>
                      <div className="text-4xl font-extrabold text-primary mb-2">
                          ₺{totalEstimate.toLocaleString()}
                          <span className="text-lg text-gray-400 font-normal">*</span>
                      </div>
                      <p className="text-xs text-gray-400 mb-8">* Fiyatlar ortalamadır, kesin bilgi muayene sonrası verilir.</p>
                      
                      <div className="flex flex-col gap-3">
                          <Button className="w-full h-12">Bu Fiyatla Randevu Al</Button>
                          <Button variant="ghost" className="w-full">WhatsApp'tan Sor</Button>
                      </div>
                  </div>
              </div>
          </div>
      </section>
      
      {/* Service Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="overflow-hidden group">
            <div className="h-48 bg-gray-200 relative">
               <img src={`https://picsum.photos/400/300?random=${i}`} alt="Service" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
               <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/0 transition-colors"></div>
            </div>
            <div className="p-6">
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded mb-3 inline-block">Estetik</span>
              <h3 className="text-xl font-bold mb-2">Gülüş Tasarımı {i}</h3>
              <p className="text-gray-500 text-sm mb-4">Dijital ortamda yüz hatlarınıza en uygun gülüşü tasarlıyoruz.</p>
              <button className="text-primary font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                Detaylı Bilgi <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// --- Team Page ---
export const TeamPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Uzman Kadromuz</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">Deneyimli hekimlerimiz ve güler yüzlü personelimizle tanışın.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {DOCTORS.map((doc) => (
          <div key={doc.id} className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-primary/50 transition-colors group">
            <div className="w-40 h-40 rounded-full overflow-hidden mb-6 ring-4 ring-gray-50 group-hover:ring-primary/20 transition-all relative">
              <img src={doc.image} alt={doc.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <span className="material-symbols-outlined text-white text-4xl">play_circle</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900">{doc.name}</h3>
            <p className="text-primary font-medium text-sm mb-4">{doc.title}</p>
            <p className="text-gray-500 text-sm mb-6">15 yıllık tecrübesiyle implant ve cerrahi alanında uzmanlaşmıştır.</p>
            <div className="flex gap-2">
               <Button variant="secondary" className="text-xs">Randevu Al</Button>
               <Button variant="ghost" className="text-xs" icon="videocam">Tanış</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Contact Page ---
export const ContactPage: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-12">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold mb-4">İletişim</h1>
                <p className="text-gray-500 max-w-2xl mx-auto">Sorularınız ve randevu talepleriniz için bize ulaşın.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Info */}
                <div className="space-y-8">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold mb-6">İletişim Bilgileri</h3>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                                    <span className="material-symbols-outlined">location_on</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Adres</h4>
                                    <p className="text-gray-500 text-sm mt-1">Bağdat Caddesi No: 123<br/>Kadıköy, İstanbul</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                                    <span className="material-symbols-outlined">call</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Telefon</h4>
                                    <p className="text-gray-500 text-sm mt-1">+90 (212) 555 00 00</p>
                                    <p className="text-gray-400 text-xs mt-1">Hafta içi: 09:00 - 19:00</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                                    <span className="material-symbols-outlined">mail</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">E-Posta</h4>
                                    <p className="text-gray-500 text-sm mt-1">info@dentcare.com</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map Placeholder */}
                    <div className="h-64 bg-gray-200 rounded-2xl overflow-hidden relative">
                         <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuATgFcULf-qOjMqE5zVR3z5LdIdwfBU95INNJVaBXCXIK1Wu412AnsJ8lYcb92K2E_6Y_ts4g2ADLGH4zeiML_J3UL3xN7_uRyW2QDQjZsu-s7ILuWyWGgcWeEaTi9PcFcu9nmS-q0gtiicYBugQzKV-MLMtHzQDI1Z1jKh4L-G5hX-ZJ4S9AECIuEch6FGMMN22GmEsc21gQWH2x5urD6cRYlyWgmM3bhebV0lA__SlZ41GKb4CkMj6yIMjt7r6QsqCJmvzwa7kdL5" className="w-full h-full object-cover" alt="Map Location" />
                         <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                             <Button variant="secondary" className="shadow-lg">Haritada Aç</Button>
                         </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <h3 className="text-xl font-bold mb-6">Bize Yazın</h3>
                    <form className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase">Ad</label>
                                <input type="text" className="rounded-lg border-gray-200 bg-gray-50 p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Adınız" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase">Soyad</label>
                                <input type="text" className="rounded-lg border-gray-200 bg-gray-50 p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Soyadınız" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase">E-Posta</label>
                            <input type="email" className="rounded-lg border-gray-200 bg-gray-50 p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none" placeholder="ornek@email.com" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase">Mesajınız</label>
                            <textarea rows={5} className="rounded-lg border-gray-200 bg-gray-50 p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Sorunuzu buraya yazın..."></textarea>
                        </div>
                        <Button className="w-full h-12 text-base mt-2">Gönder</Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

// --- Appointment Page (Smart Wizard) ---
export const AppointmentPage: React.FC = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        type: '',
        painLevel: 0,
        doctor: '',
        date: '',
        name: '',
        phone: '',
        paymentMethod: 'credit_card'
    });

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const WizardStep1 = () => (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold">Nasıl bir şikayetiniz var?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                    { id: 'pain', icon: 'sick', label: 'Diş Ağrısı / Acil', sub: 'Şiddetli ağrı veya sızı' },
                    { id: 'esthetic', icon: 'sentiment_satisfied', label: 'Estetik Görünüm', sub: 'Beyazlatma, Kaplama' },
                    { id: 'checkup', icon: 'medical_services', label: 'Genel Kontrol', sub: 'Rutin muayene' },
                    { id: 'implant', icon: 'dentistry', label: 'Eksik Diş / İmplant', sub: 'Protez ve implant' },
                ].map(opt => (
                    <div 
                        key={opt.id} 
                        onClick={() => { setFormData({...formData, type: opt.id}); nextStep(); }}
                        className={`p-6 border rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-all flex items-center gap-4 ${formData.type === opt.id ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
                    >
                        <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined">{opt.icon}</span>
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">{opt.label}</p>
                            <p className="text-xs text-gray-500">{opt.sub}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const WizardStep2 = () => (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold">Hekim ve Zaman Seçimi</h2>
            <div className="space-y-4">
                <label className="block">
                    <span className="text-sm font-semibold text-gray-700 block mb-2">Hekim Tercihi</span>
                    <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <option>Farketmez (En Müsait Hekim)</option>
                        {DOCTORS.map(d => <option key={d.id}>{d.name}</option>)}
                    </select>
                </label>
                <label className="block">
                    <span className="text-sm font-semibold text-gray-700 block mb-2">Tarih</span>
                    <input type="date" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg" />
                </label>
            </div>
            <div className="flex gap-4 pt-4">
                <Button variant="secondary" onClick={prevStep}>Geri</Button>
                <Button onClick={nextStep} className="flex-1">Devam Et</Button>
            </div>
        </div>
    );

    const WizardStep3 = () => (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold">İletişim Bilgileri</h2>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                     <input type="text" placeholder="Adınız" className="p-3 bg-gray-50 border border-gray-200 rounded-lg" />
                     <input type="text" placeholder="Soyadınız" className="p-3 bg-gray-50 border border-gray-200 rounded-lg" />
                </div>
                <input type="tel" placeholder="Telefon Numaranız" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg" />
                <input type="email" placeholder="E-posta Adresiniz" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg" />
            </div>
            
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 items-start">
                 <span className="material-symbols-outlined text-blue-600">security</span>
                 <p className="text-xs text-blue-800 leading-relaxed">Bilgileriniz 256-bit SSL sertifikası ile korunmaktadır ve 3. şahıslarla paylaşılmaz.</p>
            </div>

            <div className="flex gap-4 pt-4">
                <Button variant="secondary" onClick={prevStep}>Geri</Button>
                <Button onClick={nextStep} className="flex-1">Sonraki Adım: Onay</Button>
            </div>
        </div>
    );

    const WizardStep4 = () => (
        <div className="space-y-6 animate-fade-in">
             <div className="text-center mb-6">
                 <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                     <span className="material-symbols-outlined text-3xl">check</span>
                 </div>
                 <h2 className="text-xl font-bold">Randevu Özeti</h2>
                 <p className="text-gray-500">Lütfen bilgilerinizi kontrol ediniz.</p>
             </div>

             <div className="bg-gray-50 p-4 rounded-xl space-y-3 text-sm">
                 <div className="flex justify-between border-b border-gray-200 pb-2">
                     <span className="text-gray-500">İşlem</span>
                     <span className="font-bold">Genel Kontrol</span>
                 </div>
                 <div className="flex justify-between border-b border-gray-200 pb-2">
                     <span className="text-gray-500">Tarih</span>
                     <span className="font-bold">24 Ekim 2023, 14:30</span>
                 </div>
                 <div className="flex justify-between pb-2">
                     <span className="text-gray-500">Hekim</span>
                     <span className="font-bold">Dr. Ahmet Yılmaz</span>
                 </div>
             </div>
             
             <div className="space-y-3">
                 <p className="font-bold text-sm">Ön Ödeme / Kaparo (Opsiyonel)</p>
                 <div className="flex gap-3">
                     <div className="flex-1 p-3 border border-primary bg-primary/5 rounded-lg text-center cursor-pointer">
                         <p className="font-bold text-primary">Kredi Kartı</p>
                         <p className="text-xs text-primary/70">Güvenli Ödeme</p>
                     </div>
                     <div className="flex-1 p-3 border border-gray-200 rounded-lg text-center cursor-pointer opacity-50">
                         <p className="font-bold text-gray-500">Klinikte Öde</p>
                     </div>
                 </div>
             </div>

             <div className="flex gap-4 pt-4">
                <Button variant="secondary" onClick={prevStep}>Düzenle</Button>
                <Button className="flex-1">Randevuyu Kesinleştir</Button>
            </div>
        </div>
    );

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-80px)] py-12 px-4 md:px-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Akıllı Randevu Asistanı</h1>
            <p className="text-gray-500">Size en uygun tedaviyi planlamamız için birkaç adımda bilgilerinizi girin.</p>
          </div>
          
          <Card className="p-8 relative overflow-hidden">
             {/* Progress Bar */}
             <div className="absolute top-0 left-0 h-1 bg-gray-100 w-full">
                 <div className="h-full bg-primary transition-all duration-500" style={{ width: `${step * 25}%` }}></div>
             </div>

             <div className="mt-4">
                 {step === 1 && <WizardStep1 />}
                 {step === 2 && <WizardStep2 />}
                 {step === 3 && <WizardStep3 />}
                 {step === 4 && <WizardStep4 />}
             </div>
          </Card>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-6">
           {/* Trust Indicators */}
           <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
               <div className="flex items-center gap-4 mb-4">
                   <div className="flex -space-x-3">
                       <img className="w-10 h-10 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?img=1" alt="User" />
                       <img className="w-10 h-10 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?img=2" alt="User" />
                       <img className="w-10 h-10 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?img=3" alt="User" />
                   </div>
                   <div className="text-sm">
                       <p className="font-bold text-gray-900">1.000+ Mutlu Hasta</p>
                       <div className="flex text-yellow-400 text-xs">★★★★★</div>
                   </div>
               </div>
               <p className="text-gray-500 text-sm italic">"Randevu süreci çok hızlıydı, hiç beklemedim." - Ayşe K.</p>
           </div>
           
           <div className="bg-primary text-white rounded-2xl p-8 shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <span className="material-symbols-outlined text-3xl">verified</span>
                    <h3 className="text-xl font-bold">Güvenilir Ellerdesiniz</h3>
                </div>
                <div className="flex flex-col gap-4 text-sm">
                    <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-lg">location_on</span>
                    </div>
                    <div>
                        <strong className="block mb-1">Adres</strong>
                        <span className="text-blue-100">Bağdat Caddesi No: 123, İstanbul</span>
                    </div>
                    </div>
                    <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-lg">call</span>
                    </div>
                    <div>
                        <strong className="block mb-1">Telefon</strong>
                        <span className="text-blue-100">+90 (212) 123 45 67</span>
                    </div>
                    </div>
                </div>
              </div>
              {/* Decorative Circle */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
           </div>
        </div>
      </div>
    </div>
  );
};
