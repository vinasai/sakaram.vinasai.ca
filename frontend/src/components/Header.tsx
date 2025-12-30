import { Menu, X, Phone, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import sakaramLogo from '../pics/sarkam.png';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState('home');
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update active item based on current route
  useEffect(() => {
    const path = location.pathname;
    const hash = location.hash;

    if (path === '/') {
      if (hash) {
        const section = hash.substring(1); // Remove '#'
        if (['tours', 'deals', 'about', 'services', 'contact'].includes(section)) {
          setActiveItem(section);
          // Scroll to section after a brief delay to ensure DOM is ready
          setTimeout(() => {
            const element = document.getElementById(section);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        } else {
          setActiveItem('home');
        }
      } else {
        setActiveItem('home');
      }
    } else {
      // Remove leading slash and check against known IDs
      const section = path.substring(1);
      if (['tours', 'deals', 'about', 'services', 'contact'].includes(section)) {
        setActiveItem(section);
        // Scroll to top when landing on these pages
        window.scrollTo(0, 0);
      } else {
        setActiveItem('');
      }
    }
  }, [location.pathname, location.hash]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const scrollToSection = (id: string) => {
    setActiveItem(id);

    if (id === 'login') {
      if (typeof window !== 'undefined') {
        const adminUrl = (import.meta.env.VITE_ADMIN_PANEL_URL as string) || '';
        if (adminUrl && (adminUrl.startsWith('http://') || adminUrl.startsWith('https://'))) {
          window.open(adminUrl, '_blank');
        } else {
          window.open('/admin/login', '_blank');
        }
      }
      setIsMenuOpen(false);
      return;
    }

    if (id === 'deals') {
      if (typeof window !== 'undefined') {
        window.location.href = '/deals';
      }
      setIsMenuOpen(false);
      return;
    }

    if (id === 'contact' || id === 'about' || id === 'services') {
      const targetPath = `/${id}`;
      if (typeof window !== 'undefined' && window.location.pathname === targetPath) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (typeof window !== 'undefined') {
        window.location.href = targetPath;
      }
      setIsMenuOpen(false);
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
      return;
    }

    if (typeof window !== 'undefined') {
      window.location.href = `/#${id}`;
    }
    setIsMenuOpen(false);
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'tours', label: 'Tours' },
    { id: 'deals', label: 'Deals' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-white shadow-lg shadow-gray-200/50'
          : 'bg-white/95 backdrop-blur-sm'
          }`}
      >
        {/* Top Bar - Optional promotional strip */}
        <div className={`bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm transition-all duration-300 ${isScrolled ? 'h-0 overflow-hidden opacity-0' : 'py-2'
          }`}>
          <div className="container mx-auto px-6 flex items-center justify-center gap-6">
            <span className="flex items-center gap-2">
              <Phone size={14} />
              <span>+94 76 046 5855</span>
            </span>
            <span className="hidden sm:block text-emerald-200">|</span>
            <span className="hidden sm:block">Discover Sri Lanka with Local Experts</span>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="container mx-auto px-12">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Logo */}
            <div
              className="flex items-center cursor-pointer group"
              onClick={() => scrollToSection('home')}
            >
              <div className="relative">
                <img
                  src={sakaramLogo}
                  alt="Sakaram Tours Logo"
                  className="h-12 lg:h-14 w-auto transition-transform group-hover:scale-105"
                />
              </div>
            </div>

            {/* Desktop Navigation - Centered */}
            <div className="hidden lg:flex items-center">
              <div className="flex items-center bg-gray-50 rounded-full px-2 py-1.5">
                {navItems.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`relative px-5 py-2 text-sm font-medium rounded-full transition-all duration-200 ${activeItem === item.id
                      ? 'bg-white text-emerald-600 shadow-sm'
                      : 'text-gray-600 hover:text-emerald-600 hover:bg-white/50'
                      }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Section - CTA */}
            <div className="hidden lg:flex items-center gap-4">
              <button
                onClick={() => scrollToSection('contact')}
                className="group flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-emerald-200 transition-all"
              >
                Book Now
                <ChevronRight size={18} className="transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden relative w-12 h-12 flex items-center justify-center rounded-full bg-gray-50 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white z-50 lg:hidden shadow-2xl transition-transform duration-300 ease-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <img
            src={sakaramLogo}
            alt="Sakaram Tours Logo"
            className="h-10 w-auto"
          />
          <button
            onClick={() => setIsMenuOpen(false)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Mobile Menu Content */}
        <div className="flex flex-col h-[calc(100%-80px)]">
          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-6 px-4">
            <ul className="space-y-1">
              {navItems.map((item, index) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className={`flex items-center justify-between w-full px-4 py-3.5 rounded-xl font-medium transition-all ${activeItem === item.id
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    <span className="text-[15px]">{item.label}</span>
                    <ChevronRight size={18} className={`transition-colors ${activeItem === item.id ? 'text-emerald-400' : 'text-gray-300'
                      }`} />
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile Menu Footer */}
          <div className="p-5 border-t border-gray-100 space-y-4 bg-gray-50/50">
            {/* Contact Info */}
            <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <Phone size={18} className="text-emerald-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Call us anytime</div>
                <div className="font-semibold text-gray-900">+94 76 046 5855</div>
              </div>
            </div>

            {/* Book Now Button */}
            <button
              onClick={() => scrollToSection('contact')}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              Book Your Adventure
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>


    </>
  );
}