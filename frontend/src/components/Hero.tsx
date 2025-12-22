import { useState, useEffect } from 'react';
import { MapPin, Calendar, Users } from 'lucide-react';
import { fetchHeroBanners, toMediaUrl } from '../api/client';

export default function Hero() {
  const [currentImage, setCurrentImage] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;

    const fetchBanners = async () => {
      try {
        const res = await fetchHeroBanners(false);
        const banners = res.items || [];
        const urls = banners
          .map((b: any) => (b && b.imageUrl ? toMediaUrl(b.imageUrl) : null))
          .filter(Boolean) as string[];

        if (mounted && urls.length > 0) {
          setImages(urls);
        }
      } catch (err) {
        console.error('Error fetching banners for hero:', err);
      }
    };

    setIsLoaded(true);
    fetchBanners();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!images || images.length === 0) return;
    const id = setInterval(() => {
      setCurrentImage((prev) => (images.length ? (prev + 1) % images.length : prev));
    }, 5000);
    return () => clearInterval(id);
  }, [images]);

  const scrollToSection = (id: string) => {
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
      window.location.href = `/#${id}`;
    }
  };

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden py-20 scroll-mt-28">
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ${index === currentImage ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
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
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60"></div>
        </div>
      ))}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute  left-10 w-72 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
        <div className={`max-w-5xl transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2 mb-6">
            <MapPin size={16} className="text-emerald-400" />
            <span className="text-sm font-medium">The Pearl of the Indian Ocean</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            <span className="inline-block animate-fade-in-up">Discover</span>{' '}
            <span className="inline-block animate-fade-in-up bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent" style={{ animationDelay: '0.2s' }}>
              Sri Lanka
            </span>
          </h1>

          <p className="text-lg md:text-2xl mb-10 text-gray-200 max-w-3xl mx-auto leading-relaxed" style={{ animationDelay: '0.4s' }}>
            Embark on an unforgettable journey through ancient temples, pristine beaches,
            and lush tea plantations with <span className="font-semibold text-white">Sarkam Tours</span>
          </p>

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

      {images.length > 0 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentImage ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
                }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
