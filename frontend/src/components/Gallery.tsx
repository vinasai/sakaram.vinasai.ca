import { X, ZoomIn, Heart, Share2, Camera } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchGallery, toMediaUrl } from '../api/client';

type ImageItem = { url: string; title: string; category?: string };

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [images, setImages] = useState<ImageItem[]>([]);

  useEffect(() => {
    let mounted = true;

    const loadGallery = async () => {
      try {
        const res = await fetchGallery();
        const normalized = (res.items || [])
          .map((s: any) => ({
            url: toMediaUrl(s.imageUrl),
            title: s.title || 'Photo',
            category: s.category || '',
          }))
          .filter((i: ImageItem) => i.url);

        if (mounted) setImages(normalized);
      } catch (err) {
        console.warn('Failed to load gallery', err);
      }
    };

    loadGallery();

    return () => {
      mounted = false;
    };
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
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-100 rounded-full blur-3xl opacity-20"></div>

      <div className="container mx-auto px-4 relative z-10">
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

        {images.length === 0 && (
          <div className="bg-white rounded-2xl border border-emerald-100 p-10 text-center text-gray-600">
            No gallery photos yet. Please check back later.
          </div>
        )}

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
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                
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

                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-75 group-hover:scale-100">
                  <div className="bg-white/90 backdrop-blur-sm p-4 rounded-full shadow-xl">
                    <ZoomIn size={28} className="text-emerald-600" />
                  </div>
                </div>

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

      {selectedImage !== null && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 bg-white/10 backdrop-blur-sm hover:bg-white/20 p-3 rounded-full transition-colors z-50"
          >
            <X size={24} className="text-white" />
          </button>

          <button
            onClick={() => navigateImage('prev')}
            className="absolute left-6 bg-white/10 backdrop-blur-sm hover:bg-white/20 p-4 rounded-full transition-colors z-50"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={() => navigateImage('next')}
            className="absolute right-6 bg-white/10 backdrop-blur-sm hover:bg-white/20 p-4 rounded-full transition-colors z-50"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="relative max-w-4xl max-h-[80vh]">
            <img
              src={images[selectedImage].url}
              alt={images[selectedImage].title}
              className="max-w-full max-h-[80vh] object-contain"
            />

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <h3 className="text-white text-xl font-bold mb-2">{images[selectedImage].title}</h3>
              <p className="text-white/80">{images[selectedImage].category}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
