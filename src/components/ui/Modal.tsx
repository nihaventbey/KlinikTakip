import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: ModalSize;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  '2xl': 'sm:max-w-2xl',
  '3xl': 'sm:max-w-3xl',
  '4xl': 'sm:max-w-4xl',
};

export default function Modal({ isOpen, onClose, title, children, size = 'lg' }: ModalProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Delay showing the modal to allow for mounting and transition
      const timer = setTimeout(() => setShow(true), 10);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setShow(false);
    // Delay closing to allow for exit transition
    setTimeout(onClose, 300); 
  };

  if (!isOpen) return null;

  const modalSizeClass = sizeClasses[size] || sizeClasses.lg;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto" 
      role="dialog" 
      aria-modal="true"
    >
      {/* Background overlay */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${show ? 'bg-opacity-40' : 'bg-opacity-0'}`} 
        onClick={handleClose} 
        aria-hidden="true" 
      />
      
      {/* Modal Content */}
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div 
          className={`relative transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all duration-300 sm:my-8 sm:w-full ${modalSizeClass} ${show ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        >
          <div className="flex justify-between items-center bg-gray-50 px-4 py-3 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <button 
              onClick={handleClose}
              className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
              aria-label="Kapat"
            >
              <X size={20} />
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