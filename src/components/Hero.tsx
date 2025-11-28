import { useState, useEffect } from 'react';
import { MapPin, Calendar, Users } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';

// Helper to build full media URL from API base
const getMediaBase = () => {
  const mediaEnv = (import.meta.env.VITE_MEDIA_BASE_URL as string) || '';
  if (mediaEnv) return mediaEnv.replace(/\/$/, '');

  const apiBase = (import.meta.env.VITE_API_BASE_URL as string) || '';
  if (apiBase) return apiBase.replace(/\/api\/?$/, '').replace(/\/$/, '');

  return 'http://localhost:5000';
};

export default function Hero() {
  const [currentImage, setCurrentImage] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [images, setImages] = useState<string[]>([
    'https://images.pexels.com/photos/3225531/pexels-photo-3225531.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://images.pexels.com/photos/3573382/pexels-photo-3573382.jpeg?auto=compress&cs=tinysrgb&w=1920'
  ]);

  useEffect(() => {
    let mounted = true;

    const fetchBanners = async () => {
      // first check localStorage for banners added via admin panel
      try {
        const raw = localStorage.getItem('hero_banners');
        if (raw) {
          const stored = JSON.parse(raw) || [];
          const urls = stored
            .map((b: any) => (b && (b.image || b.imageUrl) ? (b.image || b.imageUrl) : null))
            .filter(Boolean)
            .map((u: string) => (u.startsWith('http') ? u : u));
          if (mounted && urls.length > 0) {
            setImages(urls as string[]);
            return; // prefer localStorage entries over API
          }
        }
      } catch (err) {
        // ignore parsing errors and continue to API
        console.warn('Failed to read hero_banners from localStorage', err);
      }

      try {
        const res = await axiosInstance.get('/banner/');
        const banners = res.data || [];
        const mediaBase = getMediaBase();
        const urls = banners.map((b: any) => {
          if (!b || !b.imageUrl) return null;
          // imageUrl may already be absolute or a path like /uploads/...
          return b.imageUrl.startsWith('http') ? b.imageUrl : `${mediaBase}${b.imageUrl}`;
        }).filter(Boolean);

        if (mounted && urls.length > 0) {
          setImages(urls as string[]);
        }
      } catch (err) {
        // ignore and fall back to static images
        console.error('Error fetching banners for hero:', err);
      }
    };

    setIsLoaded(true);
    fetchBanners();

    return () => {
      mounted = false;
    };
  }, []);

  // Auto-advance when images change
  useEffect(() => {
    if (!images || images.length === 0) return;
    const id = setInterval(() => {
      setCurrentImage((prev) => (images.length ? (prev + 1) % images.length : prev));
    }, 5000);
    return () => clearInterval(id);
  }, [images]);

  // listen for cross-tab changes to hero_banners so admin uploads appear without manual refresh
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'hero_banners') {
        try {
          const raw = e.newValue;
          if (!raw) return;
          const stored = JSON.parse(raw) || [];
          const urls = stored
            .map((b: any) => (b && (b.image || b.imageUrl) ? (b.image || b.imageUrl) : null))
            .filter(Boolean)
            .map((u: string) => (u.startsWith('http') ? u : u));
          if (urls.length > 0) setImages(urls as string[]);
        } catch (err) {
          // ignore
        }
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const scrollToSection = (id: string) => {
    // If the user wants to go to the contact page, navigate there.
    if (id === 'contact') {
      if (typeof window !== 'undefined' && window.location.pathname === '/contact') {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      } else if (typeof window !== 'undefined') {
        window.location.href = '/contact';
      }
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else if (typeof window !== 'undefined') {
      // If element not found (e.g., on another page), navigate to home with hash.
      window.location.href = `/#${id}`;
    }
  };

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden">
      {/* Background Images with Ken Burns Effect */}
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ${
            index === currentImage ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
          }`}
        >
          <img
            src={img}
            alt={`Sri Lanka landscape ${index + 1}`}
            className="w-full h-full object-cover transition-transform duration-[10000ms] ease-out"
            style={{
              transform: index === currentImage ? 'scale(1.1)' : 'scale(1)'
            }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60"></div>
        </div>
      ))}

      {/* Animated Particles/Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
        <div className={`max-w-5xl transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Subtitle Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2 mb-6">
            <MapPin size={16} className="text-emerald-400" />
            <span className="text-sm font-medium">The Pearl of the Indian Ocean</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            <span className="inline-block animate-fade-in-up">Discover</span>{' '}
            <span className="inline-block animate-fade-in-up bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent" style={{ animationDelay: '0.2s' }}>
              Sri Lanka
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-2xl mb-10 text-gray-200 max-w-3xl mx-auto leading-relaxed" style={{ animationDelay: '0.4s' }}>
            Embark on an unforgettable journey through ancient temples, pristine beaches, 
            and lush tea plantations with <span className="font-semibold text-white">Sarkam Tours</span>
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-5 py-3">
              <Calendar size={20} className="text-emerald-400" />
              <span className="text-sm font-medium">Flexible Dates</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-5 py-3">
              <Users size={20} className="text-emerald-400" />
              <span className="text-sm font-medium">Expert Guides</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-5 py-3">
              <MapPin size={20} className="text-emerald-400" />
              <span className="text-sm font-medium">20+ Destinations</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => scrollToSection('tours')}
              className="group relative px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-full text-lg overflow-hidden transition-all transform hover:scale-105 shadow-2xl hover:shadow-emerald-500/50"
            >
              <span className="relative z-10">Explore Tours</span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </button>
            
            <button 
              onClick={() => scrollToSection('contact')}
              className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white font-bold rounded-full text-lg transition-all transform hover:scale-105 hover:bg-white/20 hover:border-white/50"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>

      {/* Image Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentImage 
                ? 'bg-white w-12 h-3' 
                : 'bg-white/40 w-3 h-3 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
}