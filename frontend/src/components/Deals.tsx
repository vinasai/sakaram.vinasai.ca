import { Tag, Clock, Users, Sparkles, ArrowRight, Calendar, Star, Gift, TicketPercent } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchDeals, toMediaUrl } from '../api/client';
import LoadingState from './LoadingState';
import EmptyState from './EmptyState';
import DealRequestModal from './DealRequestModal';

type DealItem = {
  id: string;
  title: string;
  subtitle: string;
  originalPrice: string;
  discountedPrice: string;
  discount: string;
  image: string;
  duration: string;
  validUntil: string;
  spotsLeft: number;
  featured: boolean;
  benefits: string[];
};

export default function Deals() {
  const [hoveredDeal, setHoveredDeal] = useState<string | null>(null);
  const [deals, setDeals] = useState<DealItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeal, setSelectedDeal] = useState<DealItem | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadDeals = async () => {
      try {
        const fetchAndMap = (res: any) => (res.items || []).map((deal: any) => {
          // Calculate discount percentage if numeric discount provided
          let discountPercent = '0%';
          let discountedPrice = deal.price;

          if (deal.price && deal.discount) {
            // Assuming backend "discount" is a flat amount reduced from price, based on previous code context.
            // Or if it's already a percent? The user previously mentioned deal.discount might be amount.
            // In my previous Deals.tsx: 
            // discountedPrice: deal.price && deal.discount ? `$${deal.price - deal.discount}`
            // displayDiscount: Math.round((deal.discount / deal.price) * 100)}%

            const original = Number(deal.price);
            const discAmount = Number(deal.discount);
            const final = original - discAmount;
            discountedPrice = final;

            if (original > 0) {
              discountPercent = `${Math.round((discAmount / original) * 100)}%`;
            }
          }

          return {
            id: deal._id,
            title: deal.title,
            subtitle: deal.tagline || '', // Map tagline to subtitle as per design intent
            originalPrice: deal.price ? `$${deal.price}` : '',
            discountedPrice: `$${discountedPrice}`,
            discount: discountPercent,
            image: toMediaUrl(deal.imageUrl),
            duration: deal.duration || 'Flexible',
            validUntil: deal.expiryDate ? new Date(deal.expiryDate).toDateString() : undefined,
            spotsLeft: deal.spotsLeft || 0,
            featured: false, // No backend field yet
            benefits: deal.inclusions || [],
          };
        });

        const resActive = await fetchDeals({ isActive: true });
        let items = fetchAndMap(resActive);

        if ((!items || items.length === 0)) {
          // Fallback or load all if needed, but usually we just want active.
          // Leaving empty if no active deals found.
        }

        if (mounted) {
          setDeals(items);
        }
      } catch (error) {
        console.error('Failed to load deals', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadDeals();

    return () => {
      mounted = false;
    };
  }, []);

  const getTimeLeft = (validUntil?: string) => {
    if (!validUntil) return null;
    const endDate = new Date(validUntil);
    const now = new Date();
    const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft > 0 ? `${daysLeft} days left` : 'Expired';
  };

  return (
    <section id="deals" className="relative overflow-hidden pb-20 pt-20 scroll-mt-28">
      {/* Animated Background */}


      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-orange-200 text-orange-700 rounded-full px-5 py-2.5 mb-6 shadow-lg">

            <span className="text-sm font-semibold">Limited Time Offers</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4">
            Hot <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent animate-gradient">Deals</span>
          </h2>


          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-orange-600 to-transparent rounded-full"></div>
            <div className="w-3 h-3 bg-orange-600 rounded-full animate-pulse"></div>
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-orange-600 to-transparent rounded-full"></div>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Grab these exclusive offers before they're gone! Limited availability on our most popular tours.
          </p>
        </div>

        {loading ? (
          <LoadingState count={3} />
        ) : deals.length === 0 ? (
          <EmptyState
            title="No Active Deals"
            message="Check back soon for exclusive offers and limited-time discounts on our tours."
            icon={TicketPercent}
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto items-start">
            {deals.map((deal, index) => (
              <div
                key={deal.id}
                id={deal.id}
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
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-3xl opacity-0 "></div>

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
                    {deal.discount && deal.discount !== '0%' && (
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-orange-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-2xl flex items-center space-x-1.5 animate-pulse">
                        <Tag size={16} fill="white" />
                        <span>{deal.discount} OFF</span>
                      </div>
                    )}

                    {/* Featured Badge */}
                    {deal.featured && (
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xl flex items-center space-x-1 animate-bounce-slow">
                        <Sparkles size={12} className="animate-spin-slow" />
                        <span>FEATURED</span>
                      </div>
                    )}

                    {/* Price Display */}
                    <div className="absolute bottom-4 right-4 text-right">
                      {deal.originalPrice && <div className="text-white/70 text-sm line-through">{deal.originalPrice}</div>}
                      <div className="text-white text-3xl font-bold flex items-center justify-end">
                        {/* Assuming valid price string with symbol, if not we add it */}
                        <span className="text-lg mr-1">$</span>
                        {deal.discountedPrice.replace('$', '')}
                      </div>
                    </div>

                    {/* Duration Badge */}
                    <div className={`absolute bottom-4 left-4 bg-white/95 backdrop-blur-md text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center space-x-1 transform transition-all duration-700 ${hoveredDeal === deal.id ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
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
                      {deal.subtitle && <p className="text-gray-600 text-sm">{deal.subtitle}</p>}
                    </div>

                    {/* Benefits List */}
                    {deal.benefits.length > 0 && (
                      <div className="space-y-2">
                        {deal.benefits.slice(0, 3).map((benefit: any, idx: number) => (
                          <div key={idx} className="flex items-center text-xs text-gray-600">
                            <Star size={12} className="text-amber-500 mr-2 fill-amber-500" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Info Row */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center text-xs">
                        <Calendar size={14} className="text-orange-600 mr-1.5" />
                        <span className="text-gray-600 font-medium">{getTimeLeft(deal.validUntil) || 'Limited Time'}</span>
                      </div>
                      {typeof deal.spotsLeft === 'number' && (
                        <div className={`flex items-center text-xs font-semibold ${deal.spotsLeft <= 5 ? 'text-red-600' : 'text-emerald-600'}`}>
                          <Users size={14} className="mr-1.5" />
                          <span>{deal.spotsLeft} spots left</span>
                        </div>
                      )}
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => setSelectedDeal(deal)}
                      className="relative w-full bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-700 hover:via-orange-700 hover:to-red-700 text-white font-bold py-3 rounded-2xl transition-all duration-500 flex items-center justify-center space-x-2 shadow-lg hover:shadow-2xl overflow-hidden group/btn transform group-hover:scale-105"
                    >
                      <span className="relative z-10">Grab This Deal</span>
                      <ArrowRight size={20} className="relative z-10 transform group-hover/btn:translate-x-2 transition-transform duration-500" />
                      {/* Shimmer Effect */}
                      <div className="absolute inset-0 scale-0 group-hover/btn:scale-100 transition-transform duration-700 bg-gradient-to-r from-white/0 via-white/30 to-white/0"></div>
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

        {selectedDeal && (
          <DealRequestModal
            deal={selectedDeal}
            onClose={() => setSelectedDeal(null)}
          />
        )}
      </div>


    </section>
  );
}
