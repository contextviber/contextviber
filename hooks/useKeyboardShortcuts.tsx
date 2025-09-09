'use client';

import { useEffect, useCallback, useRef } from 'react';

// Shortcut definition
interface Shortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
  handler: (event: KeyboardEvent) => void;
  description?: string;
  preventDefault?: boolean;
}

/**
 * Custom hook for keyboard shortcuts
 */
export const useKeyboardShortcuts = (shortcuts: Shortcut[]) => {
  const shortcutsRef = useRef(shortcuts);
  
  // Update shortcuts ref when shortcuts change
  useEffect(() => {
    shortcutsRef.current = shortcuts;
  }, [shortcuts]);
  
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in input fields
    const target = event.target as HTMLElement;
    const isInputField = 
      target.tagName === 'INPUT' || 
      target.tagName === 'TEXTAREA' || 
      target.contentEditable === 'true';
    
    if (isInputField && !event.ctrlKey && !event.metaKey) {
      return;
    }
    
    // Check each shortcut
    for (const shortcut of shortcutsRef.current) {
      const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
      const ctrlMatch = !shortcut.ctrl || event.ctrlKey;
      const altMatch = !shortcut.alt || event.altKey;
      const shiftMatch = !shortcut.shift || event.shiftKey;
      const metaMatch = !shortcut.meta || event.metaKey;
      
      if (keyMatch && ctrlMatch && altMatch && shiftMatch && metaMatch) {
        if (shortcut.preventDefault !== false) {
          event.preventDefault();
        }
        shortcut.handler(event);
        break;
      }
    }
  }, []);
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
};

/**
 * Common keyboard shortcuts for the application
 */
export const useCommonShortcuts = () => {
  const shortcuts: Shortcut[] = [
    {
      key: 's',
      ctrl: true,
      handler: (e) => {
        e.preventDefault();
        // Save current project
        const saveButton = document.querySelector('[data-shortcut="save"]') as HTMLElement;
        if (saveButton) saveButton.click();
      },
      description: 'Save project',
    },
    {
      key: 'o',
      ctrl: true,
      handler: (e) => {
        e.preventDefault();
        // Open file upload
        const uploadButton = document.querySelector('[data-shortcut="upload"]') as HTMLElement;
        if (uploadButton) uploadButton.click();
      },
      description: 'Open files',
    },
    {
      key: 'e',
      ctrl: true,
      handler: (e) => {
        e.preventDefault();
        // Export
        const exportButton = document.querySelector('[data-shortcut="export"]') as HTMLElement;
        if (exportButton) exportButton.click();
      },
      description: 'Export',
    },
    {
      key: 'k',
      ctrl: true,
      handler: (e) => {
        e.preventDefault();
        // Open command palette (future feature)
        console.log('Command palette (coming soon)');
      },
      description: 'Open command palette',
    },
    {
      key: '/',
      ctrl: true,
      handler: (e) => {
        e.preventDefault();
        // Focus search
        const searchInput = document.querySelector('[data-shortcut="search"]') as HTMLInputElement;
        if (searchInput) searchInput.focus();
      },
      description: 'Focus search',
    },
    {
      key: 'Escape',
      handler: () => {
        // Close modals
        const closeButton = document.querySelector('[data-shortcut="close-modal"]') as HTMLElement;
        if (closeButton) closeButton.click();
      },
      description: 'Close modal',
    },
    {
      key: '?',
      shift: true,
      handler: () => {
        // Show keyboard shortcuts help
        const helpButton = document.querySelector('[data-shortcut="help"]') as HTMLElement;
        if (helpButton) helpButton.click();
      },
      description: 'Show keyboard shortcuts',
    },
  ];
  
  useKeyboardShortcuts(shortcuts);
  
  return shortcuts;
};

/**
 * Component to display available shortcuts
 */
export const KeyboardShortcutsHelp: React.FC<{ shortcuts?: Shortcut[] }> = ({ shortcuts }) => {
  const defaultShortcuts = useCommonShortcuts();
  const displayShortcuts = shortcuts || defaultShortcuts;
  
  const formatKey = (shortcut: Shortcut): string => {
    const keys = [];
    if (shortcut.ctrl) keys.push('Ctrl');
    if (shortcut.alt) keys.push('Alt');
    if (shortcut.shift) keys.push('Shift');
    if (shortcut.meta) keys.push('Cmd/Win');
    keys.push(shortcut.key.toUpperCase());
    return keys.join(' + ');
  };
  
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold mb-4">Keyboard Shortcuts</h3>
      <div className="space-y-2">
        {displayShortcuts.map((shortcut, index) => (
          <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-700">{shortcut.description}</span>
            <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-sm font-mono">
              {formatKey(shortcut)}
            </kbd>
          </div>
        ))}
      </div>
    </div>
  );
};