import { MapPin, DollarSign, Clock, Star, ArrowRight, Users, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchTourDetails, fetchTours, toMediaUrl } from '../api/client';

type TourItem = {
  id: string;
  name: string;
  location: string;
  price: number | string;
  description: string;
  duration: number | string;
  rating?: number;
  popular?: boolean;
  reviews?: number;
  photos?: string[];
};

export default function Tours() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [tours, setTours] = useState<TourItem[]>([]);

  useEffect(() => {
    let mounted = true;

    const loadTours = async () => {
      try {
        const res = await fetchTours();
        const baseTours: TourItem[] = (res.items || []).map((tour: any) => ({
          id: tour._id,
          name: tour.name,
          location: tour.location,
          price: tour.price,
          description: tour.description,
          duration: tour.duration,
          rating: tour.rating,
          popular: tour.isHotDeal,
          reviews: tour.reviewsCount,
        }));

        const withImages = await Promise.all(
          baseTours.map(async (tour) => {
            try {
              const detail = await fetchTourDetails(tour.id);
              const photos = detail.images?.map((img: any) => toMediaUrl(img.imageUrl)).filter(Boolean) || [];
              return { ...tour, photos };
            } catch {
              return tour;
            }
          })
        );

        if (mounted) setTours(withImages);
      } catch (error) {
        console.error('Failed to load tours', error);
      }
    };

    loadTours();

    return () => {
      mounted = false;
    };
  }, []);

  const openDetail = (tour: TourItem) => {
    if (tour && tour.id) {
      window.location.href = `/trip/${tour.id}`;
    } else {
      alert('Cannot open tour - ID is missing');
    }
  };

  return (
    <section id="tours" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm text-emerald-700 rounded-full px-5 py-2.5 mb-6 shadow-lg border border-emerald-100">
            <Sparkles size={16} className="animate-pulse" />
            <span className="text-sm font-semibold">Popular Tours</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4">
            Sarkam <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent animate-gradient">Collections</span>
          </h2>
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-emerald-600 to-transparent rounded-full"></div>
            <div className="w-3 h-3 bg-emerald-600 rounded-full animate-pulse"></div>
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-teal-600 to-transparent rounded-full"></div>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Handpicked destinations that showcase the best of Sri Lanka's natural beauty and cultural heritage
          </p>
        </div>

        {tours.length === 0 && (
          <div className="bg-white rounded-2xl border border-emerald-100 p-10 text-center text-gray-600">
            No tours available yet. Please check back soon.
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {tours.map((tour, index) => (
            <div
              key={tour.id}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-4 hover:rotate-1"
              style={{ 
                animationDelay: `${index * 150}ms`,
                animation: 'fadeInUp 0.8s ease-out forwards',
                opacity: 0
              }}
              onMouseEnter={() => setHoveredCard(tour.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-700"></div>
              
              <div className="relative bg-white rounded-3xl overflow-hidden">
                <div className="relative h-72 overflow-hidden">
                  {(() => {
                    const photos: string[] = (tour.photos && tour.photos.length) ? tour.photos : [];
                    const main = photos[0];
                    return main ? (
                      <img
                        src={main}
                        alt={tour.name}
                        className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-125 group-hover:rotate-3"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100" />
                    );
                  })()}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  
                  {tour.popular && (
                    <div className="absolute top-4 left-4 bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                      <Sparkles size={14} />
                      Hot Deal
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 text-white/90 text-sm mb-2">
                      <MapPin size={14} />
                      {tour.location}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{tour.name}</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-white">
                        <DollarSign size={16} />
                        <span className="text-xl font-bold">
                          {typeof tour.price === 'number' ? `$${tour.price}` : tour.price}
                        </span>
                        <span className="text-white/70 text-sm">/person</span>
                      </div>
                      <div className="flex items-center gap-1 text-white/90">
                        <Clock size={14} />
                        <span className="text-sm">{tour.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-600 mb-4 line-clamp-2">{tour.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < Math.floor(tour.rating || 0) ? 'text-amber-400 fill-current' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">({tour.reviews || 0})</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Users size={14} />
                      {Math.floor(Math.random() * 20) + 5} booked
                    </div>
                  </div>

                  <button
                    onClick={() => openDetail(tour)}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg group"
                  >
                    Explore Tour
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {hoveredCard === tour.id && (
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent pointer-events-none"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
