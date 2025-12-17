import React, { useState, useRef, useEffect } from 'react';

// Card
export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
    {children}
  </div>
);

// Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  icon?: string;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', icon, className = '', ...props }) => {
  const baseStyle = "flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-primary hover:bg-primary-hover text-white shadow-sm shadow-primary/30",
    secondary: "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
    ghost: "text-gray-500 hover:text-primary hover:bg-primary/5",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {icon && <span className="material-symbols-outlined text-[18px]">{icon}</span>}
      {children}
    </button>
  );
};

// Badge
export const Badge: React.FC<{ status: string }> = ({ status }) => {
  const styles: Record<string, string> = {
    confirmed: "bg-green-100 text-green-700 border-green-200",
    paid: "bg-green-100 text-green-700 border-green-200",
    active: "bg-green-100 text-green-700 border-green-200",
    completed: "bg-blue-100 text-blue-700 border-blue-200",
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    ongoing: "bg-blue-50 text-blue-600 border-blue-200",
    cancelled: "bg-gray-100 text-gray-600 border-gray-200",
    late: "bg-red-100 text-red-700 border-red-200",
  };

  const labels: Record<string, string> = {
    confirmed: "Onaylandı",
    paid: "Ödendi",
    active: "Aktif",
    completed: "Tamamlandı",
    pending: "Bekliyor",
    ongoing: "Devam Ediyor",
    cancelled: "İptal",
    late: "Gecikmiş"
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
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
      className="relative w-full h-64 md:h-96 overflow-hidden rounded-2xl cursor-col-resize select-none group"
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
    >
      <img src={after} alt="After" className="absolute inset-0 w-full h-full object-cover" />
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden" 
        style={{ width: `${sliderPosition}%` }}
      >
        <img src={before} alt="Before" className="absolute inset-0 w-full max-w-none h-full object-cover" style={{ width: containerRef.current?.offsetWidth }} />
      </div>
      <div 
        className="absolute inset-y-0 w-1 bg-white cursor-col-resize shadow-xl flex items-center justify-center"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-primary -ml-[14px]">
          <span className="material-symbols-outlined text-sm">unfold_more_double</span>
        </div>
      </div>
      <div className="absolute bottom-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-xs font-bold pointer-events-none">ÖNCESİ</div>
      <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-xs font-bold pointer-events-none">SONRASI</div>
    </div>
  );
};
