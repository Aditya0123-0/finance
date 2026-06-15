import { FaWhatsapp } from 'react-icons/fa';
import { siteConfig } from '../../config/siteConfig.js';

function buildWhatsAppUrl(phone, message) {
  const number = String(phone || siteConfig.whatsappNumber || '').replace(/[^\d]/g, '');
  const text = encodeURIComponent(message || 'Hello TaxFiler Global, I need help with tax filing services.');
  return number ? `https://wa.me/${number}?text=${text}` : `https://wa.me/?text=${text}`;
}

function WhatsAppButton({
  phone,
  message,
  label = 'WhatsApp Us',
  variant = 'floating',
  className = '',
}) {
  const href = buildWhatsAppUrl(phone, message);
  const baseClasses =
    'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2';
  const variants = {
    floating:
      'fixed bottom-5 right-5 z-40 bg-green-600 px-5 py-3 text-white shadow-soft hover:bg-green-700',
    inline: 'bg-green-600 px-5 py-3 text-white hover:bg-green-700',
    compact: 'bg-green-600 p-3 text-white hover:bg-green-700',
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseClasses} ${variants[variant] || variants.inline} ${className}`}
      aria-label={label}
    >
      <FaWhatsapp className="h-5 w-5" aria-hidden="true" />
      {variant === 'compact' ? <span className="sr-only">{label}</span> : <span>{label}</span>}
    </a>
  );
}

export default WhatsAppButton;
