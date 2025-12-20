import { Tag, Clock, Users, Sparkles, ArrowRight, Calendar, Star, Gift } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Deals() {
  const [hoveredDeal, setHoveredDeal] = useState<number | null>(null);
  const [deals, setDeals] = useState<any[]>([]);

  // default hardcoded deals
  const defaultDeals = [
    {
      id: 1,
      title: 'Summer Beach Getaway',
      subtitle: 'Mirissa & Unawatuna',
      originalPrice: '$450',
      discountedPrice: '$299',
      discount: '35%',
      image: 'https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: '3 Days / 2 Nights',
      validUntil: 'Dec 31, 2024',
      spotsLeft: 5,
      featured: true,
      benefits: ['Beach Resort Stay', 'Whale Watching', 'All Meals Included', 'Private Transport']
    },
    {
      id: 2,
      title: 'Cultural Triangle Tour',
      subtitle: 'Sigiriya, Dambulla & Polonnaruwa',
      originalPrice: '$380',
      discountedPrice: '$249',
      discount: '34%',
      image: 'https://images.pexels.com/photos/11330271/pexels-photo-11330271.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: '2 Days / 1 Night',
      validUntil: 'Jan 15, 2025',
      spotsLeft: 8,
      featured: true,
      benefits: ['Expert Guide', 'Entrance Fees', 'Breakfast & Lunch', 'Air-Conditioned Vehicle']
    },
    {
      id: 3,
      title: 'Hill Country Escape',
      subtitle: 'Nuwara Eliya & Ella',
      originalPrice: '$350',
      discountedPrice: '$229',
      discount: '35%',
      image: 'https://images.pexels.com/photos/4666748/pexels-photo-4666748.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: '3 Days / 2 Nights',
      validUntil: 'Dec 20, 2024',
      spotsLeft: 3,
      featured: false,
      benefits: ['Tea Factory Visit', 'Train Ride', '2 Star Hotel', 'Breakfast Daily']
    },
    {
      id: 4,
      title: 'Wildlife Safari Adventure',
      subtitle: 'Yala National Park',
      originalPrice: '$280',
      discountedPrice: '$199',
      discount: '29%',
      image: 'https://images.pexels.com/photos/2245436/pexels-photo-2245436.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: 'Full Day',
      validUntil: 'Jan 31, 2025',
      spotsLeft: 12,
      featured: false,
      benefits: ['Safari Jeep', 'Experienced Tracker', 'Packed Lunch', 'Park Entrance']
    },
    {
      id: 5,
      title: 'Galle Fort Heritage Walk',
      subtitle: 'Colonial History Tour',
      originalPrice: '$120',
      discountedPrice: '$79',
      discount: '34%',
      image: 'https://images.pexels.com/photos/11179440/pexels-photo-11179440.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: 'Half Day',
      validUntil: 'Dec 15, 2024',
      spotsLeft: 15,
      featured: false,
      benefits: ['Walking Tour', 'Historical Guide', 'Light Refreshments', 'Photography Stops']
    },
    {
      id: 6,
      title: 'Kandy Cultural Experience',
      subtitle: 'Temple & Traditional Dance',
      originalPrice: '$180',
      discountedPrice: '$129',
      discount: '28%',
      image: 'https://images.pexels.com/photos/14618756/pexels-photo-14618756.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: '1 Day',
      validUntil: 'Jan 10, 2025',
      spotsLeft: 10,
      featured: false,
      benefits: ['Temple Visit', 'Cultural Show', 'Traditional Lunch', 'City Tour']
    }
  ];

  // normalize stored deals (from admin) to the shape used by this component
  const normalize = (d: any, idx: number) => {
    return {
      id: d.id || 1000 + idx,
      title: d.title || d.name || 'Deal',
      subtitle: d.subtitle || d.description || '',
      originalPrice: d.originalPrice || '',
      discountedPrice: d.price || d.discountedPrice || '$0',
      discount: d.discount || '',
      image: d.image || '',
      duration: d.duration || '',
      validUntil: d.validUntil || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toDateString(),
      spotsLeft: d.spotsLeft || 10,
      featured: d.featured || false,
      benefits: d.benefits || []
    };
  };

  // load deals from localStorage if present
  useEffect(() => {
    try {
      const raw = localStorage.getItem('deals');
      if (raw) {
        const stored = JSON.parse(raw);
        if (Array.isArray(stored)) {
          setDeals(stored.map((d: any, i: number) => normalize(d, i)));
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to read deals from localStorage', e);
    }
    setDeals(defaultDeals);
  }, []);

  // Listen for cross-tab updates when admin adds/edits deals
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'deals' && e.newValue != null) {
        try {
          const stored = JSON.parse(e.newValue);
          if (Array.isArray(stored)) {
            setDeals(stored.map((d: any, i: number) => normalize(d, i)));
          }
        } catch (err) {
          // ignore
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const getTimeLeft = (validUntil: string) => {
    const endDate = new Date(validUntil);
    const now = new Date();
    const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft > 0 ? `${daysLeft} days left` : 'Expired';
  };

  return (
    <section id="deals" className="relative py-24 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50"></div>
        {/* Animated Shapes */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-orange-200 text-orange-700 rounded-full px-5 py-2.5 mb-6 shadow-lg">
            <Gift size={16} className="animate-bounce" />
            <span className="text-sm font-semibold">Limited Time Offers</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4">
            Hot <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent animate-gradient">Deals</span>
          </h2>
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-orange-600 to-transparent rounded-full"></div>
            <Sparkles size={20} className="text-orange-600 animate-spin-slow" />
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent rounded-full"></div>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Grab these exclusive offers before they're gone! Limited availability on our most popular tours.
          </p>
        </div>

        {/* Deals Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {deals.map((deal, index) => (
            <div
              key={deal.id}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-4"
              style={{ 
                animationDelay: `${index * 150}ms`,
                animation: 'fadeInUp 0.8s ease-out forwards',
                opacity: 0
              }}
              onMouseEnter={() => setHoveredDeal(deal.id)}
              onMouseLeave={() => setHoveredDeal(null)}
            >
              {/* Glow Effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-3xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-700"></div>
              
              <div className="relative bg-white rounded-3xl overflow-hidden">
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-125 group-hover:rotate-2"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 group-hover:opacity-90 transition-all duration-700"></div>
                  
                  {/* Discount Badge */}
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-orange-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-2xl flex items-center space-x-1.5 animate-pulse">
                    <Tag size={16} fill="white" />
                    <span>{deal.discount} OFF</span>
                  </div>

                  {/* Featured Badge */}
                  {deal.featured && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xl flex items-center space-x-1 animate-bounce-slow">
                      <Sparkles size={12} className="animate-spin-slow" />
                      <span>FEATURED</span>
                    </div>
                  )}

                  {/* Price Display */}
                  <div className="absolute bottom-4 right-4 text-right">
                    <div className="text-white/70 text-sm line-through">{deal.originalPrice}</div>
                    <div className="text-white text-3xl font-bold flex items-center justify-end">
                      <span className="text-lg mr-1">$</span>
                      {deal.discountedPrice.replace('$', '')}
                    </div>
                  </div>

                  {/* Duration Badge */}
                  <div className={`absolute bottom-4 left-4 bg-white/95 backdrop-blur-md text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center space-x-1 transform transition-all duration-700 ${
                    hoveredDeal === deal.id ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                  }`}>
                    <Clock size={12} className="text-orange-600" />
                    <span>{deal.duration}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-red-600 transition-all duration-500">
                      {deal.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{deal.subtitle}</p>
                  </div>

                  {/* Benefits List */}
                  <div className="space-y-2">
                    {deal.benefits.slice(0, 3).map((benefit: any, idx: number) => (
                      <div key={idx} className="flex items-center text-xs text-gray-600">
                        <Star size={12} className="text-amber-500 mr-2 fill-amber-500" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>

                  {/* Info Row */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center text-xs">
                      <Calendar size={14} className="text-orange-600 mr-1.5" />
                      <span className="text-gray-600 font-medium">{getTimeLeft(deal.validUntil)}</span>
                    </div>
                    <div className={`flex items-center text-xs font-semibold ${deal.spotsLeft <= 5 ? 'text-red-600' : 'text-emerald-600'}`}>
                      <Users size={14} className="mr-1.5" />
                      <span>{deal.spotsLeft} spots left</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button className="relative w-full bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-700 hover:via-orange-700 hover:to-red-700 text-white font-bold py-3 rounded-2xl transition-all duration-500 flex items-center justify-center space-x-2 shadow-lg hover:shadow-2xl overflow-hidden group/btn transform group-hover:scale-105">
                    <span className="relative z-10">Grab This Deal</span>
                    <ArrowRight size={20} className="relative z-10 transform group-hover/btn:translate-x-2 transition-transform duration-500" />
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 scale-0 group-hover/btn:scale-100 transition-transform duration-700 bg-gradient-to-r from-white/0 via-white/30 to-white/0"></div>
                  </button>
                </div>

                {/* Animated Border Bottom */}
                <div className="h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
              </div>
            </div>
          ))}
        </div>

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