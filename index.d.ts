import { FC, ReactElement, HTMLAttributes } from 'react';

export interface TIFFViewerProps extends HTMLAttributes<HTMLDivElement> {
  /** URL of the TIFF file to display */
  tiff: string;
  
  /** Language for UI elements (default: 'en') */
  lang?: 'en' | 'de' | 'fr' | 'es' | 'tr' | 'ja' | 'zh' | 'ru' | 'ar' | 'hi';
  
  /** Pagination style (default: 'bottom') */
  paginate?: 'bottom' | 'ltr';
  
  /** Current page to display (1-indexed, default: 1) */
  currentPage?: number;
  
  /** Color for pagination buttons (default: '#141414') */
  buttonColor?: string;
  
  /** Callback when document loads with total number of pages */
  onDocumentLoad?: (totalPages: number) => void;
  
  /** Callback when TIFF file has been loaded */
  onLoad?: () => void;
  
  /** Show print button */
  printable?: boolean;
  
  /** Show zoom buttons */
  zoomable?: boolean;
}

export interface TIFFViewerRef {
  /** Get context for printing all pages */
  context: () => HTMLElement;
}

export const TIFFViewer: FC<TIFFViewerProps>;

export default TIFFViewer;