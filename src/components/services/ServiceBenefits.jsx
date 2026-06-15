import { FaCheckCircle } from 'react-icons/fa';
import SectionTitle from '../common/SectionTitle.jsx';

/**
 * ServiceBenefits
 * Displays a 2-column benefit grid with check icons.
 * Props:
 *   benefits – string[]  (from service.benefits)
 *   eyebrow  – optional section label
 *   title    – optional section heading
 */
function ServiceBenefits({
  benefits = [],
  eyebrow = 'Why Choose This Service',
  title = 'Key Benefits',
  description,
}) {
  if (!benefits.length) return null;

  return (
    <section className="bg-brand-surface py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow={eyebrow} title={title} description={description} />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {benefits.map((benefit) => (
            <li
              key={benefit}
              className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <span className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-full bg-green-50 ring-1 ring-green-200">
                <FaCheckCircle className="h-4.5 w-4.5 text-green-600" aria-hidden="true" />
              </span>
              <span className="text-sm font-medium leading-6 text-brand-navy">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default ServiceBenefits;
