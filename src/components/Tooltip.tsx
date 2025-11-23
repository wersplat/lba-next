'use client'

import { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  className?: string;
}

export default function Tooltip({ content, children, className = '' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const updatePosition = () => {
        if (!triggerRef.current || !tooltipRef.current) return;
        
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const padding = 12;
        const gap = 8;

        // Calculate preferred position (above trigger, centered)
        let top = triggerRect.top - tooltipRect.height - gap;
        let left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;

        // Check if there's enough space above
        if (top < padding) {
          // Not enough space above, position below instead
          top = triggerRect.bottom + gap;
        }

        // Adjust horizontal position to stay within viewport
        if (left < padding) {
          left = padding;
        } else if (left + tooltipRect.width > viewportWidth - padding) {
          left = Math.max(padding, viewportWidth - tooltipRect.width - padding);
        }

        // Ensure tooltip doesn't go below viewport
        if (top + tooltipRect.height > viewportHeight - padding) {
          top = viewportHeight - tooltipRect.height - padding;
        }

        setPosition({ top, left });
      };

      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        updatePosition();
      });

      // Update position on scroll/resize
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);

      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isVisible]);

  return (
    <div 
      ref={triggerRef}
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          className="fixed z-50 px-3 py-2 text-xs text-white bg-gray-900 dark:bg-gray-800 rounded-lg shadow-lg border border-gray-700 dark:border-gray-600 pointer-events-none max-w-[300px]"
          style={position ? { 
            top: `${position.top}px`, 
            left: `${position.left}px`,
            maxWidth: 'min(300px, calc(100vw - 24px))'
          } : { visibility: 'hidden', position: 'fixed' }}
          role="tooltip"
        >
          <div className="whitespace-normal break-words">{content}</div>
        </div>
      )}
    </div>
  );
}

