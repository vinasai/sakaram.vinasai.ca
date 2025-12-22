import React from 'react';

interface TableSkeletonProps {
    rowCount?: number;
    className?: string;
}

export default function TableSkeleton({ rowCount = 5, className = "" }: TableSkeletonProps) {
    const rows = Array.from({ length: rowCount });

    return (
        <div className={`bg-white rounded-lg shadowoverflow-hidden border border-gray-200 ${className}`}>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {[1, 2, 3, 4, 5].map((i) => (
                                <th key={i} className="px-6 py-3 text-left">
                                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {rows.map((_, index) => (
                            <tr key={index} className="relative">
                                {/* Shimmer Overlay for the row */}
                                <td colSpan={5} className="p-0 relative">
                                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-100/50 to-transparent z-10 pointer-events-none" />

                                    <div className="flex items-center">
                                        {[1, 2, 3, 4, 5].map((cellIndex) => (
                                            <div key={cellIndex} className="px-6 py-4 whitespace-nowrap flex-1">
                                                <div className="space-y-2">
                                                    <div className="h-4 bg-gray-100 rounded w-full animate-pulse" />
                                                    {cellIndex === 2 && <div className="h-3 bg-gray-50 rounded w-2/3 animate-pulse" />}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
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
