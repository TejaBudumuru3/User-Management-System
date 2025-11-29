import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  header?: string;
  footer?: ReactNode;
}

export const Card = ({ 
  children, 
  className = '', 
  header, 
  footer 
}: CardProps) => {
  
  const baseClasses = 'bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100';

  return (
    <div className={`${baseClasses} ${className}`}>
      {header && (
        <div className="px-8 pt-8 pb-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">
            {header}
          </h2>
        </div>
      )}
      <div className="p-8">
        {children}
      </div>
      {footer && (
        <div className="px-8 pb-8 pt-6 bg-gray-50 border-t border-gray-100">
          {footer}
        </div>
      )}
    </div>
  );
};
