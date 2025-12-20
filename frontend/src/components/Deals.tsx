import { Tag, Clock, Users, Sparkles, ArrowRight, Calendar, Star, Gift } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchDeals, toMediaUrl } from '../api/client';

type DealItem = {
  id: string;
  title: string;
  subtitle: string;
  originalPrice?: string;
  discountedPrice?: string;
  discount?: string;
  image: string;
  duration?: string;
  validUntil?: string;
  spotsLeft?: number;
  featured?: boolean;
  benefits?: string[];
};

export default function Deals() {
  const [hoveredDeal, setHoveredDeal] = useState<string | null>(null);
  const [deals, setDeals] = useState<DealItem[]>([]);

  useEffect(() => {
    let mounted = true;

    const loadDeals = async () => {
      try {
        const res = await fetchDeals({ isActive: true });
        const items = (res.items || []).map((deal: any) => ({
          id: deal._id,
          title: deal.title,
          subtitle: deal.description || '',
          originalPrice: deal.price ? `$${deal.price}` : undefined,
          discountedPrice: deal.discount ? `$${deal.discount}` : undefined,
          discount: deal.discount ? `${deal.discount}%` : undefined,
          image: toMediaUrl(deal.imageUrl),
          validUntil: deal.expiryDate ? new Date(deal.expiryDate).toDateString() : undefined,
          spotsLeft: deal.spotsLeft,
          featured: deal.isActive,
          benefits: [],
        }));

        if (mounted) {
          setDeals(items);
        }
      } catch (error) {
        console.error('Failed to load deals', error);
      }
    };

    loadDeals();

    return () => {
      mounted = false;
    };
  }, []);

  const getTimeLeft = (validUntil?: string) => {
    if (!validUntil) return 'Limited time';
    const endDate = new Date(validUntil);
    const now = new Date();
    const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft > 0 ? `${daysLeft} days left` : 'Expired';
  };

  return (
    <section id="deals" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
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

        {deals.length === 0 && (
          <div className="bg-white/80 border border-orange-100 rounded-2xl p-10 text-center text-gray-600">
            No active deals yet. Check back soon!
          </div>
        )}

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
              <div className="relative h-64 overflow-hidden">
                {deal.image ? (
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                {deal.discount && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    {deal.discount} OFF
                  </div>
                )}
                {deal.featured && (
                  <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                    <Star size={12} />
                    HOT DEAL
                  </div>
                )}

                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-bold text-white mb-1">{deal.title}</h3>
                  <p className="text-white/90 text-sm">{deal.subtitle}</p>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    {deal.originalPrice && (
                      <span className="text-gray-400 line-through text-sm mr-2">{deal.originalPrice}</span>
                    )}
                    {deal.discountedPrice && (
                      <span className="text-2xl font-bold text-amber-600">{deal.discountedPrice}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock size={14} />
                    {getTimeLeft(deal.validUntil)}
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {deal.duration && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={16} className="text-amber-500" />
                      <span>{deal.duration}</span>
                    </div>
                  )}
                  {typeof deal.spotsLeft === 'number' && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users size={16} className="text-amber-500" />
                      <span>{deal.spotsLeft} spots left</span>
                    </div>
                  )}
                </div>

                {deal.benefits && deal.benefits.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Includes:</h4>
                    <div className="flex flex-wrap gap-2">
                      {deal.benefits.map((benefit: string, idx: number) => (
                        <span key={idx} className="bg-amber-50 text-amber-700 text-xs px-2 py-1 rounded-full">
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg group">
                  Book Now
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {hoveredDeal === deal.id && (
                <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 to-transparent pointer-events-none"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
