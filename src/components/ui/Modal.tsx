import React from 'react';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: ModalSize;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'sm:max-w-sm', // 24rem, 384px
  md: 'sm:max-w-md', // 28rem, 448px
  lg: 'sm:max-w-lg', // 32rem, 512px
  xl: 'sm:max-w-xl', // 36rem, 576px
  '2xl': 'sm:max-w-2xl', // 42rem, 672px
};

export default function Modal({ isOpen, onClose, title, children, size = 'lg' }: ModalProps) {
  if (!isOpen) return null;

  const modalSizeClass = sizeClasses[size] || sizeClasses.lg;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      {/* Arkaplan karartma */}
      <div className="fixed inset-0 bg-gray-800 bg-opacity-60 transition-opacity" onClick={onClose} aria-hidden="true" />
      
      {/* Modal İçeriği */}
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div 
          className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full ${modalSizeClass}`}
        >
          <div className="flex justify-between items-center bg-gray-50 px-4 py-3 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Kapat"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="px-4 py-5 sm:p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}