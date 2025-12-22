import { MapPin, DollarSign, Clock, Star, ArrowRight, Users, Sparkles, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchTourDetails, fetchTours, toMediaUrl } from '../api/client';
import LoadingState from './LoadingState';
import EmptyState from './EmptyState';

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
  image?: string; // Fallback
};

export default function Tours() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [tours, setTours] = useState<TourItem[]>([]);
  const [loading, setLoading] = useState(true);

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
          image: tour.imageUrl ? toMediaUrl(tour.imageUrl) : undefined,
        }));

        const withImages = await Promise.all(
          baseTours.map(async (tour) => {
            try {
              const detail = await fetchTourDetails(tour.id);
              const photos = detail.images?.map((img: any) => toMediaUrl(img.imageUrl)).filter(Boolean) || [];
              const mainImage = tour.image || photos[0];
              return { ...tour, photos, image: mainImage };
            } catch {
              return tour;
            }
          })
        );

        if (mounted) setTours(withImages);
      } catch (error) {
        console.error('Failed to load tours', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadTours();

    return () => {
      mounted = false;
    };
  }, []);

  const openDetail = (tour: TourItem) => {
    console.log('Opening tour:', tour);
    if (tour && tour.id) {
      window.location.href = `/trip/${tour.id}`;
    } else {
      console.error('Tour ID is missing:', tour);
      alert('Cannot open tour - ID is missing');
    }
  };

  return (
    <section id="tours" className="relative py-24 overflow-hidden scroll-mt-10">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50"></div>
        {/* Animated Shapes */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm text-emerald-700 rounded-full px-5 py-2.5 mb-6 shadow-lg border border-emerald-100">

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

        {loading ? (
          <LoadingState count={6} />
        ) : tours.length === 0 ? (
          <EmptyState
            title="No Tours Found"
            message="We couldn't find any tours at the moment. Please adjust your filters or check back later."
            icon={Globe}
          />
        ) : (
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
                {/* Glow Effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-700"></div>

                <div className="relative bg-white rounded-3xl overflow-hidden">
                  {/* Image Container */}
                  <div className="relative h-72 overflow-hidden">
                    {(() => {
                      // Use photos array if available, otherwise check image field
                      const photos = (tour.photos && tour.photos.length > 0) ? tour.photos : (tour.image ? [tour.image] : []);
                      const main = photos[0] || '';
                      return (
                        <img
                          src={main}
                          alt={tour.name}
                          className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-125 group-hover:rotate-3"
                        />
                      );
                    })()}

                    {/* Animated Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 group-hover:opacity-90 transition-all duration-700"></div>

                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1500"></div>
                    </div>

                    {/* Popular Badge with Animation */}
                    {tour.popular && (
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-2xl flex items-center space-x-1.5 animate-bounce-slow">
                        <Sparkles size={14} className="animate-spin-slow" />
                        <span>HOT DEAL</span>
                      </div>
                    )}

                    {/* Rating Badge with Hover Effect */}
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md text-gray-800 text-sm font-bold px-4 py-2 rounded-full shadow-xl flex items-center space-x-1.5 transform group-hover:scale-110 transition-transform duration-500">
                      <Star size={16} fill="#fbbf24" className="text-yellow-400 animate-pulse" />
                      <span>{tour.rating || 0}</span>
                    </div>

                    {/* Price Tag - Animated Entry */}
                    <div className={`absolute bottom-4 right-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xl px-5 py-3 rounded-2xl shadow-2xl transform transition-all duration-700 flex items-center space-x-1 ${hoveredCard === tour.id ? 'translate-y-0 rotate-0 scale-110' : 'translate-y-20 rotate-12 scale-90'
                      }`}>
                      <DollarSign size={20} />
                      <span>{Number(tour.price) || 0}</span>
                    </div>

                    {/* Reviews Count - Shows on Hover */}
                    {tour.reviews != null && (
                      <div className={`absolute bottom-4 left-4 bg-white/95 backdrop-blur-md text-gray-700 text-xs font-semibold px-3 py-2 rounded-full shadow-lg flex items-center space-x-1 transform transition-all duration-700 ${hoveredCard === tour.id ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                        }`}>
                        <Users size={14} className="text-emerald-600" />
                        <span>{tour.reviews} reviews</span>
                      </div>
                    )}
                  </div>

                  {/* Content with Stagger Animation */}
                  <div className="p-6 space-y-4">
                    <div className="transform transition-all duration-500 group-hover:translate-x-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-emerald-600 group-hover:to-teal-600 transition-all duration-500">
                        {tour.name}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{tour.description}</p>
                    </div>

                    {/* Info Row with Icons */}
                    <div className="flex items-center justify-between text-sm transform transition-all duration-500 delay-75 group-hover:translate-x-1">
                      <div className="flex items-center text-gray-700 bg-gray-50 px-3 py-2 rounded-lg group-hover:bg-emerald-50 transition-colors duration-500">
                        <MapPin size={16} className="mr-2 text-emerald-600 group-hover:animate-bounce" />
                        <span className="font-medium">{tour.location}</span>
                      </div>
                      <div className="flex items-center text-gray-700 bg-gray-50 px-3 py-2 rounded-lg group-hover:bg-teal-50 transition-colors duration-500">
                        <Clock size={16} className="mr-2 text-teal-600 group-hover:animate-spin-slow" />
                        <span className="font-medium">{tour.duration} day(s)</span>
                      </div>
                    </div>

                    {/* CTA Button with Ripple Effect */}
                    <button onClick={() => openDetail(tour)} className="relative w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white font-bold py-4 rounded-2xl transition-all duration-500 flex items-center justify-center space-x-2 shadow-lg hover:shadow-2xl overflow-hidden group/btn transform group-hover:scale-105">
                      <span className="relative z-10">Explore Now</span>
                      <ArrowRight size={20} className="relative z-10 transform group-hover/btn:translate-x-2 transition-transform duration-500" />
                      {/* Ripple Effect */}
                      <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity duration-500"></div>
                      <div className="absolute inset-0 scale-0 group-hover/btn:scale-100 transition-transform duration-700 bg-gradient-to-r from-white/0 via-white/30 to-white/0"></div>
                    </button>
                  </div>

                  {/* Animated Border Bottom */}
                  <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -50px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(50px, 50px) scale(1.05);
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-blob {
          animation: blob 15s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
