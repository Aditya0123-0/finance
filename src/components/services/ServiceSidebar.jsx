import { FaFileAlt } from 'react-icons/fa';

/**
 * ServiceSidebar
 * Sticky sidebar card listing required documents and a CTA button.
 * Props:
 *   documents – string[]  (from service.requiredDocuments)
 *   ctaHref   – scroll target (default #service-inquiry)
 *   ctaLabel  – button label
 */
function ServiceSidebar({
  documents = [],
  ctaHref = '#service-inquiry',
  ctaLabel = 'Request This Service',
}) {
  return (
    <aside className="h-fit rounded-2xl border border-slate-200 bg-brand-surface p-6 shadow-soft lg:sticky lg:top-28">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-brand-navy text-brand-gold">
          <FaFileAlt className="h-5 w-5" aria-hidden="true" />
        </span>
        <h2 className="text-lg font-bold text-brand-navy">Required Documents</h2>
      </div>

      {documents.length > 0 ? (
        <ul className="mt-5 space-y-3">
          {documents.map((doc) => (
            <li key={doc} className="flex items-start gap-3 text-sm text-brand-muted">
              <span
                className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-brand-gold"
                aria-hidden="true"
              />
              <span>{doc}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-brand-muted">
          Contact us to discuss the documents required for this service.
        </p>
      )}

      <a
        href={ctaHref}
        className="mt-6 inline-flex w-full justify-center rounded-full bg-brand-gold px-5 py-3 text-sm font-semibold text-brand-ink shadow transition hover:bg-brand-navy hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2"
      >
        {ctaLabel}
      </a>
    </aside>
  );
}

export default ServiceSidebar;
