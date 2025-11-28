import { MapPin, Users, Shield, Globe, Calendar, Heart } from 'lucide-react';

export default function Services() {
  const services = [
    {
      icon: MapPin,
      title: 'Tailor-made Tour Packages',
      description: 'Designing customized itineraries to suit individual preferences, interests, and budgets including cultural tours, wildlife safaris, beach holidays, and adventure activities.'
    },
    {
      icon: Users,
      title: 'Expert Transportation',
      description: 'Private vehicles with experienced drivers ensuring convenient and comfortable travel throughout the island with complete safety.'
    },
    {
      icon: Shield,
      title: 'Accommodation Arrangements',
      description: 'Assisting with booking hotels, guesthouses, or other types of lodging based on your needs and preferences.'
    },
    {
      icon: Globe,
      title: 'Guided Tours',
      description: 'Knowledgeable local guides providing insights into Sri Lanka\'s history, culture, nature, and attractions.'
    },
    {
      icon: Calendar,
      title: 'Activity Bookings',
      description: 'Arranging excursions such as visiting historical sites, exploring national parks, water sports, and experiencing local traditions.'
    },
    {
      icon: Heart,
      title: 'Personalized Service',
      description: 'Dedicated support throughout your journey ensuring a smooth and memorable trip tailored to your desires.'
    }
  ];

  return (
    <section id="services" className="relative py-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/3225531/pexels-photo-3225531.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Sri Lanka nature background"
          className="w-full h-full object-cover"
        />
        {/* Overlay for better readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/90 to-white/95"></div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-emerald-50/80 backdrop-blur-sm text-emerald-700 rounded-full px-4 py-2 mb-4">
              <Shield size={16} />
              <span className="text-sm font-semibold">What We Offer</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4">
              Our <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Services</span>
            </h2>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-16 h-1 bg-emerald-600 rounded-full"></div>
              <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
              <div className="w-8 h-1 bg-emerald-600 rounded-full"></div>
            </div>
            <p className="text-gray-700 text-lg max-w-2xl mx-auto font-medium">
              Comprehensive tourism solutions for an unforgettable Sri Lankan experience
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/50 hover:border-emerald-200 hover:-translate-y-2"
              >
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <service.icon className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}