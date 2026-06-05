import React from 'react';
import { cn } from '../lib/utils';

interface LogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
}

export function Logo({ className, iconClassName, textClassName }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div 
        className={cn("bg-[#f97316] shadow-sm flex-shrink-0 flex items-center justify-center", iconClassName)}
        style={{
          borderRadius: '50% 50% 50% 0',
          transform: 'rotate(-45deg)'
        }}
      >
        <div className="w-1/3 h-1/3 bg-white rounded-full" />
      </div>
      <span className={cn("font-extrabold tracking-tight text-slate-800 dark:text-slate-100", textClassName)}>PatiDestek</span>
    </div>
  );
}
