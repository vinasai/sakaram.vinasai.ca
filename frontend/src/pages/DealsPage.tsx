import Header from '../components/Header';
import Footer from '../components/Footer';
import Deals from '../components/Deals';

export default function DealsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <Deals />
      </main>
      <Footer />
    </div>
  );
}