import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Badge } from '../../components/UI';
import { DRUGS_DB } from '../../constants';

// --- Odontogram Component ---
const Tooth: React.FC<{ number: number; condition?: string; onClick: () => void }> = ({ number, condition, onClick }) => {
    let color = 'fill-white';
    if (condition === 'caries') color = 'fill-red-400';
    if (condition === 'filling') color = 'fill-blue-400';
    if (condition === 'implant') color = 'fill-gray-400';
    if (condition === 'missing') color = 'fill-transparent stroke-gray-300 stroke-dashed';

    return (
        <div onClick={onClick} className="flex flex-col items-center gap-1 cursor-pointer group">
            <svg viewBox="0 0 100 140" className={`w-12 h-16 drop-shadow-sm transition-all hover:scale-110 ${condition === 'missing' ? '' : 'bg-white rounded-lg border border-gray-100'}`}>
                {/* Tooth Root */}
                <path d="M30 140 C 30 100, 40 80, 50 80 C 60 80, 70 100, 70 140" className="fill-yellow-50" />
                {/* Tooth Crown (Simplified Molar) */}
                <path 
                    d="M10 40 Q 10 0, 50 0 Q 90 0, 90 40 L 90 70 Q 90 90, 50 90 Q 10 90, 10 70 Z" 
                    className={`${color} stroke-gray-300 stroke-2`}
                />
                {/* Visual Condition Overlay */}
                {condition === 'caries' && <circle cx="50" cy="40" r="15" className="fill-red-600 opacity-60" />}
                {condition === 'filling' && <rect x="30" y="20" width="40" height="40" className="fill-blue-600 opacity-60" />}
                {condition === 'implant' && <rect x="40" y="80" width="20" height="60" className="fill-gray-600" />}
            </svg>
            <span className="text-xs font-bold text-gray-500 group-hover:text-primary">{number}</span>
        </div>
    );
};

