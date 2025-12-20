import { useEffect, useState } from 'react';
import Header from '../components/Header';
import { createTripRequest, fetchTourDetails, toMediaUrl } from '../api/client';

export default function ExploreTour() {
  const [tour, setTour] = useState<any | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [form, setForm] = useState({ startDate: '', travellers: 1, accommodation: 'Standard', name: '', phone: '', countryCode: '+94', email: '' });

  useEffect(() => {
    let mounted = true;
    const loadTour = async () => {
      try {
        const path = window.location.pathname || '';
        const id = path.replace('/trip/', '').split('/')[0];
        if (!id) return;

        const detail = await fetchTourDetails(id);
        const photos = detail.images?.map((img: any) => toMediaUrl(img.imageUrl)).filter(Boolean) || [];
        const included = detail.inclusions?.map((item: any) => item.description) || [];
        const excluded = detail.exclusions?.map((item: any) => item.description) || [];
        const plan = detail.itinerary
          ?.sort((a: any, b: any) => a.dayNumber - b.dayNumber)
          .map((item: any) => item.activity) || [];

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
      }
    };

    loadTour();

    return () => {
      mounted = false;
    };
  }, []);

  if (!tour) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-24">
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <h2 className="text-2xl font-semibold mb-2">Tour not found</h2>
            <p className="text-gray-600 mb-4">We couldn't find the tour you requested.</p>
            <div className="mt-6">
              <button onClick={() => window.location.href = '/'} className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">Back to Home</button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
    <Header />
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-start justify-between mb-8 pb-6 border-b border-gray-200">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <span>{tour.location}</span>
              <span className="mx-2">•</span>
              <span>{tour.duration || tour.days || 'Duration N/A'}</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{tour.name}</h1>
            {tour.rating && (
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-5 h-5 ${i < Math.floor(tour.rating) ? 'text-amber-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-600">{tour.rating} ({tour.reviews || 0} reviews)</span>
              </div>
            )}
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-10">
          {(() => {
            const photos: string[] = (tour.photos && Array.isArray(tour.photos) && tour.photos.length) ? tour.photos.filter((p: string) => p && p.trim()) : (tour.image ? [tour.image] : []);
            const main = photos[0] || '';
            const thumbs = photos.slice(1, 5);
            return (
              <>
                <div className="md:col-span-2 md:row-span-2 h-96 bg-gray-200 overflow-hidden rounded-xl shadow-md">
                  {main ? <img src={main} alt="Main tour photo" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-100" />}
                </div>
                {thumbs.map((p, idx) => (
                  <div key={`thumb-${idx}`} className="h-48 md:h-auto bg-gray-200 overflow-hidden rounded-xl shadow-md">
                    <img src={p} alt={`Tour photo ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </>
            );
          })()}
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Overview</h3>
              </div>
              <p className="text-gray-700 leading-relaxed text-base">{tour.description || tour.overview || 'No overview available for this tour.'}</p>
            </section>

            <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Tour Plan</h3>
              </div>
              <div className="space-y-4">
                {(Array.isArray(tour.plan) && tour.plan.length > 0) ? (
                  tour.plan.map((p: any, idx: number) => (
                    <div key={idx} className="flex gap-4 group">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg">{idx + 1}</div>
                        {idx < tour.plan.length - 1 && (<div className="w-0.5 flex-1 bg-emerald-200 mt-2"></div>)}
                      </div>
                      <div className="flex-1 pb-6">
                        <h4 className="font-bold text-lg text-gray-900 mb-2">Day {idx + 1}</h4>
                        {Array.isArray(p) ? (
                          <ul className="text-gray-600 leading-relaxed list-disc ml-6 space-y-1">
                            {p.map((sub: string, sidx: number) => <li key={sidx}>{sub}</li>)}
                          </ul>
                        ) : (
                          <p className="text-gray-600 leading-relaxed">{p}</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  (() => {
                    const days = (() => {
                      if (tour.days) return Number(tour.days) || 1;
                      const d = String(tour.duration || '').match(/(\d+)/);
                      return d ? Number(d[0]) : (String(tour.duration || '').toLowerCase().includes('full') ? 1 : 1);
                    })();
                    return Array.from({ length: Math.max(1, days) }).map((_, i) => (
                      <div key={i} className="flex gap-4 group">
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg">{i + 1}</div>
                          {i < days - 1 && (<div className="w-0.5 flex-1 bg-emerald-200 mt-2"></div>)}
                        </div>
                        <div className="flex-1 pb-6">
                          <h4 className="font-bold text-lg text-gray-900 mb-2">Day {i + 1}</h4>
                          <p className="text-gray-600 leading-relaxed">Sample activities for day {i + 1} of the trip.</p>
                        </div>
                      </div>
                    ));
                  })()
                )}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="bg-white p-6 rounded-xl shadow-lg border-2 border-emerald-100 sticky top-6">
              <div className="text-center mb-6">
                <div className="text-sm text-gray-500 mb-1">From</div>
                <div className="text-4xl font-bold text-emerald-600">
                  {typeof tour.price === 'number' ? `$${tour.price}` : (tour.price || 'Contact for price')}
                </div>
                <div className="text-sm text-gray-500 mt-1">per person</div>
              </div>
              <button onClick={() => setShowBooking(true)} className="w-full px-6 py-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-bold text-lg shadow-lg mb-4">Book This Tour</button>
              <div className="text-center text-sm text-gray-500">
                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Free cancellation up to 24 hours
              </div>
            </section>

            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h4 className="font-bold text-lg mb-4 text-gray-900">What's Included</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <span className="font-semibold text-gray-700">Included</span>
                  </div>
                  <ul className="space-y-2 ml-7">
                    {(tour.included && tour.included.length) ? tour.included.map((it: string, idx: number) => (
                      <li key={idx} className="text-gray-600 text-sm flex items-start gap-2"><span className="text-emerald-600 mt-0.5">✓</span><span>{it}</span></li>
                    )) : <li className="text-gray-600 text-sm flex items-start gap-2"><span className="text-emerald-600 mt-0.5">✓</span><span>Guide & transport</span></li>}
                  </ul>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    <span className="font-semibold text-gray-700">Excluded</span>
                  </div>
                  <ul className="space-y-2 ml-7">
                    {(tour.excluded && tour.excluded.length) ? tour.excluded.map((it: string, idx: number) => (
                      <li key={idx} className="text-gray-600 text-sm flex items-start gap-2"><span className="text-red-500 mt-0.5">✗</span><span>{it}</span></li>
                    )) : <li className="text-gray-600 text-sm flex items-start gap-2"><span className="text-red-500 mt-0.5">✗</span><span>Flights & personal expenses</span></li>}
                  </ul>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
      {showBooking && (
        <BookingModal
          tour={tour}
          form={form}
          setForm={setForm}
          onClose={() => { setShowBooking(false); setForm({ startDate: '', travellers: 1, accommodation: 'Standard', name: '', phone: '', countryCode: '+94', email: '' }); }}
        />
      )}
    </>
  );
}

// Booking modal and logic
function BookingModal({ tour, form, setForm, onClose }: any) {
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTripRequest({
        tourId: tour.id,
        startDate: form.startDate,
        travellers: Number(form.travellers) || 1,
        accommodationType: form.accommodation,
        fullName: form.name,
        phone: `${form.countryCode} ${form.phone}`.trim(),
        email: form.email,
      });
      alert('Request submitted — admin will contact you.');
      onClose();
    } catch (err) {
      console.error('Booking: failed to submit request', err);
      alert('Failed to submit request. See console for details.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-xl w-full p-6">
        <h3 className="text-lg font-semibold mb-4">Request this trip: {tour.name}</h3>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Start date</label>
            <input required type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} className="w-full border px-3 py-2 rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Travellers</label>
              <input required type="number" min={1} value={form.travellers} onChange={e => setForm({ ...form, travellers: Number(e.target.value) })} className="w-full border px-3 py-2 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Accommodation</label>
              <select value={form.accommodation} onChange={e => setForm({ ...form, accommodation: e.target.value })} className="w-full border px-3 py-2 rounded-lg">
                <option>Standard</option>
                <option>Comfort</option>
                <option>Luxury</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Full name</label>
            <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border px-3 py-2 rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Contact number</label>
              <div className="flex gap-2">
                <select
                  value={form.countryCode}
                  onChange={e => setForm({ ...form, countryCode: e.target.value })}
                  className="w-28 border px-2 py-2 rounded-lg focus:outline-none focus:border-emerald-500"
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
                <input required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="flex-1 border px-3 py-2 rounded-lg" placeholder="76 046 5855" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Email</label>
              <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full border px-3 py-2 rounded-lg" />
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 pt-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-lg">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg">Request this trip</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// render booking modal from page state
// (placed after BookingModal declaration to avoid hoisting issues)
// (no additional exports)
