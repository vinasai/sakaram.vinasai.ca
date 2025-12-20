import { Mail, Phone, Send, MessageCircle, MapPin, Clock } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+94',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Persist inquiry to localStorage so admin can view it
    try {
      const existing = localStorage.getItem('inquiries');
      const arr = existing ? JSON.parse(existing) : [];
      arr.unshift({ id: Date.now(), ...formData });
      localStorage.setItem('inquiries', JSON.stringify(arr));
      // reset
      setFormData({ name: '', email: '', phone: '', countryCode: '+94', message: '' });
      alert('Message sent — thank you!');
    } catch (err) {
      console.error('Failed to save inquiry', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="relative py-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Sri Lanka nature background"
          className="w-full h-full object-cover"
        />
        {/* Dark Overlay for better readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/70 to-black/75"></div>
      </div>

      {/* Animated Decorative Elements */}
      <div className="absolute top-20 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in-down">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full px-4 py-2 mb-4 shadow-lg">
            <MessageCircle size={16} className="animate-pulse" />
            <span className="text-sm font-semibold">Contact Us</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Let's Start Your <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">Adventure</span>
          </h2>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent rounded-full"></div>
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent rounded-full"></div>
          </div>
          <p className="text-gray-200 text-base max-w-xl mx-auto leading-relaxed">
            Ready to explore the Pearl of the Indian Ocean? Get in touch with us and let's plan your perfect journey together!
          </p>
        </div>

        {/* Main Content - Reduced Width */}
        <div className="max-w-2xl mx-auto">
          {/* Contact Form */}
          <div className="mb-8 animate-fade-in-up">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8 border border-white/50 transform hover:scale-[1.01] transition-all duration-500">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-1">Send us a Message</h3>
                <p className="text-gray-600 text-sm">Fill out the form and we'll get back to you shortly</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name and Email Row */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Name Field */}
                  <div className="transform transition-all duration-300 hover:translate-x-1">
                    <label htmlFor="name" className="block text-gray-700 font-semibold mb-1.5 text-sm">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all bg-white text-sm"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Email Field */}
                  <div className="transform transition-all duration-300 hover:translate-x-1">
                    <label htmlFor="email" className="block text-gray-700 font-semibold mb-1.5 text-sm">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all bg-white text-sm"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                {/* Phone Field */}
                <div className="transform transition-all duration-300 hover:translate-x-1">
                  <label htmlFor="phone" className="block text-gray-700 font-semibold mb-1.5 text-sm">
                    Phone Number *
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={formData.countryCode}
                      onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                      className="w-32 px-2 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all bg-white text-sm"
                    >
                      <option value="+93">🇦🇫 +93</option>
                      <option value="+355">🇦🇱 +355</option>
                      <option value="+213">🇩🇿 +213</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+61">🇦🇺 +61</option>
                      <option value="+43">🇦🇹 +43</option>
                      <option value="+880">🇧🇩 +880</option>
                      <option value="+32">🇧🇪 +32</option>
                      <option value="+55">🇧🇷 +55</option>
                      <option value="+1">🇨🇦 +1</option>
                      <option value="+86">🇨🇳 +86</option>
                      <option value="+45">🇩🇰 +45</option>
                      <option value="+20">🇪🇬 +20</option>
                      <option value="+358">🇫🇮 +358</option>
                      <option value="+33">🇫🇷 +33</option>
                      <option value="+49">🇩🇪 +49</option>
                      <option value="+30">🇬🇷 +30</option>
                      <option value="+852">🇭🇰 +852</option>
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+62">🇮🇩 +62</option>
                      <option value="+98">🇮🇷 +98</option>
                      <option value="+964">🇮🇶 +964</option>
                      <option value="+353">🇮🇪 +353</option>
                      <option value="+972">🇮🇱 +972</option>
                      <option value="+39">🇮🇹 +39</option>
                      <option value="+81">🇯🇵 +81</option>
                      <option value="+82">🇰🇷 +82</option>
                      <option value="+60">🇲🇾 +60</option>
                      <option value="+52">🇲🇽 +52</option>
                      <option value="+31">🇳🇱 +31</option>
                      <option value="+64">🇳🇿 +64</option>
                      <option value="+47">🇳🇴 +47</option>
                      <option value="+92">🇵🇰 +92</option>
                      <option value="+63">🇵🇭 +63</option>
                      <option value="+48">🇵🇱 +48</option>
                      <option value="+351">🇵🇹 +351</option>
                      <option value="+974">🇶🇦 +974</option>
                      <option value="+7">🇷🇺 +7</option>
                      <option value="+966">🇸🇦 +966</option>
                      <option value="+65">🇸🇬 +65</option>
                      <option value="+27">🇿🇦 +27</option>
                      <option value="+34">🇪🇸 +34</option>
                      <option value="+94">🇱🇰 +94</option>
                      <option value="+46">🇸🇪 +46</option>
                      <option value="+41">🇨🇭 +41</option>
                      <option value="+886">🇹🇼 +886</option>
                      <option value="+66">🇹🇭 +66</option>
                      <option value="+90">🇹🇷 +90</option>
                      <option value="+971">🇦🇪 +971</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+84">🇻🇳 +84</option>
                    </select>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="flex-1 px-3.5 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all bg-white text-sm"
                      placeholder="76 046 5855"
                    />
                  </div>
                </div>

                {/* Message Field */}
                <div className="transform transition-all duration-300 hover:translate-x-1">
                  <label htmlFor="message" className="block text-gray-700 font-semibold mb-1.5 text-sm">
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all bg-white resize-none text-sm"
                    placeholder="Tell us about your dream trip to Sri Lanka..."
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="group relative w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white font-bold py-3 rounded-lg transition-all duration-500 flex items-center justify-center space-x-2 shadow-xl hover:shadow-2xl hover:scale-[1.02] overflow-hidden"
                >
                  <span className="relative z-10">Send Message</span>
                  <Send size={18} className="relative z-10 transform group-hover:translate-x-2 group-hover:rotate-45 transition-all duration-500" />
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </button>
              </form>

              {/* Privacy Note */}
              <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-gray-500">
                <svg className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>We respect your privacy. Your information will never be shared.</span>
              </div>
            </div>
          </div>

          {/* Contact Information Cards - Below Form */}
          <div className="grid md:grid-cols-2 gap-4 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            {/* Phone Card */}
            <div className="group bg-white/90 backdrop-blur-md rounded-xl p-5 shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/50 hover:bg-white transform hover:-translate-y-2">
              <div className="flex items-start space-x-3">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                  <Phone size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 mb-1 text-base">Call Us</h4>
                  <a href="tel:+94760465855" className="text-gray-600 hover:text-emerald-600 transition-colors font-medium block text-sm">
                    +94 76 046 5855
                  </a>
                  <div className="flex items-center mt-1.5 text-xs text-gray-500">
                    <Clock size={12} className="mr-1" />
                    <span>Available 24/7</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Email Card */}
            <div className="group bg-white/90 backdrop-blur-md rounded-xl p-5 shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/50 hover:bg-white transform hover:-translate-y-2">
              <div className="flex items-start space-x-3">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                  <Mail size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 mb-1 text-base">Email Us</h4>
                  <a href="mailto:sakaramtours@gmail.com" className="text-gray-600 hover:text-emerald-600 transition-colors font-medium block break-all text-sm">
                    sakaramtours@gmail.com
                  </a>
                  <div className="flex items-center mt-1.5 text-xs text-gray-500">
                    <Clock size={12} className="mr-1" />
                    <span>Quick Response</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info Banner */}
          <div className="mt-6 bg-gradient-to-r from-emerald-600/90 via-teal-600/90 to-cyan-600/90 backdrop-blur-md rounded-xl p-4 shadow-xl border border-white/20 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center justify-center space-x-2 text-white">
              <MapPin size={18} className="animate-bounce" />
              <p className="text-center font-medium text-sm">
                Serving travelers across Sri Lanka with personalized tour experiences
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Animations */}
      <style>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
}