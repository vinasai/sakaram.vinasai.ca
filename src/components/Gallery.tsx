import { X, ZoomIn, Download, Heart, Share2, Camera } from 'lucide-react';
import { useState, useEffect } from 'react';

type ImageItem = { url: string; title: string; category?: string };

const defaultImages: ImageItem[] = [
  { url: 'https://images.pexels.com/photos/3573382/pexels-photo-3573382.jpeg?auto=compress&cs=tinysrgb&w=800', title: 'Tropical Paradise', category: 'Beaches' },
  { url: 'https://images.pexels.com/photos/3225531/pexels-photo-3225531.jpeg?auto=compress&cs=tinysrgb&w=800', title: 'Mountain Views', category: 'Nature' },
  { url: 'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=800', title: 'Tea Plantations', category: 'Landscapes' },
  { url: 'https://images.pexels.com/photos/11330271/pexels-photo-11330271.jpeg?auto=compress&cs=tinysrgb&w=800', title: 'Sigiriya Rock', category: 'Heritage' },
  { url: 'https://images.pexels.com/photos/2245436/pexels-photo-2245436.jpeg?auto=compress&cs=tinysrgb&w=800', title: 'Wildlife Safari', category: 'Wildlife' },
  { url: 'https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg?auto=compress&cs=tinysrgb&w=800', title: 'Coastal Beauty', category: 'Beaches' },
  { url: 'https://images.pexels.com/photos/4666748/pexels-photo-4666748.jpeg?auto=compress&cs=tinysrgb&w=800', title: 'Tea Gardens', category: 'Nature' },
  { url: 'https://images.pexels.com/photos/11179440/pexels-photo-11179440.jpeg?auto=compress&cs=tinysrgb&w=800', title: 'Galle Fort', category: 'Heritage' },
  { url: 'https://images.pexels.com/photos/14618756/pexels-photo-14618756.jpeg?auto=compress&cs=tinysrgb&w=800', title: 'Temple of Tooth', category: 'Culture' }
];

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [images, setImages] = useState<ImageItem[]>(defaultImages);

  // Load gallery from localStorage if present (admin-managed)
  useEffect(() => {
    try {
      const raw = localStorage.getItem('gallery');
      if (raw) {
        const stored = JSON.parse(raw);
        if (Array.isArray(stored)) {
          // normalize stored items to ImageItem shape
          const normalized = stored
            .map((s: any) => ({ url: s.image || s.url || '', title: s.title || s.name || 'Photo', category: s.category || '' }))
            .filter((i: ImageItem) => i.url);
          setImages(normalized);
          return;
        }
      }
    } catch (err) {
      console.warn('Failed to read gallery from localStorage', err);
    }
    setImages(defaultImages);
  }, []);

  // Listen for cross-tab updates
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'gallery' && e.newValue != null) {
        try {
          const stored = JSON.parse(e.newValue);
          if (Array.isArray(stored)) {
            const normalized = stored
              .map((s: any) => ({ url: s.image || s.url || '', title: s.title || s.name || 'Photo', category: s.category || '' }))
              .filter((i: ImageItem) => i.url);
            setImages(normalized);
          }
        } catch (err) {
          // ignore
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toggleFavorite = (index: number) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(index)) {
      newFavorites.delete(index);
    } else {
      newFavorites.add(index);
    }
    setFavorites(newFavorites);
  };

  const openLightbox = (index: number) => {
    setSelectedImage(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImage === null) return;
    
    if (direction === 'prev') {
      setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1);
    } else {
      setSelectedImage(selectedImage === images.length - 1 ? 0 : selectedImage + 1);
    }
  };

  return (
    <section id="gallery" className="relative py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-100 rounded-full blur-3xl opacity-20"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-700 rounded-full px-4 py-2 mb-4">
            <Camera size={16} />
            <span className="text-sm font-semibold">Photo Gallery</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4">
            Captured <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Moments</span>
          </h2>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-16 h-1 bg-emerald-600 rounded-full"></div>
            <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
            <div className="w-8 h-1 bg-emerald-600 rounded-full"></div>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Glimpses of the breathtaking beauty and unforgettable experiences that await you in Sri Lanka
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 max-w-7xl mx-auto space-y-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative break-inside-avoid group cursor-pointer mb-4"
              onClick={() => openLightbox(index)}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                  style={{ 
                    height: index % 3 === 0 ? '400px' : index % 2 === 0 ? '300px' : '350px'
                  }}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                
                {/* Hover Actions */}
                <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(index);
                    }}
                    className="bg-white/90 backdrop-blur-sm p-2.5 rounded-full hover:bg-white transition-colors shadow-lg"
                  >
                    <Heart 
                      size={18} 
                      className={favorites.has(index) ? 'fill-red-500 text-red-500' : 'text-gray-700'}
                    />
                  </button>
                  <button className="bg-white/90 backdrop-blur-sm p-2.5 rounded-full hover:bg-white transition-colors shadow-lg">
                    <Share2 size={18} className="text-gray-700" />
                  </button>
                </div>

                {/* Zoom Icon */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-75 group-hover:scale-100">
                  <div className="bg-white/90 backdrop-blur-sm p-4 rounded-full shadow-xl">
                    <ZoomIn size={28} className="text-emerald-600" />
                  </div>
                </div>

                {/* Image Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="text-white font-bold text-lg mb-1">{image.title}</h3>
                      <span className="inline-block bg-emerald-500/80 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {image.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 bg-white/10 backdrop-blur-sm hover:bg-white/20 p-3 rounded-full transition-colors z-50"
          >
            <X size={24} className="text-white" />
          </button>

          {/* Navigation Arrows */}
          <button
            onClick={() => navigateImage('prev')}
            className="absolute left-6 bg-white/10 backdrop-blur-sm hover:bg-white/20 p-4 rounded-full transition-colors z-50"
          >
            <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button
            onClick={() => navigateImage('next')}
            className="absolute right-6 bg-white/10 backdrop-blur-sm hover:bg-white/20 p-4 rounded-full transition-colors z-50"
          >
            <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>

          {/* Image */}
          <div className="max-w-6xl max-h-[90vh] relative">
            <img
              src={images[selectedImage].url}
              alt={images[selectedImage].title}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
            
            {/* Image Info Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
              <div className="flex items-center justify-between text-white">
                <div>
                  <h3 className="text-2xl font-bold mb-1">{images[selectedImage].title}</h3>
                  <span className="inline-block bg-emerald-500/80 text-white text-sm font-semibold px-3 py-1 rounded-full">
                    {images[selectedImage].category}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(selectedImage);
                    }}
                    className="bg-white/20 backdrop-blur-sm hover:bg-white/30 p-3 rounded-full transition-colors"
                  >
                    <Heart 
                      size={20} 
                      className={favorites.has(selectedImage) ? 'fill-red-500 text-red-500' : 'text-white'}
                    />
                  </button>
                  <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 p-3 rounded-full transition-colors">
                    <Download size={20} className="text-white" />
                  </button>
                  <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 p-3 rounded-full transition-colors">
                    <Share2 size={20} className="text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Image Counter */}
            <div className="absolute top-6 left-6 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold">
              {selectedImage + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}