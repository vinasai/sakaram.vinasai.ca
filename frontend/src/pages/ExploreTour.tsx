import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { createTripRequest, fetchTourDetails, toMediaUrl } from '../api/client';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Star, Check, X, Calendar, Info, Users, ShieldCheck } from 'lucide-react';

export default function ExploreTour() {
  const { id: paramId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [tour, setTour] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Extract ID logic preserved
  const id = paramId || location.pathname.split('/trip/')[1]?.split('/')[0];

  const [showBooking, setShowBooking] = useState(false);
  const [statusModal, setStatusModal] = useState<{ open: boolean; type: 'success' | 'error'; title: string; message: string } | null>(null);
  const [form, setForm] = useState({ startDate: '', travellers: 1, accommodation: 'Standard', name: '', phone: '', countryCode: '+94', email: '' });

  useEffect(() => {
    let mounted = true;
    window.scrollTo(0, 0);

    const loadTour = async () => {
      if (!id) {
        if (mounted) setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const detail = await fetchTourDetails(id);

        if (!detail || !detail.tour) {
          if (mounted) setTour(null);
          return;
        }

        const photos = detail.images?.map((img: any) => toMediaUrl(img.imageUrl)).filter(Boolean) || [];
        const included = detail.inclusions?.map((item: any) => item.description) || [];
        const excluded = detail.exclusions?.map((item: any) => item.description) || [];

        let plan: any[] = [];
        if (detail.itinerary && detail.itinerary.length > 0) {
          const grouped = detail.itinerary.reduce((acc: any, item: any) => {
            const day = item.dayNumber || 1;
            if (!acc[day]) acc[day] = [];
            acc[day].push(item.activity);
            return acc;
          }, {});

          const maxDay = Math.max(...detail.itinerary.map((i: any) => i.dayNumber || 1));
          for (let i = 1; i <= maxDay; i++) {
            if (grouped[i]) plan.push(grouped[i]);
          }
        }

        if (mounted) {
          setTour({
            id: detail.tour._id,
            name: detail.tour.name,
            location: detail.tour.location,
            price: detail.tour.price,
            image: photos[0],
            photos,
            description: detail.tour.description,
            duration: detail.tour.duration,
            rating: detail.tour.rating,
            reviews: detail.tour.reviewsCount,
            included,
            excluded,
            plan,
          });
        }
      } catch (e) {
        console.error('Failed to load tour', e);
        if (mounted) setTour(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadTour();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            <p className="text-gray-400 text-sm tracking-wide">LOADING ADVENTURE...</p>
          </div>
        </div>
      </>
    );
  }

  if (!tour) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Tour Not Found</h2>
            <p className="text-gray-500 mb-6">We couldn't locate the adventure you are looking for.</p>
            <button onClick={() => navigate('/')} className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200">
              Return Home
            </button>
          </div>
        </div>
      </>
    );
  }

  const mainPhoto = (tour.photos && tour.photos.length > 0) ? tour.photos[0] : tour.image;
  const galleryPhotos = (tour.photos && tour.photos.length > 1) ? tour.photos.slice(1, 4) : [];

  return (
    <>
      <Header />

      {/* --- HERO SECTION: Immersive full width --- */}
      <div className="relative w-full h-[65vh] md:h-[75vh] bg-gray-900 mt-16 md:mt-10">
        <div className="absolute inset-0">
          {mainPhoto ? (
            <img src={mainPhoto} alt={tour.name} className="w-full h-full object-cover opacity-90" />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-600">No Image Available</div>
          )}
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
        </div>

        {/* Back Button (Floating) */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-24 left-4 md:left-16 z-20 p-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full hover:bg-white hover:text-gray-900 transition-all"
        >
          <ArrowLeft size={20} />
        </button>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 w-full p-4 md:p-8 pb-12 md:pb-16 z-10">
          <div className="container mx-auto max-w-7xl">
            <div className="max-w-4xl">
              <div className="flex items-center gap-2 text-emerald-300 font-semibold tracking-wider text-sm mb-3 uppercase">
                <MapPin size={16} />
                <span>{tour.location}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight shadow-sm">
                {tour.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 md:gap-6 text-white/90">
                {tour.rating && (
                  <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
                    <Star size={16} className="text-amber-400 fill-amber-400" />
                    <span className="font-bold">{tour.rating}</span>
                    <span className="text-white/60 text-sm">({tour.reviews || 0} reviews)</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Clock size={18} className="text-emerald-400" />
                  <span className="text-lg">{tour.duration || 'Flexible Duration'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="container mx-auto px-4 max-w-7xl -mt-8 relative z-20">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* --- LEFT COLUMN: Main Content --- */}
            <div className="lg:col-span-2 space-y-8">

              {/* Quick Info Bar */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-wrap gap-8 items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Type</p>
                    <p className="font-medium text-gray-900">Guided Tour</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                    <Users size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Group Size</p>
                    <p className="font-medium text-gray-900">Flexible</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Availability</p>
                    <p className="font-medium text-gray-900">Daily</p>
                  </div>
                </div>
              </div>

              {/* Overview Section */}
              <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Info className="text-emerald-600" size={24} />
                  About this trip
                </h3>
                <div
                  className="prose prose-lg text-gray-600 leading-relaxed max-w-none rich-text-content"
                  dangerouslySetInnerHTML={{
                    __html: tour.description || "Experience the beauty of this location with our comprehensive guided tour. Perfect for travelers seeking adventure and culture."
                  }}
                />

                <style>{`
                  .rich-text-content h3 {
                    font-size: 1.25rem;
                    font-weight: 700;
                    margin-top: 1rem;
                    margin-bottom: 0.75rem;
                    color: #1f2937;
                  }
                  .rich-text-content p {
                    margin-bottom: 1rem;
                    line-height: 1.75;
                  }
                  .rich-text-content ul, .rich-text-content ol {
                    margin-left: 1.5rem;
                    margin-bottom: 1rem;
                  }
                  .rich-text-content li {
                    margin-bottom: 0.5rem;
                  }
                  .rich-text-content strong {
                    font-weight: 700;
                    color: #374151;
                  }
                  .rich-text-content em {
                    font-style: italic;
                  }
                  .rich-text-content u {
                    text-decoration: underline;
                  }
                  .rich-text-content ul {
                    list-style-type: disc;
                  }
                  .rich-text-content ol {
                    list-style-type: decimal;
                  }
                `}</style>

                {/* Mini Gallery Grid if photos exist */}
                {galleryPhotos.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mt-8 h-48 md:h-64">
                    {galleryPhotos.map((photo: string, idx: number) => (
                      <div key={idx} className="rounded-xl overflow-hidden h-full">
                        <img src={photo} alt={`Gallery ${idx}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Itinerary Section */}
              {Array.isArray(tour.plan) && tour.plan.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <MapPin className="text-emerald-600" size={24} />
                      Tour Itinerary
                    </h3>
                    <span className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
                      {tour.plan.length} Days
                    </span>
                  </div>

                  <div className="space-y-6">
                    {tour.plan.map((dayPlan: any, idx: number) => (
                      <div key={idx} className="flex gap-4 md:gap-6 group">
                        {/* Day Marker */}
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex flex-col items-center justify-center shadow-lg shadow-emerald-200 z-10">
                            <span className="text-xs font-medium opacity-80">DAY</span>
                            <span className="text-xl font-bold leading-none">{idx + 1}</span>
                          </div>
                          {idx !== tour.plan.length - 1 && (
                            <div className="w-0.5 flex-1 bg-gray-200 my-2 group-hover:bg-emerald-200 transition-colors"></div>
                          )}
                        </div>

                        {/* Content Card */}
                        <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                          {Array.isArray(dayPlan) ? (
                            <ul className="space-y-3">
                              {dayPlan.map((act: string, aIdx: number) => (
                                <li key={aIdx} className="flex items-start gap-3 text-gray-600">
                                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                                  <span className="leading-relaxed">{act}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-600 leading-relaxed">{dayPlan}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Inclusions & Exclusions Grid */}
              <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-8">What's Included</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-emerald-800 mb-4 flex items-center gap-2">
                      <Check size={20} className="text-emerald-600" /> Included
                    </h4>
                    <ul className="space-y-3">
                      {(tour.included && tour.included.length) ? tour.included.map((it: string, idx: number) => (
                        <li key={idx} className="text-gray-600 text-sm flex items-start gap-3 p-3 bg-emerald-50/50 rounded-lg">
                          <Check size={16} className="text-emerald-600 mt-0.5 shrink-0" />
                          <span className="leading-snug">{it}</span>
                        </li>
                      )) : <li className="text-gray-400 italic">No specifics listed</li>}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-800 mb-4 flex items-center gap-2">
                      <X size={20} className="text-red-500" /> Not Included
                    </h4>
                    <ul className="space-y-3">
                      {(tour.excluded && tour.excluded.length) ? tour.excluded.map((it: string, idx: number) => (
                        <li key={idx} className="text-gray-600 text-sm flex items-start gap-3 p-3 bg-red-50/50 rounded-lg">
                          <X size={16} className="text-red-500 mt-0.5 shrink-0" />
                          <span className="leading-snug">{it}</span>
                        </li>
                      )) : <li className="text-gray-400 italic">No specifics listed</li>}
                    </ul>
                  </div>
                </div>
              </section>

            </div>

            {/* --- RIGHT COLUMN: Sticky Sidebar --- */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">

                {/* Booking Card */}
                <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
                  <div className="mb-6 pb-6 border-b border-gray-100">
                    <p className="text-gray-500 text-sm font-medium uppercase tracking-wide mb-1">Total Price</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-gray-900">
                        {typeof tour.price === 'number' ? `$${tour.price}` : (tour.price || 'Contact us')}
                      </span>
                      <span className="text-gray-500">/ person</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-3">
                      <div className="bg-white p-2 rounded-lg shadow-sm text-emerald-600">
                        <Check size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Best Price Guarantee</p>
                        <p className="text-xs text-gray-500">We match any competitor price</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowBooking(true)}
                      className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-200 hover:-translate-y-1 transition-all active:translate-y-0 active:shadow-none"
                    >
                      Book Now
                    </button>

                    <p className="text-center text-xs text-gray-400 mt-2">
                      No payment required today. We'll contact you to confirm.
                    </p>
                  </div>
                </div>

                {/* Help Card */}
                <div className="bg-emerald-900 text-emerald-100 p-6 rounded-3xl relative overflow-hidden">
                  {/* Decorative circle */}
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-emerald-800 rounded-full opacity-50" />

                  <h4 className="font-bold text-white text-lg mb-2 relative z-10">Need Help?</h4>
                  <p className="text-sm opacity-90 mb-4 relative z-10">
                    Not sure about the itinerary? Talk to our travel experts.
                  </p>
                  <button onClick={() => navigate('/contact')} className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium border border-white/20 transition-colors relative z-10">
                    Contact Support
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {showBooking && (
        <BookingModal
          tour={tour}
          form={form}
          setForm={setForm}
          onClose={() => { setShowBooking(false); setForm({ startDate: '', travellers: 1, accommodation: 'Standard', name: '', phone: '', countryCode: '+94', email: '' }); }}
          onShowStatus={setStatusModal}
        />
      )}

      {statusModal?.open && (
        <StatusModal
          type={statusModal.type}
          title={statusModal.title}
          message={statusModal.message}
          onClose={() => setStatusModal(null)}
        />
      )}
      <Footer />
    </>
  );
}

// Status Modal Component
function StatusModal({ type, title, message, onClose }: { type: 'success' | 'error', title: string, message: string, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
          {type === 'success' ? <Check size={32} /> : <X size={32} />}
        </div>

        <h3 className="text-xl font-bold text-center text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 text-center mb-6 text-sm leading-relaxed">{message}</p>

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

// Booking Modal Component
function BookingModal({ tour, form, setForm, onClose, onShowStatus }: any) {
  const todayStr = new Date().toISOString().split('T')[0];

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

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = form.name.trim();
    const phone = form.phone.trim();
    const email = form.email.trim();
    const hasLeadingSpace = /^\s/.test(form.name);
    const phoneDigitsOnly = /^[0-9]+$/.test(phone);
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const hasValidDate = form.startDate && form.startDate >= todayStr;
    const phoneCfg = phoneFormats[form.countryCode];
    const phoneLengthOk = phoneCfg ? phone.length === phoneCfg.max : phone.length > 0;

    if (!hasValidDate) {
      onShowStatus({ open: true, type: 'error', title: 'Invalid Date', message: 'Start date must be today or a future date.' });
      return;
    }

    if (!trimmedName || trimmedName.length > 100 || hasLeadingSpace || !/^[a-zA-Z\s]+$/.test(trimmedName)) {
      onShowStatus({ open: true, type: 'error', title: 'Invalid Name', message: 'Name must contain only letters and spaces (max 100 chars).' });
      return;
    }

    if (!phone || !phoneDigitsOnly || !phoneLengthOk) {
      const expected = phoneCfg ? `${phoneCfg.max} digits` : 'digits only';
      onShowStatus({ open: true, type: 'error', title: 'Invalid Phone', message: `Phone number must contain ${expected} for the selected country.` });
      return;
    }

    const allowedDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
    const emailDomain = email.split('@')[1];
    if (!emailValid || !allowedDomains.includes(emailDomain)) {
      onShowStatus({ open: true, type: 'error', title: 'Invalid Email', message: 'Email must be a valid address from Gmail, Yahoo, Outlook, or Hotmail.' });
      return;
    }

    try {
      await createTripRequest({
        tourId: tour.id,
        startDate: form.startDate,
        travellers: Number(form.travellers) || 1,
        accommodationType: form.accommodation,
        fullName: trimmedName,
        phone: `${form.countryCode} ${phone}`.trim(),
        email,
      });
      // Show success modal
      onClose(); // Close booking modal first
      onShowStatus({
        open: true,
        type: 'success',
        title: 'Request Submitted!',
        message: 'Your booking request has been received. Our team will contact you shortly to confirm details.'
      });
    } catch (err) {
      console.error('Booking: failed to submit request', err);
      // Show error modal (keep booking modal open or close? sticking to plan: show error on top or replace. Let's show on top of booking modal if we don't close, but standard UX is usually alert on top. 
      // If we don't close BookingModal, the StatusModal needs to have higher Z-index. 
      // User asked for "sub modal", implies it pops up. 
      // Let's pass the error up to the parent to handle showing.
      onShowStatus({
        open: true,
        type: 'error',
        title: 'Submission Failed',
        message: 'We could not submit your request at this time. Please check your connection and display details.'
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Book Your Trip</h3>
            <p className="text-gray-500 text-sm mt-1">{tour.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Start date</label>
              <input
                required
                type="date"
                min={todayStr}
                value={form.startDate}
                onChange={e => setForm({ ...form, startDate: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Travellers</label>
              <input required type="number" min={1} value={form.travellers} onChange={e => setForm({ ...form, travellers: Number(e.target.value) })} className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Accommodation</label>
            <div className="grid grid-cols-3 gap-3">
              {['Standard', 'Comfort', 'Luxury'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setForm({ ...form, accommodation: type })}
                  className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${form.accommodation === type ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Full Name</label>
            <input
              required
              value={form.name}
              maxLength={100}
              onChange={e => {
                const sanitized = e.target.value.replace(/^\s+/, '');
                setForm({ ...form, name: sanitized });
              }}
              className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Phone</label>
            <div className="flex gap-3">
              <select
                value={form.countryCode}
                onChange={e => {
                  const code = e.target.value;
                  const cfg = phoneFormats[code];
                  const trimmed = cfg ? form.phone.slice(0, cfg.max) : form.phone;
                  setForm({ ...form, countryCode: code, phone: trimmed });
                }}
                className="bg-gray-50 border border-gray-200 px-3 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none w-28 text-sm"
              >
                <option value="+94">🇱🇰 +94</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+61">🇦🇺 +61</option>
                {/* Add other options as needed */}
              </select>
              <input
                required
                inputMode="numeric"
                pattern="[0-9 ]*"
                value={formatPhone(form.phone, form.countryCode)}
                onChange={e => {
                  const cfg = phoneFormats[form.countryCode];
                  const digitsOnly = e.target.value.replace(/\D/g, '');
                  const limited = cfg ? digitsOnly.slice(0, cfg.max) : digitsOnly;
                  setForm({ ...form, phone: limited });
                }}
                className="flex-1 bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
                placeholder={phoneFormats[form.countryCode]?.placeholder || 'Enter phone'}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Email</label>
            <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all" placeholder="you@example.com" />
          </div>

          <button type="submit" className="w-full py-4 mt-4 bg-emerald-600 text-white font-bold text-lg rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200">
            Submit Request
          </button>
        </form>
      </div>

    </div>

  );
}