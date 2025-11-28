import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    // If clicking login, open admin panel in new tab
    if (id === 'login') {
      if (typeof window !== 'undefined') {
        // If an external admin URL is configured, open it in a new tab.
        // Otherwise open the internal admin login in a new tab as well.
        const adminUrl = (import.meta.env.VITE_ADMIN_PANEL_URL as string) || '';
        if (adminUrl && (adminUrl.startsWith('http://') || adminUrl.startsWith('https://'))) {
          window.open(adminUrl, '_blank');
        } else {
          // open the local admin login route within this app in a new tab
          window.open('/admin/login', '_blank');
        }
      }
      setIsMenuOpen(false);
      return;
    }

    // If clicking deals, navigate to the deals page
    if (id === 'deals') {
      if (typeof window !== 'undefined') {
        window.location.href = '/deals';
      }
      setIsMenuOpen(false);
      return;
    }

    // If navigating to the Contact or About or Services page, route to that page.
    if (id === 'contact' || id === 'about' || id === 'services') {
      const targetPath = `/${id}`;
      // If already on the target path, just scroll to the section.
      if (typeof window !== 'undefined' && window.location.pathname === targetPath) {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      } else if (typeof window !== 'undefined') {
        // Navigate to the page (full load). The dev server and typical SPA hosting should
        // serve index.html for this route.
        window.location.href = targetPath;
      }
      setIsMenuOpen(false);
      return;
    }

    // For other sections: if the section exists on the current page, scroll to it.
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
      return;
    }

    // If the element isn't present (for example, we're on /contact), navigate to the home
    // route with a hash so the browser will open the home and jump to the section.
    if (typeof window !== 'undefined') {
      // Use absolute path with hash to ensure navigation from any route.
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
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact' },
    { id: 'login', label: 'Login' }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-lg shadow-lg'
          : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <nav className="container mx-auto px-5 py-1">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => scrollToSection('home')}>
            <img 
              src="/src/pics/sarkam.png" 
              alt="Sarkam Tours Logo" 
              className="h-16 w-auto"
            />
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className="relative px-4 py-2 text-gray-700 font-medium transition-all duration-300 hover:text-emerald-600 group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 group-hover:w-full"></span>
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => scrollToSection('contact')}
                className="ml-4 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Book Now
              </button>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden relative w-10 h-10 flex items-center justify-center text-gray-700 hover:text-emerald-600 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-6">
              <span
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                  isMenuOpen ? 'opacity-0 rotate-180' : 'opacity-100 rotate-0'
                }`}
              >
                <Menu size={24} />
              </span>
              <span
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                  isMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 rotate-180'
                }`}
              >
                <X size={24} />
              </span>
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-[500px] opacity-100 mt-6' : 'max-h-0 opacity-0'
          }`}
        >
          <ul className="space-y-2 pb-4">
            {navItems.map((item, index) => (
              <li
                key={item.id}
                className={`transform transition-all duration-300 ${
                  isMenuOpen
                    ? 'translate-x-0 opacity-100'
                    : '-translate-x-4 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <button
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left px-4 py-3 text-gray-700 font-medium hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200"
                >
                  {item.label}
                </button>
              </li>
            ))}
            <li
              className={`transform transition-all duration-300 ${
                isMenuOpen
                  ? 'translate-x-0 opacity-100'
                  : '-translate-x-4 opacity-0'
              }`}
              style={{ transitionDelay: `${navItems.length * 50}ms` }}
            >
              <button
                onClick={() => scrollToSection('contact')}
                className="block w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 text-center"
              >
                Book Now
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}