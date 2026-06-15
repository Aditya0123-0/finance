import { HashRouter, Route, Routes } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import AccountantsCPA from '../pages/AccountantsCPA.jsx';
import Contact from '../pages/Contact.jsx';
import Home from '../pages/Home.jsx';
import NotFound from '../pages/NotFound.jsx';
import PrivacyPolicy from '../pages/PrivacyPolicy.jsx';
import ReferEarn from '../pages/ReferEarn.jsx';
import ServiceDetails from '../pages/ServiceDetails.jsx';
import Services from '../pages/Services.jsx';
import Terms from '../pages/Terms.jsx';
import USBusinessTax from '../pages/USBusinessTax.jsx';
import USIndividualTax from '../pages/USIndividualTax.jsx';

// Auth Pages
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import ForgotPassword from '../pages/ForgotPassword.jsx';
import RefundStatus from '../pages/RefundStatus.jsx';

import ProtectedRoute from './ProtectedRoute.jsx';

function AppRoutes() {
  return (
    <HashRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:serviceSlug" element={<ServiceDetails />} />
          <Route path="/us-individual-tax" element={<USIndividualTax />} />
          <Route path="/us-business-tax" element={<USBusinessTax />} />
          <Route path="/accountants-cpa" element={<AccountantsCPA />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/refer-earn" element={<ReferEarn />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          
          {/* Auth System Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Portal & Lookup Routes */}
          <Route path="/refund-status" element={<RefundStatus />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </MainLayout>
    </HashRouter>
  );
}

export default AppRoutes;

