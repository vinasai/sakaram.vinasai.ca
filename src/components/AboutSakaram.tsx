import { CheckCircle, Star } from 'lucide-react';

export default function AboutSakaram() {
  const highlights = [
    'Ancient ruins & UNESCO World Heritage Sites',
    'Lush tea plantations in the highlands',
    'Pristine beaches & coastal paradise',
    'Abundant wildlife & safari experiences',
    'Vibrant culture & local traditions',
    'Adventure activities & water sports'
  ];

  const handleBookNow = () => {
    window.location.href = '/contact';
  };

  return (
    <div className="min-h-screen">
      {/* Main Hero Section - Image Left, Content Right */}
      <section className="relative min-h-screen flex items-center py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/4666748/pexels-photo-4666748.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Sri Lanka tea plantation background"
            className="w-full h-full object-cover"
          />
          {/* Light overlay for readability */}
          <div className="absolute inset-0 bg-white/90"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            {/* Left Side - Leopard Image */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Sri Lankan Leopard in natural habitat"
                  className="w-full h-[600px] lg:h-[700px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
              
              {/* Decorative Element */}
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-emerald-500 to-teal-600 w-32 h-32 rounded-3xl -z-10 opacity-20"></div>
              <div className="absolute -top-6 -left-6 bg-gradient-to-br from-emerald-500 to-teal-600 w-24 h-24 rounded-3xl -z-10 opacity-20"></div>
            </div>

            {/* Right Side - Content */}
            <div className="space-y-8">
              {/* Handwritten Style Header */}
              <div>
                <p className="text-emerald-600 font-['Brush_Script_MT',cursive] text-3xl mb-2">
                  Learn about us
                </p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                  Sakaram Tours: Your Gateway to Sri Lanka
                </h1>
              </div>

              {/* Main Content */}
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                <p>
                  Sakaram Tours is a Sri Lankan tour company with over <span className="font-semibold text-gray-800">10 years of experience</span> in the tourism industry. While specific details about Sakaram Tours were not readily available, Sri Lanka boasts a well-established and diverse tourism sector, and companies like Sakaram Tours play a vital role in showcasing the island's attractions.
                </p>

                <p>
                  With their experience, Sakaram Tours likely offers a range of services for tourists visiting Sri Lanka. These could include:
                </p>

                <div className="space-y-3">
                  <div className="flex items-start">
                    <CheckCircle size={20} className="text-emerald-600 mr-3 mt-1 flex-shrink-0" />
                    <p><span className="font-semibold text-gray-800">Tailor-made tour packages:</span> Designing customized itineraries to suit individual preferences, interests, and budgets. This might involve cultural tours, wildlife safaris, beach holidays, adventure activities, and more.</p>
                  </div>
                  
                  <div className="flex items-start">
                    <CheckCircle size={20} className="text-emerald-600 mr-3 mt-1 flex-shrink-0" />
                    <p><span className="font-semibold text-gray-800">Transportation:</span> Providing various transport options such as private vehicles with drivers, ensuring convenient and comfortable travel throughout the island.</p>
                  </div>
                  
                  <div className="flex items-start">
                    <CheckCircle size={20} className="text-emerald-600 mr-3 mt-1 flex-shrink-0" />
                    <p><span className="font-semibold text-gray-800">Accommodation arrangements:</span> Assisting with booking hotels, guesthouses, or other types of lodging based on the client's needs and preferences.</p>
                  </div>
                  
                  <div className="flex items-start">
                    <CheckCircle size={20} className="text-emerald-600 mr-3 mt-1 flex-shrink-0" />
                    <p><span className="font-semibold text-gray-800">Guided tours:</span> Employing knowledgeable local guides who can provide insights into Sri Lanka's history, culture, nature, and attractions.</p>
                  </div>
                  
                  <div className="flex items-start">
                    <CheckCircle size={20} className="text-emerald-600 mr-3 mt-1 flex-shrink-0" />
                    <p><span className="font-semibold text-gray-800">Activity bookings:</span> Arranging excursions and activities such as visiting historical sites, exploring national parks, engaging in water sports, and experiencing local traditions.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Continuation Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/3225531/pexels-photo-3225531.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Sri Lanka landscape background"
            className="w-full h-full object-cover"
          />
          {/* Light overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/92 via-white/88 to-white/92"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-xl p-8 md:p-12 border border-white/50">
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                <p>
                  Given Sri Lanka's rich offerings, a tour company with over a decade of experience would likely have established strong local connections and in-depth knowledge of the best destinations and experiences the country has to offer. They would be equipped to handle various aspects of travel, ensuring a smooth and memorable trip for their clients.
                </p>

                <p>
                  Sri Lanka itself is known for its diverse attractions, including ancient ruins, lush tea plantations, pristine beaches, abundant wildlife, and vibrant culture. Experienced tour operators like Sakaram Tours help visitors explore these facets of the island, contributing to the country's thriving tourism industry, which is a significant source of employment and foreign exchange earnings for Sri Lanka.
                </p>
              </div>

              {/* Highlights Grid */}
              <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-emerald-50/80 backdrop-blur-sm rounded-xl p-4 shadow-sm">
                    <Star size={20} className="text-emerald-600 flex-shrink-0" fill="#059669" />
                    <span className="text-gray-700 font-medium">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Sri Lanka beach background"
            className="w-full h-full object-cover"
          />
          {/* Light overlay */}
          <div className="absolute inset-0 bg-white/85"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Ready to Explore Sri Lanka?
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Let Sakaram Tours create your perfect Sri Lankan adventure. Contact us today to start planning your dream journey!
            </p>
            <button onClick={handleBookNow} className="group inline-flex items-center space-x-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold px-10 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <span>Book Now</span>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:translate-x-1 transition-transform">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}