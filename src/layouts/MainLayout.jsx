import Footer from '../components/layout/Footer.jsx';
import Navbar from '../components/layout/Navbar.jsx';
import WhatsAppButton from '../components/common/WhatsAppButton.jsx';
import { useScrollTop } from '../hooks/useScrollTop.js';

function MainLayout({ children }) {
  useScrollTop();
  return (
    <div className="min-h-screen bg-brand-surface text-brand-ink">
      <Navbar />
      {children}
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

export default MainLayout;
