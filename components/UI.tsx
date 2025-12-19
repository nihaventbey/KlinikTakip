
import React, { useState, useRef, useEffect } from 'react';

// Card
export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-[32px] border border-slate-100 shadow-[0_15px_60px_-15px_rgba(0,0,0,0.03)] ${className}`}>
    {children}
  </div>
);

// Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  icon?: string;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', icon, className = '', ...props }) => {
  const baseStyle = "flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl text-[14px] font-bold tracking-tight transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/20",
    secondary: "bg-slate-50 border border-slate-100 text-slate-700 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
    ghost: "text-slate-400 hover:text-primary hover:bg-primary/5",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {icon && <span className="material-symbols-outlined text-[20px]">{icon}</span>}
      {children}
    </button>
  );
};

// Badge
export const Badge: React.FC<{ status: string }> = ({ status }) => {
  const styles: Record<string, string> = {
    confirmed: "bg-emerald-50 text-emerald-700 border-emerald-100",
    paid: "bg-emerald-50 text-emerald-700 border-emerald-100",
    active: "bg-emerald-50 text-emerald-700 border-emerald-100",
    completed: "bg-blue-50 text-blue-700 border-blue-100",
    pending: "bg-amber-50 text-amber-700 border-amber-100",
    ongoing: "bg-sky-50 text-sky-600 border-sky-100",
    cancelled: "bg-slate-50 text-slate-500 border-slate-100",
    late: "bg-rose-50 text-rose-700 border-rose-100",
  };

  const labels: Record<string, string> = {
    confirmed: "Onaylandı",
    paid: "Ödendi",
    active: "Aktif",
    completed: "Tamamlandı",
    pending: "Bekliyor",
    ongoing: "Süreçte",
    cancelled: "İptal",
    late: "Gecikme"
  };

  return (
    <span className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border ${styles[status] || 'bg-slate-100 text-slate-800'}`}>
      {labels[status] || status}
    </span>
  );
};

// Before After Slider
export const BeforeAfterSlider: React.FC<{ before: string; after: string }> = ({ before, after }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, width } = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const position = ((clientX - left) / width) * 100;
    setSliderPosition(Math.min(Math.max(position, 0), 100));
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-[4/3] md:aspect-video overflow-hidden rounded-[40px] cursor-col-resize select-none shadow-2xl border border-slate-100 group"
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
    >
      <img src={after} alt="After" className="absolute inset-0 w-full h-full object-cover" />
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden" 
        style={{ width: `${sliderPosition}%` }}
      >
        <img src={before} alt="Before" className="absolute inset-0 w-full h-full object-cover" style={{ width: containerRef.current?.offsetWidth }} />
      </div>
      <div 
        className="absolute inset-y-0 w-1 bg-white cursor-col-resize shadow-[0_0_20px_rgba(0,0,0,0.2)] flex items-center justify-center transition-opacity group-hover:opacity-100"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center text-primary -ml-[23px] border border-slate-50">
          <span className="material-symbols-outlined text-2xl">unfold_more_double</span>
        </div>
      </div>
      <div className="absolute top-6 left-6 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl text-[10px] font-bold tracking-[0.2em] uppercase border border-white/10 pointer-events-none">Öncesi</div>
      <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl text-[10px] font-bold tracking-[0.2em] uppercase border border-white/10 pointer-events-none">Sonrası</div>
    </div>
  );
};
