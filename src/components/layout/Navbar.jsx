import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaBars, FaChevronDown, FaPhoneAlt, FaTimes } from 'react-icons/fa';
import { navigationItems } from '../../data/navigation.js';
import { ROUTES } from '../../constants/routes.js';
import { SERVICE_CATEGORIES } from '../../constants/serviceCategories.js';
import { siteConfig } from '../../config/siteConfig.js';
import WhatsAppButton from '../common/WhatsAppButton.jsx';
import { useAuth } from '../../hooks/useAuth.js';

function Navbar({
  logoText = siteConfig.name,
  items = navigationItems,
  serviceCategories = SERVICE_CATEGORIES,
  showQuickActions = true,
}) {
  const { currentUser, userProfile, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `rounded-md px-3 py-2 text-sm font-semibold transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-brand-gold ${
      isActive ? 'text-brand-gold' : 'text-white'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-brand-navy text-white shadow-soft">
      {showQuickActions ? (
        <div className="border-b border-white/10 bg-brand-blue">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 text-sm sm:px-6 lg:px-8">
            <p className="hidden text-blue-100 sm:block">Available 24/7. All emails answered within 12 hours.</p>
            <div className="ml-auto flex items-center gap-3">
              {siteConfig.phone ? (
                <a href={`tel:${siteConfig.phone}`} className="inline-flex items-center gap-2 hover:text-brand-gold">
                  <FaPhoneAlt className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{siteConfig.phone}</span>
                </a>
              ) : null}
              <WhatsAppButton variant="compact" label="Connect on WhatsApp" />
            </div>
          </div>
        </div>
      ) : null}

      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex min-h-16 items-center justify-between gap-4">
          <Link to={ROUTES.HOME} className="text-xl font-bold focus:outline-none focus:ring-2 focus:ring-brand-gold">
            {logoText}
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {items.map((item) => {
              if (item.label === 'Services') {
                return (
                  <div 
                    key={item.label} 
                    className="relative"
                    onMouseEnter={() => setServicesOpen(true)}
                    onMouseLeave={() => setServicesOpen(false)}
                  >
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                      aria-expanded={servicesOpen}
                      aria-haspopup="true"
                    >
                      Services
                      <FaChevronDown className="h-3 w-3" aria-hidden="true" />
                    </button>
                    {servicesOpen ? (
                      <div className="absolute left-0 mt-3 w-72 rounded-lg bg-white p-2 text-brand-ink shadow-soft">
                        <NavLink to={ROUTES.SERVICES} className="block rounded-md px-3 py-2 text-sm font-semibold hover:bg-brand-surface">
                          All Services
                        </NavLink>
                        {serviceCategories.map((category) => (
                          <NavLink
                            key={category.id}
                            to={`${ROUTES.SERVICES}?category=${category.id}`}
                            className="block rounded-md px-3 py-2 text-sm text-brand-muted hover:bg-brand-surface hover:text-brand-navy"
                          >
                            {category.label}
                          </NavLink>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              }

              return (
                <NavLink key={item.href} to={item.href} className={navLinkClass}>
                  {item.label}
                </NavLink>
              );
            })}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden items-center gap-4 lg:flex">
            {currentUser ? (
              <div className="flex items-center gap-4">
                <Link
                  to={ROUTES.REFUND_STATUS}
                  className="text-sm font-semibold text-slate-200 hover:text-brand-gold transition-colors"
                >
                  Refund Tracker
                </Link>
                <span className="text-sm text-brand-gold font-bold">
                  Hi, {userProfile?.displayName || currentUser.displayName || 'Client'}
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to={ROUTES.LOGIN}
                  className="text-sm font-semibold text-white hover:text-brand-gold transition"
                >
                  Sign In
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  className="rounded-full bg-brand-gold px-4 py-2 text-sm font-bold text-brand-ink transition hover:bg-amber-400"
                >
                  Register
                </Link>
              </div>
            )}
            <WhatsAppButton variant="inline" label="Lets Connect" />
          </div>

          <button
            type="button"
            className="inline-flex rounded-md p-2 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-brand-gold lg:hidden"
            onClick={() => setIsOpen((value) => !value)}
            aria-expanded={isOpen}
            aria-label="Toggle navigation"
          >
            {isOpen ? <FaTimes aria-hidden="true" /> : <FaBars aria-hidden="true" />}
          </button>
        </div>

        {isOpen ? (
          <div className="border-t border-white/10 py-4 lg:hidden">
            <div className="flex flex-col gap-1">
              {items.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={navLinkClass}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}

              {/* Mobile Auth Section */}
              <div className="border-t border-white/10 my-2 pt-2 flex flex-col gap-2">
                {currentUser ? (
                  <>
                    <Link
                      to={ROUTES.REFUND_STATUS}
                      className="block rounded-md px-3 py-2 text-base font-semibold text-slate-200 hover:bg-white/10"
                      onClick={() => setIsOpen(false)}
                    >
                      Refund Tracker
                    </Link>
                    <div className="px-3 py-2 text-sm text-brand-gold font-bold">
                      Hi, {userProfile?.displayName || currentUser.displayName || 'Client'}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="w-full text-left rounded-md px-3 py-2 text-base font-semibold text-white hover:bg-white/10"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to={ROUTES.LOGIN}
                      className="block rounded-md px-3 py-2 text-base font-semibold text-white hover:bg-white/10"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to={ROUTES.REGISTER}
                      className="block text-center rounded-full bg-brand-gold px-4 py-2.5 text-base font-bold text-brand-ink hover:bg-amber-400"
                      onClick={() => setIsOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>

              <WhatsAppButton variant="inline" label="Lets Connect" className="mt-1" />
            </div>
          </div>
        ) : null}
      </nav>
    </header>
  );
}

export default Navbar;