export const Odontogram: React.FC = () => {
    const [selectedTool, setSelectedTool] = useState<'select' | 'caries' | 'filling' | 'implant' | 'missing'>('select');
    const [teethStatus, setTeethStatus] = useState<Record<number, string>>({});

    // ISO numbering: 18-11, 21-28 (Upper), 48-41, 31-38 (Lower)
    const upperTeeth = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
    const lowerTeeth = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

    const handleToothClick = (number: number) => {
        if (selectedTool === 'select') return;
        setTeethStatus(prev => ({
            ...prev,
            [number]: prev[number] === selectedTool ? undefined : selectedTool
        } as Record<number, string>));
    };

    return (
        <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">Odontogram (Diş Haritası)</h3>
                <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                    {[
                        { id: 'select', icon: 'mouse', label: 'Seç' },
                        { id: 'caries', icon: 'coronavirus', label: 'Çürük', color: 'text-red-500' },
                        { id: 'filling', icon: 'format_paint', label: 'Dolgu', color: 'text-blue-500' },
                        { id: 'implant', icon: 'bolt', label: 'İmplant', color: 'text-gray-600' },
                        { id: 'missing', icon: 'do_not_disturb_on', label: 'Eksik', color: 'text-gray-400' },
                    ].map(tool => (
                        <button 
                            key={tool.id}
                            onClick={() => setSelectedTool(tool.id as any)}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-bold transition-all ${selectedTool === tool.id ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <span className={`material-symbols-outlined text-lg ${tool.color}`}>{tool.icon}</span>
                            <span className="hidden md:inline">{tool.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-blue-50/30 rounded-2xl p-8 border border-blue-100 flex flex-col gap-12 items-center overflow-x-auto">
                {/* Upper Arch */}
                <div className="flex gap-2">
                    {upperTeeth.map(t => (
                        <div key={t} className={t === 21 ? 'ml-8' : ''}>
                             <Tooth number={t} condition={teethStatus[t]} onClick={() => handleToothClick(t)} />
                        </div>
                    ))}
                </div>
                {/* Lower Arch */}
                <div className="flex gap-2">
                    {lowerTeeth.map(t => (
                        <div key={t} className={t === 31 ? 'ml-8' : ''}>
                             <Tooth number={t} condition={teethStatus[t]} onClick={() => handleToothClick(t)} />
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="mt-4 text-xs text-gray-400 text-center">
                * Diş üzerine tıklayarak seçili durumu uygulayın.
            </div>
        </Card>
    );
};

// --- DICOM Viewer (Simulated) ---
export const DicomViewer: React.FC = () => {
    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [invert, setInvert] = useState(0);
    const [zoom, setZoom] = useState(1);

    const reset = () => {
        setBrightness(100);
        setContrast(100);
        setInvert(0);
        setZoom(1);
    };

    return (
        <Card className="p-0 overflow-hidden flex flex-col md:flex-row h-[500px]">
            {/* Toolbar */}
            <div className="w-full md:w-64 bg-gray-900 text-white p-6 flex flex-col gap-6 z-10 shrink-0">
                <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-primary">radiology</span>
                    <h3 className="font-bold">DICOM Viewer</h3>
                </div>
                
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>Parlaklık</span>
                            <span>{brightness}%</span>
                        </div>
                        <input type="range" min="50" max="150" value={brightness} onChange={e => setBrightness(Number(e.target.value))} className="w-full accent-primary h-1 bg-gray-700 rounded-lg appearance-none" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>Kontrast</span>
                            <span>{contrast}%</span>
                        </div>
                        <input type="range" min="50" max="200" value={contrast} onChange={e => setContrast(Number(e.target.value))} className="w-full accent-primary h-1 bg-gray-700 rounded-lg appearance-none" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-auto">
                    <button onClick={() => setInvert(prev => prev === 0 ? 1 : 0)} className={`p-2 rounded text-xs font-bold border ${invert ? 'bg-primary border-primary text-white' : 'border-gray-700 hover:bg-gray-800'}`}>
                        Negatif
                    </button>
                    <button onClick={reset} className="p-2 rounded text-xs font-bold border border-gray-700 hover:bg-gray-800 text-gray-300">
                        Sıfırla
                    </button>
                    <button onClick={() => setZoom(z => Math.max(1, z - 0.2))} className="p-2 rounded text-xs font-bold border border-gray-700 hover:bg-gray-800">
                        <span className="material-symbols-outlined text-sm">remove</span>
                    </button>
                    <button onClick={() => setZoom(z => Math.min(3, z + 0.2))} className="p-2 rounded text-xs font-bold border border-gray-700 hover:bg-gray-800">
                        <span className="material-symbols-outlined text-sm">add</span>
                    </button>
                </div>
            </div>

            {/* Viewer Canvas */}
            <div className="flex-1 bg-black relative overflow-hidden flex items-center justify-center cursor-move">
                <div 
                    className="transition-all duration-200"
                    style={{ 
                        transform: `scale(${zoom})`,
                        filter: `brightness(${brightness}%) contrast(${contrast}%) invert(${invert})`
                    }}
                >
                    <img 
                        src="https://images.unsplash.com/photo-1590105577767-15103c624647?q=80&w=2600&auto=format&fit=crop" 
                        alt="X-Ray" 
                        className="max-h-full max-w-full object-contain pointer-events-none select-none opacity-90"
                    />
                </div>
                
                {/* Overlays */}
                <div className="absolute top-4 right-4 text-xs text-gray-500 font-mono">
                    <p>IMG: 0042.DCM</p>
                    <p>TARİH: 24.10.2023</p>
                    <p>HASTA: ZEYNEP YILMAZ</p>
                </div>
            </div>
        </Card>
    );
};

// --- Prescription & Notes ---
export const PrescriptionAssistant: React.FC = () => {
    const [selectedDrugs, setSelectedDrugs] = useState<{name: string, dose: string}[]>([]);
    const [search, setSearch] = useState('');
    const [listening, setListening] = useState(false);
    const [note, setNote] = useState('');

    const addDrug = (drug: typeof DRUGS_DB[0]) => {
        if (!selectedDrugs.find(d => d.name === drug.name)) {
            setSelectedDrugs([...selectedDrugs, drug]);
        }
    };

    const removeDrug = (name: string) => {
        setSelectedDrugs(selectedDrugs.filter(d => d.name !== name));
    };

    const toggleDictation = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert('Tarayıcınız sesli not özelliğini desteklemiyor.');
            return;
        }

        if (listening) {
            setListening(false);
            // Stop logic would go here
        } else {
            setListening(true);
            const recognition = new (window as any).webkitSpeechRecognition();
            recognition.lang = 'tr-TR';
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onresult = (event: any) => {
                const text = event.results[0][0].transcript;
                setNote(prev => prev + (prev ? ' ' : '') + text + '.');
                setListening(false);
            };

            recognition.onerror = () => setListening(false);
            recognition.onend = () => setListening(false);
            recognition.start();
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Prescription */}
            <Card className="p-6 flex flex-col h-full">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">prescriptions</span> E-Reçete Asistanı
                </h3>
                
                <div className="relative mb-4">
                    <input 
                        type="text" 
                        placeholder="İlaç ara..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full p-2 pl-9 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary"
                    />
                    <span className="material-symbols-outlined absolute left-2.5 top-2 text-gray-400 text-lg">search</span>
                    
                    {search && (
                        <div className="absolute top-full left-0 w-full bg-white border border-gray-200 shadow-lg rounded-lg mt-1 z-10 max-h-40 overflow-y-auto">
                            {DRUGS_DB.filter(d => d.name.toLowerCase().includes(search.toLowerCase())).map(drug => (
                                <div 
                                    key={drug.name} 
                                    onClick={() => { addDrug(drug); setSearch(''); }}
                                    className="p-2 hover:bg-gray-50 cursor-pointer text-sm flex justify-between"
                                >
                                    <span className="font-medium">{drug.name}</span>
                                    <span className="text-gray-500 text-xs">{drug.type}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex-1 border border-gray-100 rounded-lg p-2 bg-gray-50 mb-4 overflow-y-auto min-h-[150px]">
                    {selectedDrugs.length === 0 && <p className="text-gray-400 text-sm text-center mt-10">Henüz ilaç eklenmedi.</p>}
                    {selectedDrugs.map((drug, i) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-white rounded border border-gray-200 mb-2 shadow-sm">
                            <div>
                                <p className="font-bold text-sm text-gray-800">{drug.name}</p>
                                <input type="text" defaultValue={drug.dose} className="text-xs text-gray-500 border-none bg-transparent outline-none p-0 w-24 focus:text-primary" />
                            </div>
                            <button onClick={() => removeDrug(drug.name)} className="text-gray-400 hover:text-red-500"><span className="material-symbols-outlined text-lg">close</span></button>
                        </div>
                    ))}
                </div>

                <div className="flex gap-2">
                    <Button variant="secondary" className="flex-1 text-sm">Taslağı Kaydet</Button>
                    <Button className="flex-1 text-sm" icon="print">Reçete Yazdır</Button>
                </div>
            </Card>

            {/* Clinical Notes & Timeline */}
            <div className="flex flex-col gap-6">
                <Card className="p-6">
                     <div className="flex justify-between items-center mb-4">
                         <h3 className="font-bold text-lg flex items-center gap-2">
                             <span className="material-symbols-outlined text-primary">mic</span> Klinik Notlar
                         </h3>
                         <button 
                            onClick={toggleDictation}
                            className={`p-2 rounded-full transition-all ${listening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                             <span className="material-symbols-outlined">{listening ? 'mic_off' : 'mic'}</span>
                         </button>
                     </div>
                     <textarea 
                        className="w-full h-32 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-gray-700 outline-none focus:ring-2 focus:ring-yellow-300/50 resize-none"
                        placeholder="Not almak için mikrofon ikonuna tıklayın veya yazın..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                     ></textarea>
                </Card>

                <Card className="p-6 flex-1">
                    <h3 className="font-bold text-lg mb-4">Tedavi Planı</h3>
                    <div className="relative pl-4 space-y-6 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                        <div className="relative pl-6">
                            <div className="absolute left-0 top-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow"></div>
                            <p className="text-xs text-gray-400 font-bold mb-0.5">BUGÜN</p>
                            <h4 className="font-bold text-gray-900">Panoramik Röntgen & Muayene</h4>
                            <p className="text-sm text-gray-500">Teşhis konuldu, planlama yapıldı.</p>
                        </div>
                        <div className="relative pl-6">
                            <div className="absolute left-0 top-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow"></div>
                            <p className="text-xs text-gray-400 font-bold mb-0.5">28 EKİM 2023</p>
                            <h4 className="font-bold text-gray-900">İmplant Cerrahisi (Sol Alt 36)</h4>
                            <p className="text-sm text-gray-500">Lokal anestezi altında implant yerleşimi.</p>
                        </div>
                        <div className="relative pl-6 opacity-60">
                            <div className="absolute left-0 top-1 w-3 h-3 bg-gray-300 rounded-full border-2 border-white shadow"></div>
                            <p className="text-xs text-gray-400 font-bold mb-0.5">OCAK 2024 (Tahmini)</p>
                            <h4 className="font-bold text-gray-900">Üst Yapı & Kuron</h4>
                            <p className="text-sm text-gray-500">İyileşme sonrası porselen diş takılması.</p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

// --- Main Page Component ---
export const ClinicalPage: React.FC = () => {
    return (
        <div className="flex flex-col gap-6 animate-fade-in pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Klinik Yönetim Modülü</h1>
                    <p className="text-gray-500 text-sm">Aktif Hasta: <span className="font-bold text-gray-900">Zeynep Yılmaz (Dosya No: #1084)</span></p>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" icon="folder_open">Hasta Dosyası</Button>
                    <Button icon="save">Değişiklikleri Kaydet</Button>
                </div>
            </div>

            <Odontogram />
            <DicomViewer />
            <PrescriptionAssistant />
        </div>
    );
};
