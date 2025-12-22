import { useLocation } from 'react-router-dom';
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
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';

function App() {
  const location = useLocation();
  const pathname = location.pathname;

  const isContactPath = pathname === '/contact';
  const isAboutPath = pathname === '/about';
  const isServicePath = pathname === '/services';
  const isDealsPath = pathname === '/deals';
  const isAdminPath = pathname.startsWith('/admin');
  const isTripPath = pathname.startsWith('/trip/');
  const isPrivacyPath = pathname === '/privacy-policy';
  const isTermsPath = pathname === '/terms-of-service';

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
      ) : isPrivacyPath ? (
        <PrivacyPolicy />
      ) : isTermsPath ? (
        <TermsOfService />
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