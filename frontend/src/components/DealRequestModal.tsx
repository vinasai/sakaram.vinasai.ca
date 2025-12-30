import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { createDealRequest } from '../api/client';

type DealRequestModalProps = {
    deal: {
        id: string;
        title: string;
        description?: string;
    };
    onClose: () => void;
};

export default function DealRequestModal({ deal, onClose }: DealRequestModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        countryCode: '+94',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const phoneFormats: Record<string, { groups: number[]; max: number; placeholder: string }> = {
        '+94': { groups: [2, 3, 4], max: 9, placeholder: '71 993 8765' },
        '+1': { groups: [3, 3, 4], max: 10, placeholder: '415 555 2671' },
        '+61': { groups: [3, 3, 3], max: 9, placeholder: '412 345 678' },
        '+44': { groups: [3, 3, 4], max: 10, placeholder: '712 345 6789' },
    };

    const formatPhone = (digits: string, code: string) => {
        const cfg = phoneFormats[code];
        if (!cfg) return digits;
        const parts: string[] = [];
        let cursor = 0;
        for (const len of cfg.groups) {
            if (cursor >= digits.length) break;
            parts.push(digits.slice(cursor, cursor + len));
            cursor += len;
        }
        return parts.filter(Boolean).join(' ');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('idle');
        setErrorMessage('');

        const trimmedName = formData.name.trim();
        const trimmedEmail = formData.email.trim();
        const phoneDigits = formData.phone.trim();
        const hasLeadingSpace = /^\s/.test(formData.name);
        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
        const phoneDigitsOnly = /^[0-9]+$/.test(phoneDigits);
        const phoneCfg = phoneFormats[formData.countryCode];
        const phoneLengthOk = phoneCfg ? phoneDigits.length === phoneCfg.max : phoneDigits.length > 0;

        if (!trimmedName || trimmedName.length > 100 || hasLeadingSpace) {
            setStatus('error');
            setErrorMessage('Full name must be 1-100 characters with no leading spaces.');
            return;
        }

        if (!emailValid) {
            setStatus('error');
            setErrorMessage('Please enter a valid email address.');
            return;
        }

        if (!phoneDigits || !phoneDigitsOnly || !phoneLengthOk) {
            const expected = phoneCfg ? `${phoneCfg.max} digits` : 'digits only';
            setStatus('error');
            setErrorMessage(`Phone number must contain ${expected} for the selected country.`);
            return;
        }

        setIsLoading(true);

        try {
            await createDealRequest({
                dealId: deal.id,
                user: {
                    name: trimmedName,
                    email: trimmedEmail,
                    phone: `${formData.countryCode} ${phoneDigits}`.trim(),
                },
            });
            setStatus('success');
        } catch (error: any) {
            console.error('Failed to submit deal request:', error);
            setStatus('error');
            setErrorMessage(error.response?.data?.message || 'Failed to submit request. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const isSuccess = status === 'success';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
                {isSuccess ? (
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check size={32} strokeWidth={3} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Request Sent!</h3>
                        <p className="text-gray-600 mb-8">
                            We've received your request for <strong>{deal.title}</strong>. Our team will contact you shortly to confirm your booking.
                        </p>
                        <button
                            onClick={onClose}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg hover:shadow-green-500/30"
                        >
                            Great, thanks!
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-orange-50">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Grab This Deal</h3>
                                <p className="text-sm text-gray-500 mt-1">{deal.title}</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {status === 'error' && (
                                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                                    {errorMessage}
                                </div>
                            )}

                            <div>
                                <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-1">
                                    <span>Full Name</span>
                                    <span className="text-xs text-gray-400">{formData.name.length}/100</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    maxLength={100}
                                    onChange={(e) => {
                                        const sanitized = e.target.value.replace(/^\s+/, '');
                                        setFormData({ ...formData, name: sanitized });
                                    }}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                    placeholder="Your Name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <div className="flex gap-3">
                                    <select
                                        value={formData.countryCode}
                                        onChange={(e) => {
                                            const code = e.target.value;
                                            const cfg = phoneFormats[code];
                                            const trimmed = cfg ? formData.phone.slice(0, cfg.max) : formData.phone;
                                            setFormData({ ...formData, countryCode: code, phone: trimmed });
                                        }}
                                        className="bg-gray-50 border border-gray-200 px-3 py-2.5 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none w-28 text-sm"
                                    >
                                        <option value="+94">🇱🇰 +94</option>
                                        <option value="+1">🇺🇸 +1</option>
                                        <option value="+44">🇬🇧 +44</option>
                                        <option value="+61">🇦🇺 +61</option>
                                    </select>
                                    <input
                                        type="tel"
                                        required
                                        inputMode="numeric"
                                        pattern="[0-9 ]*"
                                        value={formatPhone(formData.phone, formData.countryCode)}
                                        onChange={(e) => {
                                            const cfg = phoneFormats[formData.countryCode];
                                            const digitsOnly = e.target.value.replace(/\D/g, '');
                                            const limited = cfg ? digitsOnly.slice(0, cfg.max) : digitsOnly;
                                            setFormData({ ...formData, phone: limited });
                                        }}
                                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                        placeholder={phoneFormats[formData.countryCode]?.placeholder || 'Phone number'}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                    placeholder="name@example.com"
                                />
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-orange-500/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        'Grab Order'
                                    )}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
