import { Link } from 'react-router-dom';
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';
import { ROUTES } from '../../constants/routes.js';
import { siteConfig } from '../../config/siteConfig.js';
import { SERVICE_CATEGORIES } from '../../constants/serviceCategories.js';

function Footer({
  companyName = siteConfig.name,
  description = siteConfig.description,
  serviceCategories = SERVICE_CATEGORIES,
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-navy text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <h2 className="text-xl font-bold">{companyName}</h2>
          <p className="mt-4 text-sm leading-7 text-blue-100">{description}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase text-brand-gold">Services</h3>
          <ul className="mt-4 space-y-3 text-sm text-blue-100">
            {serviceCategories.map((category) => (
              <li key={category.id}>
                <Link to={`${ROUTES.SERVICES}?category=${category.id}`} className="hover:text-brand-gold">
                  {category.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase text-brand-gold">Useful Links</h3>
          <ul className="mt-4 space-y-3 text-sm text-blue-100">
            <li><Link to={ROUTES.REFUND_STATUS} className="hover:text-brand-gold">Refund Status</Link></li>
            <li><Link to={ROUTES.REFER_EARN} className="hover:text-brand-gold">Refer & Earn</Link></li>
            <li><Link to={ROUTES.PRIVACY_POLICY} className="hover:text-brand-gold">Privacy Policy</Link></li>
            <li><Link to={ROUTES.TERMS} className="hover:text-brand-gold">Terms</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase text-brand-gold">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm text-blue-100">
            {siteConfig.phone ? (
              <li className="flex gap-3">
                <FaPhoneAlt className="mt-1 h-4 w-4 text-brand-gold" aria-hidden="true" />
                <a href={`tel:${siteConfig.phone}`} className="hover:text-brand-gold">{siteConfig.phone}</a>
              </li>
            ) : null}
            {siteConfig.email ? (
              <li className="flex gap-3">
                <FaEnvelope className="mt-1 h-4 w-4 text-brand-gold" aria-hidden="true" />
                <a href={`mailto:${siteConfig.email}`} className="hover:text-brand-gold">{siteConfig.email}</a>
              </li>
            ) : null}
            <li className="flex gap-3">
              <FaMapMarkerAlt className="mt-1 h-4 w-4 text-brand-gold" aria-hidden="true" />
              <span>Serving clients globally</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-sm text-blue-100">
        <p>&copy; {year} {companyName}. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
