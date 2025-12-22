import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
    title: string;
    message: string;
    icon?: LucideIcon;
    actionLabel?: string;
    onAction?: () => void;
}

export default function EmptyState({
    title,
    message,
    icon: Icon,
    actionLabel,
    onAction
}: EmptyStateProps) {
    return (
        <div className="w-full flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-in-up">
            <div className="relative mb-6 group">
                <div className="absolute inset-0 bg-emerald-100 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                <div className="relative bg-white/50 backdrop-blur-sm border border-emerald-100 p-6 rounded-full shadow-lg transform group-hover:scale-110 transition-transform duration-500">
                    {Icon ? (
                        <Icon size={48} className="text-emerald-500/80" strokeWidth={1.5} />
                    ) : (
                        <svg
                            className="w-12 h-12 text-emerald-500/80"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4M4 12L10 6M4 12L10 18" />
                        </svg>
                    )}
                </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
                {message}
            </p>

            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-emerald-200 hover:text-emerald-700 transition-all duration-300 shadow-sm hover:shadow"
                >
                    {actionLabel}
                </button>
            )}

            <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
        </div>
    );
}
