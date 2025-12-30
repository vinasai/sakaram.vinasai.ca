import { Mail, Phone, Send, Clock } from 'lucide-react';
import { useState } from 'react';
import { createInquiry } from '../api/client';

export default function Contact() {
  const phoneFormats: Record<string, { groups: number[]; max: number; placeholder: string }> = {
    '+94': { groups: [2, 3, 4], max: 9, placeholder: '71 993 8765' },
    '+1': { groups: [3, 3, 4], max: 10, placeholder: '415 555 2671' },
    '+61': { groups: [3, 3, 3], max: 9, placeholder: '412 345 678' },
    '+44': { groups: [3, 3, 4], max: 10, placeholder: '712 345 6789' },
  };
  const DEFAULT_PHONE_MAX = 15;

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

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+94',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusModal, setStatusModal] = useState<{ open: boolean; type: 'success' | 'error'; title: string; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedMessage = formData.message.trim();
    const phoneDigits = formData.phone.trim();
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
    const phoneDigitsOnly = /^[0-9]+$/.test(phoneDigits);
    const phoneCfg = phoneFormats[formData.countryCode];
    const phoneLengthOk = phoneCfg
      ? phoneDigits.length === phoneCfg.max
      : phoneDigits.length >= 6 && phoneDigits.length <= DEFAULT_PHONE_MAX;

    const showError = (title: string, message: string) => {
      setStatusModal({ open: true, type: 'error', title, message });
      setIsSubmitting(false);
    };

    if (!trimmedName || trimmedName.length > 100) {
      showError('Invalid Name', 'Full name must be between 1 and 100 characters.');
      return;
    }

    if (!emailValid) {
      showError('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (!phoneDigits || !phoneDigitsOnly || !phoneLengthOk) {
      const expected = phoneCfg ? `${phoneCfg.max} digits` : '6-15 digits';
      showError('Invalid Phone', `Phone number must contain ${expected} and match the selected country format.`);
      return;
    }

    if (!trimmedMessage || trimmedMessage.length > 400) {
      showError('Invalid Message', 'Message must be between 1 and 400 characters.');
      return;
    }

    try {
      await createInquiry({
        fullName: trimmedName,
        email: trimmedEmail,
        phone: `${formData.countryCode} ${phoneDigits}`.trim(),
        message: trimmedMessage,
      });
      setFormData({ name: '', email: '', phone: '', countryCode: '+94', message: '' });
      setStatusModal({
        open: true,
        type: 'success',
        title: 'Message Sent',
        message: 'Thank you for reaching out! We will get back to you shortly.',
      });
    } catch (err) {
      console.error('Failed to send inquiry', err);
      setStatusModal({
        open: true,
        type: 'error',
        title: 'Submission Failed',
        message: 'Unable to send message. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = e.target.value.replace(/^\s+/, '').slice(0, 100);
    setFormData({ ...formData, name: sanitized });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, email: e.target.value });
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, message: e.target.value.slice(0, 400) });
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    const cfg = phoneFormats[code];
    const limited = cfg ? formData.phone.slice(0, cfg.max) : formData.phone.slice(0, DEFAULT_PHONE_MAX);
    setFormData({ ...formData, countryCode: code, phone: limited });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cfg = phoneFormats[formData.countryCode];
    const digitsOnly = e.target.value.replace(/\D/g, '');
    const limited = cfg ? digitsOnly.slice(0, cfg.max) : digitsOnly.slice(0, DEFAULT_PHONE_MAX);
    setFormData({ ...formData, phone: limited });
  };

  return (
    <section id="contact" className="relative py-44 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Sri Lanka nature background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/70 to-black/75"></div>
      </div>

      <div className="absolute top-20 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 animate-fade-in-down">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full px-4 py-2 mb-4 shadow-lg">

            <span className="text-sm font-semibold">Contact Us</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Let's Start Your <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">Adventure</span>
          </h2>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent rounded-full"></div>
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent rounded-full"></div>
          </div>
          <p className="text-gray-200 text-base max-w-xl mx-auto leading-relaxed">
            Ready to explore the Pearl of the Indian Ocean? Get in touch with us and let's plan your perfect journey together!
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="mb-8 animate-fade-in-up">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8 border border-white/50 transform hover:scale-[1.01] transition-all duration-500">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-1">Send us a Message</h3>
                <p className="text-gray-600 text-sm">Fill out the form and we'll get back to you shortly</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="transform transition-all duration-300 hover:translate-x-1">
                    <label htmlFor="name" className="flex items-center justify-between text-gray-700 font-semibold mb-1.5 text-sm">
                      <span>Full Name *</span>
                      <span className="text-xs text-gray-400">{formData.name.length}/100</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleNameChange}
                      maxLength={100}
                      className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all bg-white text-sm"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="transform transition-all duration-300 hover:translate-x-1">
                    <label htmlFor="email" className="block text-gray-700 font-semibold mb-1.5 text-sm">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleEmailChange}
                      className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all bg-white text-sm"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="transform transition-all duration-300 hover:translate-x-1">
                  <label htmlFor="phone" className="block text-gray-700 font-semibold mb-1.5 text-sm">
                    Phone Number *
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={formData.countryCode}
                      onChange={handleCountryChange}
                      className="w-32 px-2 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all bg-white text-sm"
                    >
                      <option value="+93">🇦🇫 +93</option>
                      <option value="+355">🇦🇱 +355</option>
                      <option value="+213">🇩🇿 +213</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+61">🇦🇺 +61</option>
                      <option value="+43">🇦🇹 +43</option>
                      <option value="+880">🇧🇩 +880</option>
                      <option value="+32">🇧🇪 +32</option>
                      <option value="+55">🇧🇷 +55</option>
                      <option value="+1">🇨🇦 +1</option>
                      <option value="+86">🇨🇳 +86</option>
                      <option value="+45">🇩🇰 +45</option>
                      <option value="+20">🇪🇬 +20</option>
                      <option value="+358">🇫🇮 +358</option>
                      <option value="+33">🇫🇷 +33</option>
                      <option value="+49">🇩🇪 +49</option>
                      <option value="+30">🇬🇷 +30</option>
                      <option value="+852">🇭🇰 +852</option>
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+62">🇮🇩 +62</option>
                      <option value="+98">🇮🇷 +98</option>
                      <option value="+964">🇮🇶 +964</option>
                      <option value="+353">🇮🇪 +353</option>
                      <option value="+972">🇮🇱 +972</option>
                      <option value="+39">🇮🇹 +39</option>
                      <option value="+81">🇯🇵 +81</option>
                      <option value="+82">🇰🇷 +82</option>
                      <option value="+60">🇲🇾 +60</option>
                      <option value="+52">🇲🇽 +52</option>
                      <option value="+31">🇳🇱 +31</option>
                      <option value="+64">🇳🇿 +64</option>
                      <option value="+47">🇳🇴 +47</option>
                      <option value="+92">🇵🇰 +92</option>
                      <option value="+63">🇵🇭 +63</option>
                      <option value="+48">🇵🇱 +48</option>
                      <option value="+351">🇵🇹 +351</option>
                      <option value="+974">🇶🇦 +974</option>
                      <option value="+7">🇷🇺 +7</option>
                      <option value="+966">🇸🇦 +966</option>
                      <option value="+65">🇸🇬 +65</option>
                      <option value="+27">🇿🇦 +27</option>
                      <option value="+34">🇪🇸 +34</option>
                      <option value="+94">🇱🇰 +94</option>
                      <option value="+46">🇸🇪 +46</option>
                      <option value="+41">🇨🇭 +41</option>
                      <option value="+886">🇹🇼 +886</option>
                      <option value="+66">🇹🇭 +66</option>
                      <option value="+90">🇹🇷 +90</option>
                      <option value="+971">🇦🇪 +971</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+84">🇻🇳 +84</option>
                    </select>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      inputMode="numeric"
                      pattern="[0-9 ]*"
                      value={formatPhone(formData.phone, formData.countryCode)}
                      onChange={handlePhoneChange}
                      className="flex-1 px-3.5 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all bg-white text-sm"
                      placeholder={phoneFormats[formData.countryCode]?.placeholder || 'Phone number'}
                    />
                  </div>
                </div>

                <div className="transform transition-all duration-300 hover:translate-x-1">
                  <label htmlFor="message" className="flex items-center justify-between text-gray-700 font-semibold mb-1.5 text-sm">
                    <span>Your Message *</span>
                    <span className="text-xs text-gray-400">{formData.message.length}/400</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleMessageChange}
                    rows={4}
                    maxLength={400}
                    className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all bg-white text-sm"
                    placeholder="Tell us about your dream trip..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl font-bold text-base hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg transform hover:scale-[1.02] disabled:opacity-70"
                >
                  <Send size={18} />
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/95 backdrop-blur-md rounded-xl p-5 shadow-lg border border-white/50 hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-3">
                <Phone size={20} className="text-emerald-600" />
              </div>
              <h4 className="text-base font-bold text-gray-800 mb-1">Call Us</h4>
              <p className="text-gray-600 text-sm">+94 76 046 5855</p>
            </div>

            <div className="bg-white/95 backdrop-blur-md rounded-xl p-5 shadow-lg border border-white/50 hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-3">
                <Mail size={20} className="text-emerald-600" />
              </div>
              <h4 className="text-base font-bold text-gray-800 mb-1">Email Us</h4>
              <p className="text-gray-600 text-sm">info@sarkamtours.com</p>
            </div>

            <div className="bg-white/95 backdrop-blur-md rounded-xl p-5 shadow-lg border border-white/50 hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-3">
                <Clock size={20} className="text-emerald-600" />
              </div>
              <h4 className="text-base font-bold text-gray-800 mb-1">Working Hours</h4>
              <p className="text-gray-600 text-sm">Mon - Sat: 9AM - 6PM</p>
            </div>
          </div>
        </div>
      </div>

      {statusModal?.open && (
        <StatusModal
          type={statusModal.type}
          title={statusModal.title}
          message={statusModal.message}
          onClose={() => setStatusModal(null)}
        />
      )}
    </section>
  );
}

function StatusModal({ type, title, message, onClose }: { type: 'success' | 'error'; title: string; message: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-in fade-in zoom-in">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
          {type === 'success' ? '✓' : '✕'}
        </div>
        <h3 className="text-xl font-bold text-center text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-center mb-6 text-sm leading-relaxed">{message}</p>
        <button
          onClick={onClose}
          className={`w-full py-3 rounded-xl font-semibold text-white transition-colors shadow-lg ${type === 'success' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' : 'bg-red-600 hover:bg-red-700 shadow-red-200'}`}
        >
          {type === 'success' ? 'Continue' : 'Try Again'}
        </button>
      </div>
    </div>
  );
}
