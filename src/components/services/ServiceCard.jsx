import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

function ServiceCard({
  title,
  description,
  href,
  icon,
  image,
  imageAlt,
  category,
  features = [],
  ctaLabel = 'View Details',
}) {
  const imageAltText = imageAlt || (title ? `${title} image` : 'Service image');

  const content = (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-lg">
      {image ? <img src={image} alt={imageAltText} className="h-44 w-full object-cover" /> : null}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex items-center gap-3">
          {icon ? <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-brand-surface text-brand-navy">{icon}</span> : null}
          {category ? <span className="text-xs font-semibold uppercase text-brand-gold">{category}</span> : null}
        </div>
        <h3 className="text-xl font-bold text-brand-navy">{title}</h3>
        {description ? <p className="mt-3 flex-1 text-sm leading-7 text-brand-muted">{description}</p> : null}
        {features.length > 0 ? (
          <ul className="mt-4 space-y-2 text-sm text-brand-muted">
            {features.slice(0, 3).map((feature, index) => (
              <li key={`${feature}-${index}`} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-gold" aria-hidden="true" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        ) : null}
        {href ? (
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-navy">
            {ctaLabel}
            <FaArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        ) : null}
      </div>
    </article>
  );

  if (!href) {
    return content;
  }

  return (
    <Link to={href} className="block h-full focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2">
      {content}
    </Link>
  );
}

export default ServiceCard;
