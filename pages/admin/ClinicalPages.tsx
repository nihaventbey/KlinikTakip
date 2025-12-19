import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../components/UI';
import { db } from '../../lib/db';
import { DRUGS_DB } from '../../constants';
import { supabase } from '../../lib/supabase';

// --- Tooth Component ---
const Tooth: React.FC<{ number: number; condition?: string; onClick: () => void }> = ({ number, condition, onClick }) => {
    let color = 'fill-white';
    if (condition === 'caries') color = 'fill-red-400';
    if (condition === 'filling') color = 'fill-blue-400';
    if (condition === 'implant') color = 'fill-gray-400';
    if (condition === 'missing') color = 'fill-transparent stroke-gray-300 stroke-dashed';

    return (
        <div onClick={onClick} className="flex flex-col items-center gap-1 cursor-pointer group">
            <svg viewBox="0 0 100 140" className={`w-12 h-16 drop-shadow-sm transition-all hover:scale-110 ${condition === 'missing' ? '' : 'bg-white rounded-lg border border-gray-100'}`}>
                <path d="M30 140 C 30 100, 40 80, 50 80 C 60 80, 70 100, 70 140" className="fill-yellow-50" />
                <path d="M10 40 Q 10 0, 50 0 Q 90 0, 90 40 L 90 70 Q 90 90, 50 90 Q 10 90, 10 70 Z" className={`${color} stroke-gray-300 stroke-2`} />
                {condition === 'caries' && <circle cx="50" cy="40" r="15" className="fill-red-600 opacity-60" />}
                {condition === 'filling' && <rect x="30" y="20" width="40" height="40" className="fill-blue-600 opacity-60" />}
                {condition === 'implant' && <rect x="40" y="80" width="20" height="60" className="fill-gray-600" />}
            </svg>
            <span className="text-xs font-bold text-gray-500 group-hover:text-primary">{number}</span>
        </div>
    );
};

