import { X, ZoomIn, Heart, Share2, Camera, Image, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchGallery, toMediaUrl } from '../api/client';
import LoadingState from './LoadingState';
import EmptyState from './EmptyState';

type ImageItem = { url: string; title: string; category?: string };

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadGallery = async () => {
      try {
        const res = await fetchGallery({ limit: 1000 });
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
      } finally {
        if (mounted) setLoading(false);
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

            <span className="text-sm font-semibold">Photo Gallery</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4">
            Captured <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Moments</span>
          </h2>
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-emerald-600 to-transparent rounded-full"></div>
            <div className="w-3 h-3 bg-emerald-600 rounded-full animate-pulse"></div>
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-teal-600 to-transparent rounded-full"></div>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Glimpses of the breathtaking beauty and unforgettable experiences that await you in Sri Lanka
          </p>
        </div>

        {loading ? (
          <LoadingState count={6} />
        ) : images.length === 0 ? (
          <EmptyState
            title="No Moments Captured"
            message="We haven't uploaded any photos to the gallery yet. Please check back later for glimpses of our beautiful destinations."
            icon={Image}
          />
        ) : (
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
        )}
      </div>

      {selectedImage !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm">
          {/* Top Bar - Counter */}
          <div className="absolute top-6 left-6 z-50">
            <span className="bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md border border-white/10">
              {selectedImage + 1} / {images.length}
            </span>
          </div>

          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors z-50 backdrop-blur-md border border-white/10 group"
          >
            <X size={24} className="text-white group-hover:rotate-90 transition-transform duration-300" />
          </button>

          {/* Navigation - Left */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateImage('prev');
            }}
            className="absolute left-6 bg-white/10 hover:bg-white/20 p-4 rounded-full transition-colors z-50 backdrop-blur-md border border-white/10 group top-1/2 -translate-y-1/2"
          >
            <svg className="w-6 h-6 text-white group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Navigation - Right */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateImage('next');
            }}
            className="absolute right-6 bg-white/10 hover:bg-white/20 p-4 rounded-full transition-colors z-50 backdrop-blur-md border border-white/10 group top-1/2 -translate-y-1/2"
          >
            <svg className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Main Image Container */}
          <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12" onClick={closeLightbox}>
            <div
              className="relative max-w-7xl max-h-[85vh] w-auto h-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[selectedImage].url}
                alt={images[selectedImage].title}
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              />

              {/* Bottom Details Overlay - Inside Image Area or Fixed at Bottom? Reference suggests overlay on image or just below. Sticking to flexible bottom bar for better mobile xp */}
            </div>
          </div>

          {/* Bottom Details Bar */}
          <div className="absolute bottom-0 left-0 right-0 p-8 z-50 bg-gradient-to-t from-black via-black/80 to-transparent">
            <div className="container mx-auto flex flex-col md:flex-row items-end justify-between gap-4">
              {/* Text Info */}
              <div className="text-left">
                <h3 className="text-white text-3xl font-bold mb-2">{images[selectedImage].title}</h3>
                <span className="bg-emerald-500/80 text-white px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm">
                  {images[selectedImage].category}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => toggleFavorite(selectedImage)}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/10 transition-colors group"
                >
                  <Heart
                    size={24}
                    className={`transition-colors ${favorites.has(selectedImage) ? 'fill-emerald-500 text-emerald-500' : 'text-white group-hover:text-emerald-500'}`}
                  />
                </button>
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = images[selectedImage].url;
                    link.download = `sakaram-gallery-${selectedImage}`;
                    link.target = '_blank';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/10 transition-colors group"
                >
                  <Download
                    size={24}
                    className="text-white group-hover:scale-110 transition-transform"
                  />
                </button>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: images[selectedImage].title,
                        text: `Check out this photo from Sakaram: ${images[selectedImage].title}`,
                        url: window.location.href
                      });
                    }
                  }}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/10 transition-colors group"
                >
                  <Share2 size={24} className="text-white group-hover:text-emerald-400 transition-colors" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
