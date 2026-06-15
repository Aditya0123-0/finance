import { FaRegStar, FaStar } from 'react-icons/fa';

function TestimonialCard({
  clientName,
  clientRole,
  clientLocation,
  message,
  rating = 5,
  image,
  imageAlt,
}) {
  const stars = Array.from({ length: 5 }, (_, index) => index < rating);

  return (
    <article className="h-full rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
      <div className="flex gap-1" aria-label={`${rating} out of 5 star rating`}>
        {stars.map((active, index) => (
          <span key={`${clientName}-${index}`} className={active ? 'text-brand-gold' : 'text-slate-300'} aria-hidden="true">
            {active ? <FaStar className="h-4 w-4" /> : <FaRegStar className="h-4 w-4" />}
          </span>
        ))}
      </div>
      <p className="mt-4 text-sm leading-7 text-brand-muted">"{message}"</p>
      <div className="mt-6 flex items-center gap-3">
        {image ? (
          <img
            src={image}
            alt={imageAlt || `${clientName || 'Client'} avatar`}
            className="h-12 w-12 rounded-full object-cover"
          />
        ) : null}
        <div>
          <h3 className="font-semibold text-brand-navy">{clientName}</h3>
          {(clientRole || clientLocation) ? (
            <p className="text-sm text-brand-muted">
              {[clientRole, clientLocation].filter(Boolean).join(', ')}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default TestimonialCard;