export const Odontogram: React.FC<{ patientId: string }> = ({ patientId }) => {
    const [selectedTool, setSelectedTool] = useState<'select' | 'caries' | 'filling' | 'implant' | 'missing'>('select');
    const [teethStatus, setTeethStatus] = useState<Record<number, string>>({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadTeeth = async () => {
            const { data } = await supabase.from('teeth_records').select('*').eq('patient_id', patientId);
            if (data) {
                const statusMap: Record<number, string> = {};
                data.forEach(item => { statusMap[item.tooth_number] = item.condition; });
                setTeethStatus(statusMap);
            }
        };
        loadTeeth();
    }, [patientId]);

    const handleToothClick = async (number: number) => {
        if (selectedTool === 'select') return;
        const newCondition = teethStatus[number] === selectedTool ? 'healthy' : selectedTool;
        
        setTeethStatus(prev => ({ ...prev, [number]: newCondition }));
        
        await supabase.from('teeth_records').upsert({
            patient_id: patientId,
            tooth_number: number,
            condition: newCondition,
            updated_at: new Date().toISOString()
        }, { onConflict: 'patient_id, tooth_number' });
    };

    const upperTeeth = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
    const lowerTeeth = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

    return (
        <Card className="p-6 border-none shadow-xl rounded-[32px]">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">Odontogram (Diş Haritası)</h3>
                <div className="flex gap-2 bg-gray-100 p-1.5 rounded-xl">
                    {[
                        { id: 'select', icon: 'mouse', label: 'Seç' },
                        { id: 'caries', icon: 'coronavirus', label: 'Çürük', color: 'text-red-500' },
                        { id: 'filling', icon: 'format_paint', label: 'Dolgu', color: 'text-blue-500' },
                        { id: 'implant', icon: 'bolt', label: 'İmplant', color: 'text-gray-600' },
                        { id: 'missing', icon: 'do_not_disturb_on', label: 'Eksik', color: 'text-gray-400' },
                    ].map(tool => (
                        <button key={tool.id} onClick={() => setSelectedTool(tool.id as any)} className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-bold transition-all ${selectedTool === tool.id ? 'bg-white shadow-md text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
                            <span className={`material-symbols-outlined text-lg ${tool.color}`}>{tool.icon}</span>
                            <span className="hidden lg:inline">{tool.label}</span>
                        </button>
                    ))}
                </div>
            </div>
            <div className="bg-blue-50/30 rounded-[32px] p-10 border border-blue-100 flex flex-col gap-12 items-center overflow-x-auto">
                <div className="flex gap-3">{upperTeeth.map(t => <Tooth key={t} number={t} condition={teethStatus[t]} onClick={() => handleToothClick(t)} />)}</div>
                <div className="flex gap-3">{lowerTeeth.map(t => <Tooth key={t} number={t} condition={teethStatus[t]} onClick={() => handleToothClick(t)} />)}</div>
            </div>
        </Card>
    );
};

export const DicomViewer: React.FC = () => {
    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [invert, setInvert] = useState(0);
    const [zoom, setZoom] = useState(1);

    return (
        <Card className="p-0 overflow-hidden flex flex-col md:flex-row h-[550px] border-none shadow-2xl rounded-[40px] bg-black">
            <div className="w-full md:w-72 bg-gray-900 text-white p-8 flex flex-col gap-8 z-10 shrink-0 border-r border-white/5">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-3xl">radiology</span>
                    <h3 className="font-extrabold tracking-tight">DICOM Viewer</h3>
                </div>
                <div className="space-y-6">
                    <div className="space-y-3">
                        <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest"><span>Parlaklık</span><span>{brightness}%</span></div>
                        <input type="range" min="50" max="150" value={brightness} onChange={e => setBrightness(Number(e.target.value))} className="w-full accent-primary h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest"><span>Kontrast</span><span>{contrast}%</span></div>
                        <input type="range" min="50" max="200" value={contrast} onChange={e => setContrast(Number(e.target.value))} className="w-full accent-primary h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-auto">
                    <button onClick={() => setInvert(prev => prev === 0 ? 1 : 0)} className={`p-3 rounded-xl text-xs font-bold border transition-all ${invert ? 'bg-primary border-primary text-white' : 'border-gray-700 hover:bg-gray-800 text-gray-400'}`}>Negatif</button>
                    <button onClick={() => { setBrightness(100); setContrast(100); setInvert(0); setZoom(1); }} className="p-3 rounded-xl text-xs font-bold border border-gray-700 hover:bg-gray-800 text-gray-400">Sıfırla</button>
                    <button onClick={() => setZoom(z => Math.max(1, z - 0.2))} className="p-3 rounded-xl border border-gray-700 hover:bg-gray-800 text-white flex items-center justify-center"><span className="material-symbols-outlined">zoom_out</span></button>
                    <button onClick={() => setZoom(z => Math.min(3, z + 0.2))} className="p-3 rounded-xl border border-gray-700 hover:bg-gray-800 text-white flex items-center justify-center"><span className="material-symbols-outlined">zoom_in</span></button>
                </div>
            </div>
            <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-slate-950">
                <div className="transition-all duration-300" style={{ transform: `scale(${zoom})`, filter: `brightness(${brightness}%) contrast(${contrast}%) invert(${invert})` }}>
                    <img src="https://images.unsplash.com/photo-1590105577767-15103c624647?q=80&w=2600" alt="X-Ray" className="max-h-[500px] object-contain opacity-90 shadow-2xl" />
                </div>
                <div className="absolute top-8 right-8 text-[10px] text-gray-500 font-mono bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/5 space-y-1">
                    <p>IMG_REF: DCM-4209</p>
                    <p>TARİH: 19.12.2023</p>
                    <p>KESİT: PANORAMİK</p>
                </div>
            </div>
        </Card>
    );
};

export const PrescriptionAssistant: React.FC = () => {
    const [selectedDrugs, setSelectedDrugs] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [listening, setListening] = useState(false);
    const [note, setNote] = useState('');

    const toggleDictation = () => {
        if (!('webkitSpeechRecognition' in window)) return alert('Tarayıcı desteklemiyor.');
        if (listening) { setListening(false); } 
        else {
            setListening(true);
            const recognition = new (window as any).webkitSpeechRecognition();
            recognition.lang = 'tr-TR';
            recognition.onresult = (e: any) => { setNote(prev => prev + ' ' + e.results[0][0].transcript + '.'); setListening(false); };
            recognition.start();
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-10 flex flex-col h-full border-none shadow-xl rounded-[40px]">
                <h3 className="font-extrabold text-xl mb-6 flex items-center gap-3"><span className="material-symbols-outlined text-primary">prescriptions</span> E-Reçete Asistanı</h3>
                <div className="relative mb-6">
                    <input type="text" placeholder="İlaç veya etken madde ara..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full p-5 pl-14 bg-slate-50 border-none rounded-2xl text-sm outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium" />
                    <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                    {search && (
                        <div className="absolute top-full left-0 w-full bg-white border border-slate-100 shadow-2xl rounded-2xl mt-2 z-20 max-h-60 overflow-y-auto p-2">
                            {DRUGS_DB.filter(d => d.name.toLowerCase().includes(search.toLowerCase())).map(drug => (
                                <div key={drug.name} onClick={() => { setSelectedDrugs([...selectedDrugs, drug]); setSearch(''); }} className="p-4 hover:bg-slate-50 rounded-xl cursor-pointer flex justify-between items-center transition-colors">
                                    <span className="font-bold text-slate-700">{drug.name}</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{drug.type}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="flex-1 bg-slate-50 rounded-[24px] p-6 mb-8 overflow-y-auto min-h-[200px] border border-slate-100/50">
                    {selectedDrugs.length === 0 && <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-2"><span className="material-symbols-outlined text-4xl">inventory_2</span><p className="text-xs font-bold uppercase tracking-widest">Reçete Boş</p></div>}
                    {selectedDrugs.map((drug, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 mb-3 shadow-sm group">
                            <div><p className="font-extrabold text-slate-800">{drug.name}</p><p className="text-[10px] font-bold text-primary uppercase mt-1">{drug.dose}</p></div>
                            <button onClick={() => setSelectedDrugs(selectedDrugs.filter(d => d.name !== drug.name))} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all"><span className="material-symbols-outlined text-lg">close</span></button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-4">
                    <Button variant="secondary" className="flex-1 h-14 rounded-2xl font-bold">Taslak</Button>
                    <Button className="flex-1 h-14 rounded-2xl font-bold" icon="print">Reçeteyi Yazdır</Button>
                </div>
            </Card>
            <div className="flex flex-col gap-8">
                <Card className="p-8 border-none shadow-xl rounded-[40px]">
                     <div className="flex justify-between items-center mb-6">
                         <h3 className="font-extrabold text-xl flex items-center gap-3"><span className="material-symbols-outlined text-primary">mic</span> Klinik Notlar</h3>
                         <button onClick={toggleDictation} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg ${listening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}><span className="material-symbols-outlined">{listening ? 'mic_off' : 'mic'}</span></button>
                     </div>
                     <textarea className="w-full h-40 p-6 bg-amber-50/50 border-none rounded-[32px] text-sm text-slate-700 outline-none focus:ring-4 focus:ring-amber-200/50 resize-none font-medium leading-relaxed" placeholder="Sesli not için mikrofonu kullanın..." value={note} onChange={(e) => setNote(e.target.value)} />
                </Card>
                <Card className="p-8 flex-1 border-none shadow-xl rounded-[40px]">
                    <h3 className="font-extrabold text-xl mb-8">Tedavi Zaman Çizelgesi</h3>
                    <div className="relative pl-6 space-y-10 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                        <div className="relative pl-10"><div className="absolute left-0 top-1.5 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white shadow-lg ring-1 ring-emerald-100"></div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">TAMAMLANDI</p><h4 className="font-extrabold text-slate-900 tracking-tight">Panoramik Röntgen & Teşhis</h4></div>
                        <div className="relative pl-10"><div className="absolute left-0 top-1.5 w-4 h-4 bg-primary rounded-full border-4 border-white shadow-lg ring-1 ring-primary/20"></div><p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">GÜNCEL TEDAVİ</p><h4 className="font-extrabold text-slate-900 tracking-tight">Kanal Tedavisi (Diş 46)</h4></div>
                        <div className="relative pl-10 opacity-40"><div className="absolute left-0 top-1.5 w-4 h-4 bg-slate-200 rounded-full border-4 border-white shadow-lg"></div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">PLANLANAN</p><h4 className="font-extrabold text-slate-900 tracking-tight">Porselen Dolgu Uygulaması</h4></div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export const ClinicalPage: React.FC = () => {
    return (
        <div className="flex flex-col gap-10 animate-fade-in pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Klinik Yönetim</h1>
                    <div className="flex items-center gap-3 mt-2"><Badge status="active" /><p className="text-slate-500 text-sm font-medium">Hasta: <span className="text-slate-900 font-bold">Zeynep Yılmaz (#1084)</span></p></div>
                </div>
                <div className="flex gap-4"><Button variant="secondary" className="h-14 px-8 rounded-2xl font-bold" icon="folder_shared">Tüm Kayıtlar</Button><Button className="h-14 px-8 rounded-2xl font-bold shadow-xl shadow-primary/20" icon="save">Değişiklikleri Uygula</Button></div>
            </div>
            <Odontogram patientId="1" />
            <DicomViewer />
            <PrescriptionAssistant />
        </div>
    );
};