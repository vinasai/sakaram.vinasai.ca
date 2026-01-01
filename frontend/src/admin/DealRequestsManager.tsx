import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { fetchDealRequests, updateDealRequestStatus } from '../api/client';
import TableSkeleton from '../components/TableSkeleton';

type DealRequest = {
    _id: string;
    dealId: {
        _id: string;
        title: string;
    };
    user: {
        name: string;
        email: string;
        phone: string;
    };
    status: string;
    createdAt: string;
};

const MailIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const ChevronDownIcon = () => (
    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
    pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200', label: 'Pending' },
    contacted: { color: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200', label: 'Contacted' },
    completed: { color: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200', label: 'Completed' },
    cancelled: { color: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200', label: 'Cancelled' },
};

function useOnClickOutside(
    refs: Array<React.RefObject<HTMLElement>>,
    handler: () => void,
    enabled: boolean
) {
    useEffect(() => {
        if (!enabled) return;

        const onMouseDown = (e: MouseEvent) => {
            const target = e.target as Node;
            const clickedInside = refs.some((r) => r.current && r.current.contains(target));
            if (!clickedInside) handler();
        };

        document.addEventListener('mousedown', onMouseDown);
        return () => document.removeEventListener('mousedown', onMouseDown);
    }, [refs, handler, enabled]);
}

const StatusDropdown = ({
    currentStatus,
    onStatusChange,
}: {
    currentStatus: string;
    onStatusChange: (status: string) => void;
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const buttonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const [pos, setPos] = useState<{ top: number; left: number; width: number }>({
        top: 0,
        left: 0,
        width: 160,
    });

    const close = () => setIsOpen(false);

    useOnClickOutside([buttonRef as any, menuRef], close, isOpen);

    // Reposition menu when opened / resized / scrolled
    useEffect(() => {
        if (!isOpen) return;

        const updatePosition = () => {
            const btn = buttonRef.current;
            if (!btn) return;
            const rect = btn.getBoundingClientRect();

            const menuWidth = 180;
            const margin = 8;

            let left = rect.right - menuWidth;
            if (left < margin) left = margin;

            let top = rect.bottom + 8;
            // If not enough space below, open upward
            const approxMenuHeight = 44 * Object.keys(STATUS_CONFIG).length + 8; // rough
            if (top + approxMenuHeight > window.innerHeight - margin) {
                top = rect.top - approxMenuHeight - 8;
                if (top < margin) top = margin;
            }

            setPos({ top, left, width: menuWidth });
        };

        updatePosition();

        window.addEventListener('resize', updatePosition);
        // capture scroll events (including table/containers)
        window.addEventListener('scroll', updatePosition, true);

        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
        };
    }, [isOpen]);

    const config =
        STATUS_CONFIG[currentStatus] || { color: 'bg-gray-100 text-gray-800 border-gray-200', label: currentStatus };

    const menu = isOpen ? (
        <div
            ref={menuRef}
            style={{ position: 'fixed', top: pos.top, left: pos.left, width: pos.width, zIndex: 9999 }}
            className="bg-white rounded-lg shadow-lg border border-gray-200 py-1"
            role="menu"
            aria-label="Change status"
        >
            {Object.entries(STATUS_CONFIG).map(([status, conf]) => (
                <button
                    key={status}
                    type="button"
                    onClick={() => {
                        onStatusChange(status);
                        setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center justify-between ${currentStatus === status ? 'font-medium text-gray-900 bg-gray-50' : 'text-gray-700'
                        }`}
                    role="menuitem"
                >
                    <span className="flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-gray-400" />
                        {conf.label}
                    </span>
                    {currentStatus === status ? <span className="text-xs text-gray-500">Current</span> : null}
                </button>
            ))}
        </div>
    ) : null;

    return (
        <>
            <button
                ref={buttonRef}
                type="button"
                onClick={() => setIsOpen((v) => !v)}
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${config.color}`}
                aria-haspopup="menu"
                aria-expanded={isOpen}
            >
                {config.label}
                <ChevronDownIcon />
            </button>

            {/* Portal prevents table container from expanding/scrolling */}
            {typeof document !== 'undefined' ? createPortal(menu, document.body) : null}
        </>
    );
};

export default function DealRequestsManager() {
    const [requests, setRequests] = useState<DealRequest[]>([]);
    const [loading, setLoading] = useState(true);

    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

    const loadRequests = async () => {
        try {
            const res = await fetchDealRequests({ sortOrder });
            setRequests(res);
        } catch (error) {
            console.error('Failed to load deal requests', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            setRequests((prev) => prev.map((req) => (req._id === id ? { ...req, status: newStatus } : req)));
            await updateDealRequestStatus(id, newStatus);
        } catch (error) {
            console.error('Failed to update status', error);
            alert('Failed to update status');
            loadRequests();
        }
    };

    useEffect(() => {
        loadRequests();
    }, [sortOrder]);

    const formatDate = (dateString: string) => {
        const d = new Date(dateString);
        return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div>
            <div className="mb-5">

                <div className="flex items-center justify-between">
                    <p className="text-gray-500 mt-1 text-sm">Manage the Deals - {requests.length}</p>
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                        className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="desc">Latest First</option>
                        <option value="asc">Oldest First</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <TableSkeleton rowCount={8} />
            ) : requests.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-16 text-center shadow-sm">
                    <div className="flex justify-center mb-6 text-gray-400">
                        <MailIcon />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No deal requests yet</h3>
                    <p className="text-gray-500">When users request deals, they will appear here.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Date received
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Customer Details
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Contact Info
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Requested Deal
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {requests.map((req) => (
                                    <tr key={req._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(req.createdAt)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{req.user.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{req.user.email}</div>
                                            <div className="text-sm text-gray-500">{req.user.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-100 text-gray-800">
                                                {req.dealId?.title || 'Unknown Deal'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusDropdown
                                                currentStatus={req.status}
                                                onStatusChange={(newStatus) => handleStatusChange(req._id, newStatus)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
