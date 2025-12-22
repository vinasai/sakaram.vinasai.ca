import { Shield, Award, Heart, Users, MapPin, Clock } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function About() {
  const features = [
    {
      icon: Shield,
      title: 'Trusted & Safe',
      description: 'Your safety and security are our top priorities'
    },
    {
      icon: Award,
      title: 'Expert Guides',
      description: 'Professional local guides with years of experience'
    },
    {
      icon: Heart,
      title: 'Personalized Care',
      description: 'Tailored experiences just for you'
    },
    {
      icon: Users,
      title: 'Family-Friendly',
      description: 'Perfect for solo travelers and families alike'
    }
  ];

  const stats = [
    { number: 500, label: 'Happy Travelers', suffix: '+' },
    { number: 20, label: 'Destinations', suffix: '+' },
    { number: 10, label: 'Years Experience', suffix: '+' },
    { number: 98, label: 'Satisfaction Rate', suffix: '%' }
  ];

  return (
    <section id="about" className="relative py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden scroll-mt-28">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-100 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-100 rounded-full blur-3xl opacity-30 translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-700 rounded-full px-4 py-2 mb-4">

            <span className="text-sm font-semibold">About Us</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4">
            Echoes of <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Sakaram</span>
          </h2>
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-emerald-600 to-transparent rounded-full"></div>
            <div className="w-3 h-3 bg-emerald-600 rounded-full animate-pulse"></div>
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-teal-600 to-transparent rounded-full"></div>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mt-4">
            Your trusted partner in discovering the magical island of Sri Lanka
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto mb-20">
          {/* Text Content */}
          <div className="order-2 md:order-1 space-y-6">
            <div>
              <h3 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4 leading-tight">
                Trust Your Journey to Sri Lanka with{' '}
                <span className="text-emerald-600">Sakaram Tours</span>
              </h3>
              <div className="w-20 h-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full mb-6"></div>
            </div>

            <p className="text-gray-600 leading-relaxed text-lg">
              At Sakaram Tours, we believe that every journey should be more than just a trip—it should be an{' '}
              <span className="font-semibold text-gray-800">unforgettable experience</span>. With years of expertise in curating authentic Sri Lankan adventures, we pride ourselves on delivering personalized tours that capture the true essence of this beautiful island.
            </p>

            <p className="text-gray-600 leading-relaxed">
              From the misty highlands of Nuwara Eliya to the golden beaches of the southern coast, from ancient temples to vibrant local markets, we guide you through Sri Lanka's most treasured destinations. Our experienced team ensures your safety, comfort, and satisfaction at every step of your journey.
            </p>

            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-l-4 border-emerald-600 p-6 rounded-r-lg">
              <p className="text-gray-700 leading-relaxed italic">
                "Let us be your trusted companion as you explore the wonders of Sri Lanka. With Sakaram Tours, you're not just a tourist—<span className="font-semibold text-emerald-700">you're family</span>."
              </p>
            </div>
          </div>

          {/* Image with Decorative Elements */}
          <div className="order-1 md:order-2 relative">
            <div className="relative group">
              {/* Main Image */}
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Sri Lankan landscape"
                  className="w-full h-[500px] object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              {/* Decorative Frame */}
              <div className="absolute -inset-4 bg-gradient-to-br from-emerald-200 to-teal-200 rounded-2xl -z-10 opacity-50"></div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6 flex items-center space-x-4">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-xl">
                  <Clock className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">10+</p>
                  <p className="text-sm text-gray-600">Years Experience</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-emerald-200 hover:-translate-y-2"
            >
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="text-white" size={24} />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h4>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Stats Section with Animated Counter */}
        <AnimatedStats stats={stats} />
      </div>
    </section>
  );
}

// Animated Counter Component
function AnimatedStats({ stats }) {
  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={statsRef}
      className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl shadow-2xl p-12 max-w-6xl mx-auto"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
              <Counter
                end={stat.number}
                suffix={stat.suffix}
                duration={2000}
                start={isVisible}
              />
            </div>
            <div className="text-emerald-100 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Counter Component with Animation
function Counter({ end, suffix = '', duration = 2000, start }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - percentage, 4);
      const current = Math.floor(easeOutQuart * end);

      setCount(current);

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, start]);

  return (
    <>
      {count}
      {suffix}
    </>
  );
}