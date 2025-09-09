/**
 * Utility helper functions for ContextViber
 */

/**
 * Format bytes to human readable string
 */
export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date: Date | string): string => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
};

/**
 * Format date to locale string
 */
export const formatDate = (date: Date | string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Debounce function to limit execution frequency
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
        return true;
      } finally {
        textArea.remove();
      }
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

/**
 * Download text as file
 */
export const downloadFile = (content: string, filename: string, type = 'text/plain'): void => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Generate unique ID
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Check if file is text-based
 */
export const isTextFile = (filename: string): boolean => {
  const textExtensions = [
    '.txt', '.md', '.json', '.js', '.jsx', '.ts', '.tsx',
    '.html', '.css', '.scss', '.sass', '.less',
    '.xml', '.yaml', '.yml', '.toml', '.ini', '.conf',
    '.sh', '.bash', '.zsh', '.fish',
    '.py', '.rb', '.go', '.rs', '.java', '.kt', '.swift',
    '.c', '.cpp', '.h', '.hpp', '.cs', '.php', '.lua',
    '.sql', '.graphql', '.vue', '.svelte',
    '.env', '.gitignore', '.dockerignore', '.editorconfig',
  ];
  
  const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  return textExtensions.includes(ext);
};

/**
 * Parse file extension
 */
export const getFileExtension = (filename: string): string => {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1) return '';
  return filename.substring(lastDot + 1).toLowerCase();
};

/**
 * Group files by extension
 */
export const groupFilesByExtension = (files: File[]): Record<string, File[]> => {
  return files.reduce((acc, file) => {
    const ext = getFileExtension(file.name) || 'no-extension';
    if (!acc[ext]) acc[ext] = [];
    acc[ext].push(file);
    return acc;
  }, {} as Record<string, File[]>);
};

/**
 * Calculate total size of files
 */
export const calculateTotalSize = (files: File[]): number => {
  return files.reduce((total, file) => total + file.size, 0);
};

/**
 * Sort files by various criteria
 */
export type SortCriteria = 'name' | 'size' | 'date' | 'type';
export type SortOrder = 'asc' | 'desc';

export const sortFiles = (
  files: File[],
  criteria: SortCriteria = 'name',
  order: SortOrder = 'asc'
): File[] => {
  const sorted = [...files].sort((a, b) => {
    let comparison = 0;
    
    switch (criteria) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'size':
        comparison = a.size - b.size;
        break;
      case 'date':
        comparison = a.lastModified - b.lastModified;
        break;
      case 'type':
        comparison = getFileExtension(a.name).localeCompare(getFileExtension(b.name));
        break;
    }
    
    return order === 'asc' ? comparison : -comparison;
  });
  
  return sorted;
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Slugify text for URLs
 */
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Deep clone object
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as any;
  if (obj instanceof Object) {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
};

/**
 * Merge class names conditionally
 */
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Check if running in browser
 */
export const isBrowser = (): boolean => {
  return typeof window !== 'undefined';
};

/**
 * Check if running in development
 */
export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === 'development';
};

/**
 * Safe JSON parse with fallback
 */
export const safeJsonParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
};

/**
 * Get query parameter from URL
 */
export const getQueryParam = (param: string): string | null => {
  if (!isBrowser()) return null;
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
};

/**
 * Smooth scroll to element
 */
export const scrollToElement = (elementId: string, offset = 0): void => {
  if (!isBrowser()) return;
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top, behavior: 'smooth' });
};