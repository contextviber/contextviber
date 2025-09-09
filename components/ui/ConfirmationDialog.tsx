'use client';

import React, { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  confirmWithInput?: string;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
  confirmWithInput,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  
  const handleConfirm = useCallback(async () => {
    if (confirmWithInput && inputValue !== confirmWithInput) {
      return;
    }
    
    setIsLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Confirmation action failed:', error);
    } finally {
      setIsLoading(false);
      setInputValue('');
    }
  }, [onConfirm, onClose, confirmWithInput, inputValue]);
  
  const handleClose = useCallback(() => {
    if (!isLoading) {
      setInputValue('');
      onClose();
    }
  }, [isLoading, onClose]);
  
  if (!isOpen) return null;
  
  const colors = {
    danger: {
      icon: 'text-red-600',
      iconBg: 'bg-red-100',
      button: 'bg-red-600 hover:bg-red-700',
    },
    warning: {
      icon: 'text-yellow-600',
      iconBg: 'bg-yellow-100',
      button: 'bg-yellow-600 hover:bg-yellow-700',
    },
    info: {
      icon: 'text-blue-600',
      iconBg: 'bg-blue-100',
      button: 'bg-blue-600 hover:bg-blue-700',
    },
  };
  
  const dialogContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Dialog */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className={`mx-auto w-12 h-12 rounded-full ${colors[type].iconBg} flex items-center justify-center mb-4`}>
          {type === 'danger' && (
            <svg className={`w-6 h-6 ${colors[type].icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
          {type === 'warning' && (
            <svg className={`w-6 h-6 ${colors[type].icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {type === 'info' && (
            <svg className={`w-6 h-6 ${colors[type].icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
        
        {/* Content */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {title}
          </h3>
          <p className="text-gray-600">
            {message}
          </p>
        </div>
        
        {/* Input for confirmation */}
        {confirmWithInput && (
          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-2">
              Type <span className="font-mono font-semibold">{confirmWithInput}</span> to confirm:
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder={confirmWithInput}
              autoFocus
            />
          </div>
        )}
        
        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading || (confirmWithInput && inputValue !== confirmWithInput)}
            className={`flex-1 px-4 py-2 text-white font-medium rounded-lg transition-colors disabled:opacity-50 ${colors[type].button}`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
  
  // Use portal to render outside of parent component
  if (typeof document !== 'undefined') {
    return createPortal(dialogContent, document.body);
  }
  
  return null;
};

/**
 * Hook to manage confirmation dialog state
 */
export const useConfirmationDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<Omit<ConfirmationDialogProps, 'isOpen' | 'onClose'>>({
    title: '',
    message: '',
    onConfirm: () => {},
  });
  
  const showConfirmation = useCallback((
    newConfig: Omit<ConfirmationDialogProps, 'isOpen' | 'onClose'>
  ) => {
    setConfig(newConfig);
    setIsOpen(true);
  }, []);
  
  const hideConfirmation = useCallback(() => {
    setIsOpen(false);
  }, []);
  
  const ConfirmationDialogComponent = useCallback(() => (
    <ConfirmationDialog
      {...config}
      isOpen={isOpen}
      onClose={hideConfirmation}
    />
  ), [config, isOpen, hideConfirmation]);
  
  return {
    showConfirmation,
    hideConfirmation,
    ConfirmationDialogComponent,
  };
};