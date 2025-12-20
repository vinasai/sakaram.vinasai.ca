import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Tours from './components/Tours';
import Gallery from './components/Gallery';
import Footer from './components/Footer';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import ServicePage from './pages/ServicePage';
import DealsPage from './pages/DealsPage';
import ExploreTour from './pages/ExploreTour';
import AdminApp from './admin/AdminApp';

function App() {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const isContactPath = pathname === '/contact';
  const isAboutPath = pathname === '/about';
  const isServicePath = pathname === '/services';
  const isDealsPath = pathname === '/deals';
  const isAdminPath = pathname.startsWith('/admin');
  const isTripPath = pathname.startsWith('/trip/');

  if (isAdminPath) {
    return <AdminApp />;
  }

  if (isTripPath) {
    return <ExploreTour />;
  }

  return (
    <div className="min-h-screen">
      {isContactPath ? (
        <ContactPage />
      ) : isAboutPath ? (
        <AboutPage />
      ) : isServicePath ? (
        <ServicePage />
      ) : isDealsPath ? (
        <DealsPage /> 
      ) : (
        <>
          <Header />
          <Hero />
          <About />
          <Tours />
          {/* <Services /> */}
          <Gallery />
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;