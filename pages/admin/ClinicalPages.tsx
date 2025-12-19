import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Badge } from '../../components/UI';
import { db } from '../../lib/db';
import { DRUGS_DB } from '../../constants';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';

// @ts-ignore
import cornerstone from 'cornerstone-core';
// @ts-ignore
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
// @ts-ignore
import dicomParser from 'dicom-parser';
// @ts-ignore
import Hammer from 'hammerjs';
// @ts-ignore
import cornerstoneTools from 'cornerstone-tools';
// @ts-ignore
import cornerstoneMath from 'cornerstone-math';

// Cornerstone Başlatma
if (typeof window !== 'undefined') {
    try {
        cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
        cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
        cornerstoneWADOImageLoader.external.hammer = Hammer;
        
        // Tools Config
        cornerstoneTools.external.cornerstone = cornerstone;
        cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
        cornerstoneTools.external.hammer = Hammer;
        cornerstoneTools.init();

        cornerstoneWADOImageLoader.configure({
            useWebWorkers: true,
        });
    } catch (e) {
        console.warn('DICOM kütüphaneleri yüklenemedi. Lütfen: npm install cornerstone-core cornerstone-wado-image-loader dicom-parser hammerjs cornerstone-tools cornerstone-math');
    }
}

// --- Tooth Component ---
const Tooth: React.FC<{ number: number; condition?: string; onClick: () => void }> = ({ number, condition, onClick }) => {
    let color = 'fill-white';
    if (condition === 'caries') color = 'fill-red-400';
    if (condition === 'filling') color = 'fill-blue-400';
    if (condition === 'implant') color = 'fill-gray-400';
    if (condition === 'missing') color = 'fill-transparent stroke-gray-300 stroke-dashed';

    const getLabel = (c?: string) => {
        switch(c) {
            case 'caries': return 'Çürük';
            case 'filling': return 'Dolgu';
            case 'implant': return 'İmplant';
            case 'missing': return 'Eksik';
            default: return 'Sağlıklı';
        }
    };

    return (
        <div onClick={onClick} title={`Diş ${number}: ${getLabel(condition)}`} className="flex flex-col items-center gap-1 cursor-pointer group relative">
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
    const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
    const [plannedTreatments, setPlannedTreatments] = useState<any[]>([]);
    const [planForm, setPlanForm] = useState({ treatment: '', price: '' });
    const [treatmentsList, setTreatmentsList] = useState<any[]>([]);
    const [campaignsList, setCampaignsList] = useState<any[]>([]);
    const [selectedCampaign, setSelectedCampaign] = useState<string>('');

    useEffect(() => {
        const loadTeeth = async () => {
            const { data } = await supabase.from('teeth_records').select('*').eq('patient_id', patientId);
            if (data) {
                const statusMap: Record<number, string> = {};
                data.forEach(item => { statusMap[item.tooth_number] = item.condition; });
                setTeethStatus(statusMap);
            }
        };
        const loadPlans = async () => {
            const { data } = await supabase.from('treatment_plans').select('*').eq('patient_id', patientId);
            if (data) setPlannedTreatments(data);
        };
        const loadMeta = async () => {
            const { data: t } = await supabase.from('treatments').select('*');
            if (t) setTreatmentsList(t);
            
            const { data: c } = await supabase.from('campaigns').select('*').eq('is_active', true);
            if (c) setCampaignsList(c);
        };
        loadTeeth();
        loadPlans();
        loadMeta();
    }, [patientId]);

    const handleToothClick = async (number: number) => {
        if (selectedTool === 'select') {
            setSelectedTooth(number);
            return;
        }
        const newCondition = teethStatus[number] === selectedTool ? 'healthy' : selectedTool;
        
        setTeethStatus(prev => ({ ...prev, [number]: newCondition }));
        
        const { error } = await supabase.from('teeth_records').upsert({
            patient_id: patientId,
            tooth_number: number,
            condition: newCondition,
            updated_at: new Date().toISOString()
        }, { onConflict: 'patient_id, tooth_number' });

        if (error) {
            alert('Diş durumu kaydedilirken hata oluştu: ' + error.message);
        }
    };

    const handleTreatmentSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tName = e.target.value;
        const t = treatmentsList.find(item => item.name === tName);
        setPlanForm({ ...planForm, treatment: tName, price: t ? t.price.toString() : planForm.price });
    };

    const calculateFinalPrice = () => {
        const price = Number(planForm.price) || 0;
        const campaign = campaignsList.find(c => c.id === selectedCampaign);
        if (campaign) {
            const discount = (price * campaign.discount_percentage) / 100;
            return price - discount;
        }
        return price;
    };

    const addPlan = async () => {
        if (!selectedTooth || !planForm.treatment) return;
        
        const currentCondition = teethStatus[selectedTooth];

        // Eksik Diş Kısıtlaması
        if (currentCondition === 'missing') {
            const t = planForm.treatment.toLowerCase();
            if (!t.includes('implant') && !t.includes('protez')) {
                alert('UYARI: "Eksik" olarak işaretlenmiş bir dişe sadece "İmplant" veya "Protez" işlemi uygulanabilir.');
                return;
            }
        }

        // Diş Durumu Kontrolü (Çakışma Uyarısı)
        if (currentCondition && currentCondition !== 'healthy') {
             let conditionLabel = '';
             switch(currentCondition) {
                 case 'caries': conditionLabel = 'Çürük'; break;
                 case 'filling': conditionLabel = 'Dolgu'; break;
                 case 'implant': conditionLabel = 'İmplant'; break;
                 case 'missing': conditionLabel = 'Eksik Diş'; break;
             }
             
             if (conditionLabel && !confirm(`Diş #${selectedTooth} üzerinde "${conditionLabel}" durumu kayıtlı. Yeni işlem eklemeye devam etmek istiyor musunuz?`)) {
                 return;
             }
        }

        // Kampanya Süre Kontrolü
        if (selectedCampaign) {
            const campaign = campaignsList.find(c => c.id === selectedCampaign);
            if (campaign && campaign.end_date) {
                const today = new Date().toISOString().split('T')[0];
                if (campaign.end_date < today) {
                    alert('UYARI: Seçilen kampanyanın geçerlilik süresi dolmuştur!');
                    if (!confirm('Süresi dolmuş kampanya ile devam etmek istiyor musunuz?')) {
                        setSelectedCampaign('');
                        return;
                    }
                }
            }
        }
        
        const originalPrice = Number(planForm.price) || 0;
        const finalPrice = calculateFinalPrice();
        const discount = originalPrice - finalPrice;

        const newPlan = {
            patient_id: patientId,
            tooth_number: selectedTooth,
            treatment: planForm.treatment,
            price: finalPrice,
            original_price: originalPrice,
            campaign_id: selectedCampaign || null,
            discount_applied: discount,
            status: 'planned'
        };
        const { data, error } = await supabase.from('treatment_plans').insert([newPlan]).select();
        if (data) {
            setPlannedTreatments([...plannedTreatments, data[0]]);
            setPlanForm({ treatment: '', price: '' });
            setSelectedCampaign('');
            setSelectedTooth(null);
        } else if (error) {
            alert('Plan eklenirken hata: ' + error.message);
        }
    };

    const completePlan = async (plan: any) => {
        if (!confirm('Bu tedaviyi tamamlandı olarak işaretleyip faturaya yansıtmak istiyor musunuz?')) return;

        const { error: planError } = await supabase.from('treatment_plans').update({ status: 'completed' }).eq('id', plan.id);
        if (planError) return alert('Hata: ' + planError.message);

        const { error: trxError } = await supabase.from('transactions').insert({
            patient_id: patientId,
            type: `Diş No: ${plan.tooth_number} - ${plan.treatment}`,
            amount: plan.price,
            status: 'pending',
            date: new Date().toISOString()
        });

        if (trxError) alert('Fatura oluşturulamadı: ' + trxError.message);
        else {
            setPlannedTreatments(prev => prev.map(p => p.id === plan.id ? { ...p, status: 'completed' } : p));
        }
    };

    const upperRight = [18, 17, 16, 15, 14, 13, 12, 11];
    const upperLeft = [21, 22, 23, 24, 25, 26, 27, 28];
    const lowerRight = [48, 47, 46, 45, 44, 43, 42, 41];
    const lowerLeft = [31, 32, 33, 34, 35, 36, 37, 38];

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
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-blue-50/30 rounded-[32px] p-10 border border-blue-100 flex flex-col gap-12 items-center overflow-x-auto">
                {/* Upper Jaw */}
                <div className="flex gap-8 pb-8 border-b-2 border-dashed border-blue-200/50 w-full justify-center relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 -rotate-90 text-xs font-extrabold text-blue-300 tracking-widest">ÜST ÇENE</div>
                    <div className="flex gap-2">{upperRight.map(t => <Tooth key={t} number={t} condition={teethStatus[t]} onClick={() => handleToothClick(t)} />)}</div>
                    <div className="w-px bg-blue-200 h-20 mx-4 self-center"></div>
                    <div className="flex gap-2">{upperLeft.map(t => <Tooth key={t} number={t} condition={teethStatus[t]} onClick={() => handleToothClick(t)} />)}</div>
                </div>
                {/* Lower Jaw */}
                <div className="flex gap-8 pt-2 w-full justify-center relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 -rotate-90 text-xs font-extrabold text-blue-300 tracking-widest">ALT ÇENE</div>
                    <div className="flex gap-2">{lowerRight.map(t => <Tooth key={t} number={t} condition={teethStatus[t]} onClick={() => handleToothClick(t)} />)}</div>
                    <div className="w-px bg-blue-200 h-20 mx-4 self-center"></div>
                    <div className="flex gap-2">{lowerLeft.map(t => <Tooth key={t} number={t} condition={teethStatus[t]} onClick={() => handleToothClick(t)} />)}</div>
                </div>
                </div>

                {/* Tedavi Planı Paneli */}
                <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-lg flex flex-col h-full">
                    <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-primary">assignment</span> Tedavi Planı</h4>
                    
                    {selectedTooth ? (
                        <div className="mb-6 p-4 bg-blue-50 rounded-2xl border border-blue-100 animate-fade-in">
                            <p className="text-xs font-bold text-blue-500 uppercase mb-2">Diş #{selectedTooth} İçin Plan Ekle</p>
                            <div className="flex flex-col gap-2">
                                <input list="treatments-list" value={planForm.treatment} onChange={handleTreatmentSelect} placeholder="Yapılacak İşlem (Seç veya Yaz)" className="p-2 rounded-lg border border-blue-200 text-sm" />
                                <datalist id="treatments-list">
                                    {treatmentsList.map(t => <option key={t.id} value={t.name} />)}
                                </datalist>
                                
                                <input type="number" value={planForm.price} onChange={e => setPlanForm({...planForm, price: e.target.value})} placeholder="Fiyat (₺)" className="p-2 rounded-lg border border-blue-200 text-sm" />
                                
                                <select value={selectedCampaign} onChange={e => setSelectedCampaign(e.target.value)} className="p-2 rounded-lg border border-blue-200 text-sm bg-white">
                                    <option value="">Kampanya Seç (Opsiyonel)</option>
                                    {campaignsList.map(c => <option key={c.id} value={c.id}>{c.title || c.name} (%{c.discount_percentage} İndirim)</option>)}
                                </select>

                                {selectedCampaign && (
                                    <p className="text-xs font-bold text-green-600 text-right">İndirimli Tutar: {calculateFinalPrice()} ₺</p>
                                )}

                                <div className="flex gap-2 mt-1">
                                    <button onClick={() => setSelectedTooth(null)} className="flex-1 py-2 bg-white text-slate-500 rounded-lg text-xs font-bold border border-slate-200">İptal</button>
                                    <button onClick={addPlan} className="flex-1 py-2 bg-primary text-white rounded-lg text-xs font-bold">Ekle</button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                            <p className="text-xs text-slate-400 font-bold">Plan eklemek için haritadan bir diş seçin.</p>
                        </div>
                    )}

                    <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[300px]">
                        {plannedTreatments.map(plan => (
                            <div key={plan.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[10px] font-bold border border-slate-200">#{plan.tooth_number}</span>
                                        <span className={`text-sm font-bold ${plan.status === 'completed' ? 'text-green-600 line-through' : 'text-slate-700'}`}>{plan.treatment}</span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 ml-8">{new Date(plan.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center gap-3 flex-col items-end">
                                    <div className="flex items-center gap-1">
                                        <span className="text-xs font-bold text-primary">{plan.price} ₺</span>
                                        {plan.campaign_id && <span className="material-symbols-outlined text-sm text-green-500" title="Kampanya İndirimi">local_offer</span>}
                                    </div>
                                    {plan.discount_applied > 0 && (
                                        <span className="text-[9px] font-bold text-green-500 line-through opacity-60">{plan.original_price} ₺</span>
                                    )}
                                    {plan.status !== 'completed' && (
                                        <button onClick={() => completePlan(plan)} className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors" title="Tamamla ve Faturalandır">
                                            <span className="material-symbols-outlined text-sm">check</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {plannedTreatments.length === 0 && <p className="text-center text-xs text-slate-300 py-4">Planlanmış tedavi yok.</p>}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export const DicomViewer: React.FC<{ patientId?: string }> = ({ patientId }) => {
    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [invert, setInvert] = useState(0);
    const [zoom, setZoom] = useState(1);
    const [files, setFiles] = useState<any[]>([]);
    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const dicomRef = useRef<HTMLDivElement>(null);
    const [initialViewport, setInitialViewport] = useState<any>(null);
    const [isPanning, setIsPanning] = useState(false);
    const lastMousePos = useRef({ x: 0, y: 0 });
    const [activeTool, setActiveTool] = useState('Pan');

    const isImage = selectedFile && ['jpg', 'jpeg', 'png', 'webp'].includes(selectedFile.file_type?.toLowerCase());

    useEffect(() => {
        if (patientId) {
            const loadFiles = async () => {
                const { data } = await supa
                if (data && data.length > 0) setSelectedFile(data[0]);
            };
            loadFiles();
        }
    }, [patientId]);

    useEffect(() => {
        if (selectedFile) {
            const { data } = supabase.storage.from('patient-files').getPublicUrl(selectedFile.file_url);
            setFileUrl(data.publicUrl);
        } else {
            setFileUrl(null);
        }
    }, [selectedFile]);

    // Cornerstone Enable/Disable Yönetimi
    useEffect(() => {
        if (dicomRef.current && !isImage) {
            const element = dicomRef.current;
            try {
                cornerstone.enable(element);
            } catch (e) { /* Zaten etkinse hata verme */ }
            
            return () => {
                try { cornerstone.disable(element); } catch (e) {}
            };
        }
    }, [isImage]);

    // DICOM Görüntüleme Efekti
    useEffect(() => {
        if (selectedFile && !isImage && fileUrl && dicomRef.current) {
            const element = dicomRef.current;
            try {
                const imageId = `wadouri:${fileUrl}`;
                cornerstone.loadImage(imageId).then(async (image: any) => {
                    cornerstone.displayImage(element, image);
                    // Görüntü boyutlandırma sorunu için resize
                    cornerstone.resize(element);

                    // Araçları Ekle
                    const LengthTool = cornerstoneTools.LengthTool;
                    const AngleTool = cornerstoneTools.AngleTool;
                    cornerstoneTools.addTool(LengthTool);
                    cornerstoneTools.addTool(AngleTool);

                    // Kayıtlı Ölçümleri Yükle
                    const { data: ann } = await supabase.from('dicom_annotations').select('tool_state').eq('file_id', selectedFile.id).order('created_at', { ascending: false }).limit(1).single();
                    if (ann && ann.tool_state) {
                        const state = ann.tool_state;
                        if (state.Length) {
                            state.Length.data.forEach((d: any) => cornerstoneTools.addToolState(element, 'Length', d));
                        }
                        if (state.Angle) {
                            state.Angle.data.forEach((d: any) => cornerstoneTools.addToolState(element, 'Angle', d));
                        }
                        cornerstone.updateImage(element);
                    }
                    
                    // Varsayılan viewport ayarları
                    const viewport = cornerstone.getViewport(element);
                    setInitialViewport(viewport);
                    if (viewport) {
                        viewport.scale = zoom;
                        viewport.invert = invert === 1;
                    }
                }).catch((err: any) => {
                    console.error("DICOM Yükleme Hatası:", err);
                });
            } catch (error) {
                console.error("Cornerstone Hatası:", error);
            }
        }
    }, [selectedFile, isImage, fileUrl]);

    // Kontrolleri Senkronize Et
    useEffect(() => {
        if (dicomRef.current && selectedFile && !isImage && initialViewport) {
            try {
                const element = dicomRef.current;
                const viewport = cornerstone.getViewport(element);
                if (viewport) {
                    // Zoom (Scale)
                    viewport.scale = initialViewport.scale * zoom;
                    // Invert
                    viewport.invert = invert === 1;
                    
                    // Parlaklık ve Kontrast Senkronizasyonu
                    // Contrast (Window Width): Değer düştükçe kontrast artar (pencere daralır)
                    if (initialViewport.voi) {
                        viewport.voi.windowWidth = initialViewport.voi.windowWidth * (100 / contrast);
                        // Brightness (Window Center): Additive shift
                        const shift = (brightness - 100) * (initialViewport.voi.windowWidth / 200);
                        viewport.voi.windowCenter = initialViewport.voi.windowCenter - shift;
                    }
                    
                    cornerstone.setViewport(element, viewport);
                }
            } catch(e) {}
        }
    }, [zoom, invert, brightness, contrast]);

    // Mouse Olayları (Pan & Zoom)
    const handleWheel = (e: React.WheelEvent) => {
        if (isImage) return;
        setZoom(z => Math.max(0.1, z + (e.deltaY > 0 ? -0.1 : 0.1)));
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (isImage) return;
        setIsPanning(true);
        lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isPanning || !dicomRef.current || isImage) return;
        const element = dicomRef.current;
        const viewport = cornerstone.getViewport(element);
        if (viewport) {
            viewport.translation.x += (e.clientX - lastMousePos.current.x) / viewport.scale;
            viewport.translation.y += (e.clientY - lastMousePos.current.y) / viewport.scale;
            cornerstone.setViewport(element, viewport);
            lastMousePos.current = { x: e.clientX, y: e.clientY };
        }
    };

    const handleMouseUp = () => setIsPanning(false);

    const activateTool = (toolName: string) => {
        cornerstoneTools.setToolActive(toolName, { mouseButtonMask: 1 });
        setActiveTool(toolName);
    };

    const applyPreset = (preset: { ww: number, wc: number }) => {
        if (!dicomRef.current || isImage) return;
        const element = dicomRef.current;
        const viewport = cornerstone.getViewport(element);
        if (viewport) {
            viewport.voi.windowWidth = preset.ww;
            viewport.voi.windowCenter = preset.wc;
            cornerstone.setViewport(element, viewport);
        }
    };

    const resetView = () => {
        setBrightness(100);
        setContrast(100);
        setInvert(0);
        setZoom(1);

        if (dicomRef.current && !isImage) {
            const element = dicomRef.current;
            try {
                const viewport = cornerstone.getViewport(element);
                if (viewport) {
                    viewport.translation = { x: 0, y: 0 };
                    cornerstone.setViewport(element, viewport);
                }
            } catch (e) {}
        }
    };

    const saveMeasurements = async () => {
        if (!selectedFile || !dicomRef.current) return;
        const element = dicomRef.current;
        
        const lengthState = cornerstoneTools.getToolState(element, 'Length');
        const angleState = cornerstoneTools.getToolState(element, 'Angle');
        
        const toolState = {
            Length: lengthState,
            Angle: angleState
        };

        const { error } = await supabase.from('dicom_annotations').insert({
            file_id: selectedFile.id,
            tool_state: toolState
        });
        
        if (error) alert('Hata: ' + error.message);
        else alert('Ölçümler kaydedildi.');
    };

    return (
        <Card className="p-0 overflow-hidden flex flex-col md:flex-row h-[80vh] min-h-[600px] border-none shadow-2xl rounded-[40px] bg-black">
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
                    <div className="grid grid-cols-2 gap-2 pt-2">
                        <button onClick={() => applyPreset({ ww: 2000, wc: 300 })} className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-[10px] font-bold text-gray-300">Kemik</button>
                        <button onClick={() => applyPreset({ ww: 400, wc: 40 })} className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-[10px] font-bold text-gray-300">Yumuşak D.</button>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-auto">
                    <button onClick={() => setInvert(prev => prev === 0 ? 1 : 0)} className={`p-3 rounded-xl text-xs font-bold border transition-all ${invert ? 'bg-primary border-primary text-white' : 'border-gray-700 hover:bg-gray-800 text-gray-400'}`}>Negatif</button>
                    <button onClick={resetView} className="p-3 rounded-xl text-xs font-bold border border-gray-700 hover:bg-gray-800 text-gray-400">Sıfırla</button>
                    
                    {/* Ölçüm Araçları */}
                    <button onClick={() => activateTool('Length')} className={`p-3 rounded-xl text-xs font-bold border transition-all ${activeTool === 'Length' ? 'bg-primary border-primary text-white' : 'border-gray-700 hover:bg-gray-800 text-gray-400'}`}>Cetvel</button>
                    <button onClick={() => activateTool('Angle')} className={`p-3 rounded-xl text-xs font-bold border transition-all ${activeTool === 'Angle' ? 'bg-primary border-primary text-white' : 'border-gray-700 hover:bg-gray-800 text-gray-400'}`}>Açı</button>

                    <button onClick={saveMeasurements} className="col-span-2 p-3 rounded-xl text-xs font-bold bg-green-600 text-white hover:bg-green-700 transition-all flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-sm">save</span> Ölçümleri Kaydet
                    </button>

                    <button onClick={() => setZoom(z => Math.max(1, z - 0.2))} className="p-3 rounded-xl border border-gray-700 hover:bg-gray-800 text-white flex items-center justify-center"><span className="material-symbols-outlined">zoom_out</span></button>
                    <button onClick={() => setZoom(z => Math.min(3, z + 0.2))} className="p-3 rounded-xl border border-gray-700 hover:bg-gray-800 text-white flex items-center justify-center"><span className="material-symbols-outlined">zoom_in</span></button>
                </div>
                
                {/* Dosya Listesi */}
                <div className="mt-4 border-t border-gray-800 pt-4">
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Hasta Dosyaları</h4>
                    <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
                        {files.map(f => (
                            <button key={f.id} onClick={() => setSelectedFile(f)} className={`text-left text-xs p-2 rounded-lg flex justify-between items-center group ${selectedFile?.id === f.id ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-800'}`}>
                                <span className="truncate max-w-[140px]" title={f.file_name}>{f.file_name || 'İsimsiz Dosya'}</span>
                                <span className={`text-[9px] ${selectedFile?.id === f.id ? 'text-white/70' : 'text-gray-600 group-hover:text-gray-400'}`}>{new Date(f.created_at).toLocaleDateString()}</span>
                            </button>
                        ))}
                        {files.length === 0 && <p className="text-[10px] text-gray-600">Görüntülenecek DICOM dosyası yok.</p>}
                    </div>
                </div>
            </div>
            <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-slate-950">
                <div className={`transition-all duration-300 ${isImage ? '' : 'w-full h-full'}`} style={isImage ? { transform: `scale(${zoom})`, filter: `brightness(${brightness}%) contrast(${contrast}%) invert(${invert})` } : {}}>
                    {isImage && fileUrl ? (
                        <img src={fileUrl} alt="Medical Scan" className="max-h-[500px] object-contain shadow-2xl" />
                    ) : selectedFile ? (
                        <div 
                            ref={dicomRef} 
                            className="w-full h-full cursor-move" 
                            onContextMenu={e => e.preventDefault()}
                            onWheel={handleWheel}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                        />
                    ) : (
                        <div className="text-gray-600 font-bold flex flex-col items-center gap-2">
                            <span className="material-symbols-outlined text-4xl">image_search</span>
                            <p>Görüntülemek için listeden bir dosya seçin.</p>
                        </div>
                    )}
                </div>
                <div className="absolute top-8 right-8 text-[10px] text-gray-500 font-mono bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/5 space-y-1 pointer-events-none">
                    <p>DOSYA: {selectedFile?.file_name || 'SEÇİLMEDİ'}</p>
                    <p>TARİH: {selectedFile ? new Date(selectedFile.created_at).toLocaleDateString() : '-'}</p>
                </div>
            </div>
        </Card>
    );
};

export const PrescriptionAssistant: React.FC<{ patientId?: string }> = ({ patientId }) => {
    const { settings } = useSettings();
    const { user } = useAuth();
    const [selectedDrugs, setSelectedDrugs] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [listening, setListening] = useState(false);
    const [note, setNote] = useState('');
    const [noteId, setNoteId] = useState<string | null>(null);
    const [pastNotes, setPastNotes] = useState<any[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const [timeline, setTimeline] = useState<any[]>([]);
    const [filterDate, setFilterDate] = useState('');
    
    // İlaç Talimat Modalı
    const [showDrugModal, setShowDrugModal] = useState(false);
    const [pendingDrug, setPendingDrug] = useState<any>(null);
    const [drugInstruction, setDrugInstruction] = useState('');

    const NOTE_TEMPLATES = [
        { label: 'Genel Normal', text: 'Genel muayene yapıldı. Bulgular normal. Patolojik bir duruma rastlanmadı.' },
        { label: 'Dolgu Sonrası', text: 'Dolgu işlemi tamamlandı. Hastaya 2 saat bir şey yememesi ve sıcak/soğuk hassasiyeti olabileceği bilgisi verildi.' },
        { label: 'Kanal Tedavisi', text: 'Kanal tedavisi ilk seansı tamamlandı. Geçici dolgu yapıldı. Ağrı durumunda analjezik önerildi.' },
        { label: 'Diş Taşı', text: 'Detertraj işlemi uygulandı. Oral hijyen eğitimi verildi.' }
    ];

    useEffect(() => {
        if (patientId) {
            // Notları Çek
            const loadNote = async () => {
                const { data } = await supabase.from('clinical_notes').select('*').eq('patient_id', patientId).order('created_at', { ascending: false });
                if (data && data.length > 0) {
                    setNote(data[0].note || '');
                    setNoteId(data[0].id);
                    setPastNotes(data.slice(1));
                } else {
                    setNote('');
                    setNoteId(null);
                    setPastNotes([]);
                }
            };
            // Reçeteyi Çek
            const loadPrescription = async () => {
                const { data } = await supabase.from('prescriptions').select('drugs').eq('patient_id', patientId).order('created_at', { ascending: false }).limit(1).single();
                if (data && data.drugs) setSelectedDrugs(data.drugs);
                else setSelectedDrugs([]);
            };
            // Zaman Çizelgesini Çek
            const loadTimeline = async () => {
                const { data } = await supabase.from('appointments').select('*').eq('patient_id', patientId).order('date', { ascending: false }).limit(5);
                if(data) setTimeline(data);
            };
            loadNote();
            loadPrescription();
            loadTimeline();
        }
    }, [patientId]);

    const saveNote = async () => {
        if (!patientId) return;
        if (noteId) {
            await supabase.from('clinical_notes').update({ note, updated_at: new Date().toISOString() }).eq('id', noteId);
        } else {
            const { data } = await supabase.from('clinical_notes').insert({ patient_id: patientId, note }).select().single();
            if (data) setNoteId(data.id);
        }
    };

    const handleNewNote = () => {
        if (noteId && note) setPastNotes(prev => [{ id: noteId, note, created_at: new Date().toISOString() }, ...prev]);
        setNote('');
        setNoteId(null);
    };

    const deleteNote = async (id: string) => {
        if(!confirm('Bu notu silmek istediğinize emin misiniz?')) return;
        const { error } = await supabase.from('clinical_notes').delete().eq('id', id);
        if(!error) {
            setPastNotes(prev => prev.filter(n => n.id !== id));
            if(noteId === id) { setNote(''); setNoteId(null); }
        }
    };

    const savePrescription = async () => {
        if (!patientId || selectedDrugs.length === 0) return;
        const { error } = await supabase.from('prescriptions').insert({
            patient_id: patientId,
            drugs: selectedDrugs
        });
        if (!error) alert('Reçete başarıyla kaydedildi.');
        else alert('Hata: ' + error.message);
    };

    const initiateDrugAdd = (drug: any) => {
        setPendingDrug(drug);
        setDrugInstruction('1x1, Tok karnına');
        setShowDrugModal(true);
    };

    const confirmDrugAdd = () => {
        if (pendingDrug) {
            setSelectedDrugs([...selectedDrugs, { ...pendingDrug, dose: drugInstruction }]);
            setPendingDrug(null);
            setDrugInstruction('');
            setShowDrugModal(false);
            setSearch('');
        }
    };

    const printPrescription = () => {
        if (selectedDrugs.length === 0) return;
        const printWindow = window.open('', '', 'height=600,width=800');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Reçete</title>');
            printWindow.document.write('<style>body{font-family: sans-serif; padding: 40px;} table{width: 100%; border-collapse: collapse; margin-top: 20px;} th, td{border: 1px solid #ddd; padding: 12px; text-align: left;} th{background-color: #f8f9fa;} .header{margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 10px;}</style>');
            printWindow.document.write('</head><body>');
            
            const clinicName = settings?.clinic_name || 'DentCare Klinik';
            const clinicAddress = settings?.address || 'Bağdat Cad. No:123, Kadıköy/İstanbul';
            const clinicPhone = settings?.phone || '(0216) 123 45 67';
            const doctorName = user?.email || 'Dt. Hekim';

            // Klinik Logosu ve Bilgileri
            printWindow.document.write(`
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px;">
                    <div style="display:flex; align-items:center; gap:15px;">
                        <div style="width:60px; height:60px; background:#1a365d; border-radius:10px; display:flex; align-items:center; justify-content:center; color:white; font-weight:bold; font-size:24px;">DC</div>
                        <div>
                            <h2 style="margin:0; color:#1a365d; font-size:20px;">${clinicName}</h2>
                            <p style="margin:5px 0 0 0; font-size:12px; color:#666;">${clinicAddress}<br/>Tel: ${clinicPhone}</p>
                        </div>
                    </div>
                    <div style="text-align:right;">
                        <h1 style="margin:0; font-size:24px; letter-spacing: 2px;">REÇETE</h1>
                        <p style="margin:5px 0 0 0; font-size:14px; color:#666;"><strong>Tarih:</strong> ${new Date().toLocaleDateString('tr-TR')}</p>
                        <p style="margin:5px 0 0 0; font-size:12px; color:#666;"><strong>Dr:</strong> ${doctorName}</p>
                    </div>
                </div>
            `);

            printWindow.document.write('<table><thead><tr><th>İlaç Adı</th><th>Doz/Kullanım</th><th>Tip</th></tr></thead><tbody>');
            selectedDrugs.forEach(drug => {
                printWindow.document.write(`<tr><td><strong>${drug.name}</strong></td><td>${drug.dose}</td><td>${drug.type}</td></tr>`);
            });
            printWindow.document.write('</tbody></table>');
            printWindow.document.write('<div style="margin-top: 50px; text-align: right;"><h4>Doktor Kaşe/İmza</h4></div>');
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
        }
    };

    const printNote = () => {
        if (!note) return;
        const printWindow = window.open('', '', 'height=600,width=800');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Klinik Not - PDF</title>');
            printWindow.document.write('<style>body{font-family: sans-serif; padding: 40px; line-height: 1.6;} h1{border-bottom: 2px solid #333; padding-bottom: 10px;}</style>');
            printWindow.document.write('</head><body>');
            printWindow.document.write(`<h1>Klinik Notu</h1><p><strong>Tarih:</strong> ${new Date().toLocaleDateString()}</p><hr/><br/>`);
            printWindow.document.write(`<div style="white-space: pre-wrap;">${note}</div>`);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
        }
    };

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
            {showDrugModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl">
                        <h3 className="text-xl font-extrabold text-gray-900 mb-4">Kullanım Talimatı</h3>
                        <div className="flex flex-col gap-4">
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <p className="font-bold text-slate-900">{pendingDrug?.name}</p>
                                <p className="text-xs text-slate-500">{pendingDrug?.type}</p>
                            </div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Doz ve Talimat</label>
                            <input value={drugInstruction} onChange={e => setDrugInstruction(e.target.value)} className="p-4 border-2 border-slate-100 rounded-xl font-bold outline-none focus:border-primary transition-all" placeholder="Örn: 2x1, Tok karnına" autoFocus />
                            <div className="flex gap-3 mt-2"><Button variant="outline" className="flex-1" onClick={() => setShowDrugModal(false)}>İptal</Button><Button className="flex-1" onClick={confirmDrugAdd}>Ekle</Button></div>
                        </div>
                    </div>
                </div>
            )}
            {showHistory && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setShowHistory(false)}>
                    <div className="bg-white rounded-[32px] p-8 w-full max-w-lg shadow-2xl max-h-[80vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-extrabold text-gray-900">Geçmiş Notlar</h3>
                            <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="p-2 border rounded-lg text-sm" />
                            <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-gray-100 rounded-full"><span className="material-symbols-outlined">close</span></button>
                        </div>
                        <div className="overflow-y-auto flex-1 space-y-4 pr-2">
                            {pastNotes.filter(n => !filterDate || n.created_at.startsWith(filterDate)).length === 0 && <p className="text-center text-gray-400 py-10">Kayıt bulunamadı.</p>}
                            {pastNotes.filter(n => !filterDate || n.created_at.startsWith(filterDate)).map((n: any) => (
                                <div key={n.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group relative">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="text-xs font-bold text-slate-400">{new Date(n.created_at).toLocaleDateString('tr-TR')} - {new Date(n.created_at).toLocaleTimeString('tr-TR')}</p>
                                        <button onClick={() => deleteNote(n.id)} className="text-red-300 hover:text-red-500 transition-colors">
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                        </button>
                                    </div>
                                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{n.note}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            <Card className="p-10 flex flex-col h-full border-none shadow-xl rounded-[40px]">
                <h3 className="font-extrabold text-xl mb-6 flex items-center gap-3"><span className="material-symbols-outlined text-primary">prescriptions</span> E-Reçete Asistanı</h3>
                <div className="relative mb-6">
                    <input type="text" placeholder="İlaç veya etken madde ara..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full p-5 pl-14 bg-slate-50 border-none rounded-2xl text-sm outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium" />
                    <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                    {search && (
                        <div className="absolute top-full left-0 w-full bg-white border border-slate-100 shadow-2xl rounded-2xl mt-2 z-20 max-h-60 overflow-y-auto p-2">
                            {DRUGS_DB.filter(d => d.name.toLowerCase().includes(search.toLowerCase())).map(drug => (
                                <div key={drug.name} onClick={() => initiateDrugAdd(drug)} className="p-4 hover:bg-slate-50 rounded-xl cursor-pointer flex justify-between items-center transition-colors">
                                    <span className="font-bold text-slate-700">{drug.name}</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{drug.type}</span>
                                </div>
                            ))}
                            {search && !DRUGS_DB.some(d => d.name.toLowerCase() === search.toLowerCase()) && (
                                <div onClick={() => initiateDrugAdd({ name: search, type: 'Özel' })} className="p-4 hover:bg-primary/5 rounded-xl cursor-pointer flex items-center gap-2 text-primary font-bold transition-colors border-t border-slate-100 mt-2">
                                    <span className="material-symbols-outlined">add_circle</span> "{search}" Ekle
                                </div>
                            )}
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
                    <Button variant="secondary" onClick={savePrescription} className="flex-1 h-14 rounded-2xl font-bold">Kaydet</Button>
                    <Button className="flex-1 h-14 rounded-2xl font-bold" icon="print" onClick={printPrescription}>Reçeteyi Yazdır</Button>
                </div>
            </Card>
            <div className="flex flex-col gap-8">
                <Card className="p-8 border-none shadow-xl rounded-[40px]">
                     <div className="flex justify-between items-center mb-6">
                         <h3 className="font-extrabold text-xl flex items-center gap-3"><span className="material-symbols-outlined text-primary">mic</span> Klinik Notlar</h3>
                         <div className="flex gap-2">
                            <button onClick={() => setShowHistory(true)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs hover:bg-slate-200 transition-all">Geçmiş</button>
                            <button onClick={handleNewNote} className="px-4 py-2 rounded-xl bg-primary/10 text-primary font-bold text-xs hover:bg-primary/20 transition-all">Yeni Not</button>
                            <button onClick={printNote} className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-all shadow-lg" title="PDF Olarak İndir/Yazdır"><span className="material-symbols-outlined">picture_as_pdf</span></button>
                            <button onClick={toggleDictation} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg ${listening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}><span className="material-symbols-outlined">{listening ? 'mic_off' : 'mic'}</span></button>
                         </div>
                     </div>
                     <div className="flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
                        {NOTE_TEMPLATES.map(t => (
                            <button key={t.label} onClick={() => setNote(prev => prev ? prev + '\n' + t.text : t.text)} className="px-3 py-1.5 bg-amber-100/50 text-amber-800 text-[10px] font-bold rounded-lg hover:bg-amber-200/50 transition-colors whitespace-nowrap border border-amber-200/50">{t.label}</button>
                        ))}
                     </div>
                     <textarea className="w-full h-40 p-6 bg-amber-50/50 border-none rounded-[32px] text-sm text-slate-700 outline-none focus:ring-4 focus:ring-amber-200/50 resize-none font-medium leading-relaxed" placeholder="Sesli not için mikrofonu kullanın..." value={note} onChange={(e) => setNote(e.target.value)} onBlur={saveNote} />
                </Card>
                <Card className="p-8 flex-1 border-none shadow-xl rounded-[40px]">
                    <h3 className="font-extrabold text-xl mb-8">Tedavi Zaman Çizelgesi</h3>
                    <div className="relative pl-6 space-y-10 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                        {timeline.length === 0 && <p className="text-sm text-gray-400 pl-6">Henüz bir tedavi kaydı yok.</p>}
                        {timeline.map((item, i) => (
                            <div key={item.id} className={`relative pl-10 ${i > 0 ? 'opacity-70' : ''}`}>
                                <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-4 border-white shadow-lg ${i === 0 ? 'bg-primary ring-1 ring-primary/20' : 'bg-slate-300'}`}></div>
                                <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${i === 0 ? 'text-primary' : 'text-slate-400'}`}>{new Date(item.date).toLocaleDateString('tr-TR')}</p>
                                <h4 className="font-extrabold text-slate-900 tracking-tight">{item.treatment}</h4>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

const AppointmentHistory: React.FC<{ patientId: string }> = ({ patientId }) => {
    const [appointments, setAppointments] = useState<any[]>([]);
    
    useEffect(() => {
        const load = async () => {
            const { data } = await supabase.from('appointments').select('*').eq('patient_id', patientId).order('date', { ascending: false });
            if (data) setAppointments(data);
        };
        load();
    }, [patientId]);

    const updateStatus = async (id: string, status: string) => {
        await supabase.from('appointments').update({ status }).eq('id', id);
        setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    };

    return (
        <Card className="p-8 border-none shadow-xl rounded-[40px]">
            <h3 className="font-extrabold text-xl mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">history</span> Randevu Geçmişi
            </h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="p-4 text-xs font-extrabold text-slate-400 uppercase">Tarih</th>
                            <th className="p-4 text-xs font-extrabold text-slate-400 uppercase">Saat</th>
                            <th className="p-4 text-xs font-extrabold text-slate-400 uppercase">İşlem</th>
                            <th className="p-4 text-xs font-extrabold text-slate-400 uppercase">Durum</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {appointments.length === 0 ? (
                            <tr><td colSpan={4} className="p-6 text-center text-slate-400 text-sm">Kayıt bulunamadı.</td></tr>
                        ) : (
                            appointments.map(apt => (
                                <tr key={apt.id} className="hover:bg-slate-50/50">
                                    <td className="p-4 font-bold text-slate-700">{new Date(apt.date).toLocaleDateString('tr-TR')}</td>
                                    <td className="p-4 text-sm font-medium text-slate-600">{apt.time}:00</td>
                                    <td className="p-4 text-sm font-bold text-slate-900">{apt.treatment}</td>
                                    <td className="p-4">
                                        <select value={apt.status || 'pending'} onChange={(e) => updateStatus(apt.id, e.target.value)} className="bg-slate-100 border-none rounded-lg text-xs font-bold uppercase p-2 outline-none cursor-pointer hover:bg-slate-200 transition-colors">
                                            <option value="pending">Bekliyor</option>
                                            <option value="completed">Tamamlandı</option>
                                            <option value="cancelled">İptal</option>
                                        </select>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export const ClinicalPage: React.FC = () => {
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [showResults, setShowResults] = useState(false);

    const handleSearch = async (term: string) => {
        setSearchTerm(term);
        if (term.length > 1) {
            const { data } = await supabase.from('patients').select('*').ilike('full_name', `%${term}%`);
            setSearchResults(data || []);
            setShowResults(true);
        } else {
            setSearchResults([]);
            setShowResults(false);
        }
    };

    const selectPatient = (patient: any) => {
        setSelectedPatient(patient);
        setSearchTerm(patient.full_name);
        setShowResults(false);
    };

    return (
        <div className="flex flex-col gap-10 animate-fade-in pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Klinik Yönetim</h1>
                    <div className="relative mt-4 w-72">
                        <input 
                            type="text" 
                            placeholder="Hasta Ara..." 
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full p-3 pl-10 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                        
                        {showResults && searchResults.length > 0 && (
                            <div className="absolute top-full left-0 w-full bg-white shadow-xl rounded-xl mt-2 max-h-60 overflow-y-auto z-20 border border-slate-100">
                                {searchResults.map(p => (
                                    <div 
                                        key={p.id} 
                                        onClick={() => selectPatient(p)}
                                        className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0"
                                    >
                                        <p className="font-bold text-slate-700 text-sm">{p.full_name}</p>
                                        <p className="text-xs text-slate-400">{p.phone}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {selectedPatient && (
                        <div className="flex items-center gap-3 mt-4 animate-fade-in">
                            <Badge status={selectedPatient.status || 'active'} />
                            <p className="text-slate-500 text-sm font-medium">Seçili Hasta: <span className="text-slate-900 font-bold">{selectedPatient.full_name}</span></p>
                        </div>
                    )}
                </div>
                {selectedPatient && (
                    <div className="flex gap-4">
                        <Button variant="secondary" className="h-14 px-8 rounded-2xl font-bold" icon="folder_shared">Tüm Kayıtlar</Button>
                        <Button className="h-14 px-8 rounded-2xl font-bold shadow-xl shadow-primary/20" icon="save">Değişiklikleri Uygula</Button>
                    </div>
                )}
            </div>
            
            {selectedPatient ? (
                <>
                    <Odontogram patientId={selectedPatient.id} />
                    <DicomViewer patientId={selectedPatient.id} />
                    <PrescriptionAssistant patientId={selectedPatient.id} />
                    <AppointmentHistory patientId={selectedPatient.id} />
                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-96 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200 text-slate-400">
                    <span className="material-symbols-outlined text-6xl mb-4">person_search</span>
                    <h3 className="text-xl font-bold">İşlem yapmak için lütfen bir hasta seçin.</h3>
                </div>
            )}
        </div>
    );
};