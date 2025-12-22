import React from 'react';

interface LoadingStateProps {
    count?: number;
    className?: string;
}

export default function LoadingState({ count = 3, className = "" }: LoadingStateProps) {
    // Create an array of generic items to map over
    const items = Array.from({ length: count });

    return (
        <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto ${className}`}>
            {items.map((_, index) => (
                <div
                    key={index}
                    className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 p-4 relative"
                >
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent z-10" />

                    {/* Image Placeholder */}
                    <div className="w-full h-64 bg-gray-200 rounded-2xl mb-4 animate-pulse" />

                    {/* Content Placeholders */}
                    <div className="space-y-3">
                        <div className="h-6 bg-gray-200 rounded-full w-3/4 animate-pulse" />
                        <div className="h-4 bg-gray-200 rounded-full w-full animate-pulse" />
                        <div className="h-4 bg-gray-200 rounded-full w-5/6 animate-pulse" />

                        <div className="flex justify-between items-center pt-4">
                            <div className="h-8 bg-gray-200 rounded-full w-24 animate-pulse" />
                            <div className="h-10 bg-gray-200 rounded-xl w-32 animate-pulse" />
                        </div>
                    </div>
                </div>
            ))}
            <style>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
        </div>
    );
}
