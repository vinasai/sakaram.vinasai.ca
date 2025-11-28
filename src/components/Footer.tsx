import { Facebook, Instagram, Twitter, Mail, Phone, ArrowRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (id: string) => {
    // If the target is contact, navigate to /contact (or scroll if already there)
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
    }
  };

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="/src/pics/sarkam.png" 
                alt="Sarkam Tours Logo" 
                className="h-14 w-auto"
              />
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your trusted partner for unforgettable Sri Lankan adventures. Discover the magic of the Pearl of the Indian Ocean with us.
            </p>
            
            {/* Social Media */}
            <div className="flex space-x-3">
              <a
                href="https://web.facebook.com/profile.php?id=61574883698199"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-gray-800 hover:bg-gradient-to-br hover:from-emerald-500 hover:to-teal-600 p-3 rounded-full transition-all duration-300 hover:scale-110"
              >
                <Facebook size={18} className="text-gray-400 group-hover:text-white transition-colors" />
              </a>
              <a
                href="https://www.instagram.com/sakaramtours/"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-gray-800 hover:bg-gradient-to-br hover:from-emerald-500 hover:to-teal-600 p-3 rounded-full transition-all duration-300 hover:scale-110"
              >
                <Instagram size={18} className="text-gray-400 group-hover:text-white transition-colors" />
              </a>
              <a
                href="https://www.youtube.com/@SakaramTours"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-gray-800 hover:bg-gradient-to-br hover:from-emerald-500 hover:to-teal-600 p-3 rounded-full transition-all duration-300 hover:scale-110"
              >
                <Twitter size={18} className="text-gray-400 group-hover:text-white transition-colors" />
              </a>
              <a
                href="mailto:sakaramtours@gmail.com"
                className="group bg-gray-800 hover:bg-gradient-to-br hover:from-emerald-500 hover:to-teal-600 p-3 rounded-full transition-all duration-300 hover:scale-110"
              >
                <Mail size={18} className="text-gray-400 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center">
              <span className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full mr-3"></span>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {['home', 'tours', 'about', 'gallery', 'contact'].map((link) => (
                <li key={link}>
                  <button
                    onClick={() => scrollToSection(link)}
                    className="group flex items-center text-gray-400 hover:text-emerald-400 transition-colors"
                  >
                    <ArrowRight size={16} className="mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
                    <span className="capitalize">{link}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Tours */}
          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center">
              <span className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full mr-3"></span>
              Popular Tours
            </h4>
            <ul className="space-y-3">
              {[
                'Sigiriya Rock Fortress',
                'Kandy Temple Tour',
                'Yala Safari',
                'Tea Plantation Tour',
                'Galle Fort',
                'Mirissa Beach'
              ].map((tour, index) => (
                <li key={index} className="group flex items-start text-gray-400 hover:text-emerald-400 transition-colors cursor-pointer">
                  <span className="text-emerald-500 mr-2 text-xs mt-1">▸</span>
                  <span className="text-sm">{tour}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center">
              <span className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full mr-3"></span>
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-center group">
                <Phone size={18} className="text-emerald-500 mr-3 flex-shrink-0" />
                <div className="text-gray-400 text-sm">
                  <a href="tel:+94760465855" className="hover:text-emerald-400 transition-colors">
                    +94 76 046 5855
                  </a>
                </div>
              </li>
              <li className="flex items-center group">
                <Mail size={18} className="text-emerald-500 mr-3 flex-shrink-0" />
                <div className="text-gray-400 text-sm">
                  <a href="mailto:sakaramtours@gmail.com" className="hover:text-emerald-400 transition-colors">
                    sakaramtours@gmail.com
                  </a>
                </div>
              </li>
            </ul>

            {/* Newsletter Signup */}
            {/* <div className="mt-6">
              <p className="text-sm text-gray-400 mb-3">Subscribe to our newsletter</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-emerald-500 text-sm text-white placeholder-gray-500"
                />
                <button className="bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 rounded-r-lg hover:from-emerald-700 hover:to-teal-700 transition-all">
                  <ArrowRight size={18} />
                </button>
              </div>
            </div> */}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm flex items-center">
              &copy; {currentYear} Sarkam Tours. All rights reserved.
            </p>
            
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}