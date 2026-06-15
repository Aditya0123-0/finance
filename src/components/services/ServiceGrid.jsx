import SectionTitle from '../common/SectionTitle.jsx';
import ServiceCard from './ServiceCard.jsx';

function ServiceGrid({
  eyebrow,
  title,
  description,
  services = [],
  columns = 'lg:grid-cols-3',
  emptyMessage = 'No services are available right now.',
}) {
  return (
    <section className="bg-brand-surface py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {(title || description || eyebrow) ? (
          <SectionTitle eyebrow={eyebrow} title={title} description={description} />
        ) : null}
        {services.length > 0 ? (
          <div className={`mt-10 grid gap-6 sm:grid-cols-2 ${columns}`}>
            {services.map((service) => (
              <ServiceCard key={service.id || service.slug || service.title} {...service} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-brand-muted">
            {emptyMessage}
          </div>
        )}
      </div>
    </section>
  );
}

export default ServiceGrid;
