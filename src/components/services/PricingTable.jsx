import { FaCheck } from 'react-icons/fa';
import SectionTitle from '../common/SectionTitle.jsx';

function PricingTable({
  eyebrow = 'Pricing',
  title = 'Our Services & Pricing',
  description,
  plans = [],
  note,
}) {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow={eyebrow} title={title} description={description} />
        <div className="mt-10 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <caption className="sr-only">{title}</caption>
              <thead className="bg-brand-navy text-white">
                <tr>
                  <th scope="col" className="px-5 py-4 text-left text-sm font-semibold">Service</th>
                  <th scope="col" className="px-5 py-4 text-left text-sm font-semibold">Includes</th>
                  <th scope="col" className="px-5 py-4 text-left text-sm font-semibold">Starting Price</th>
                  <th scope="col" className="px-5 py-4 text-left text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {plans.map((plan) => (
                  <tr key={plan.title} className="align-top">
                    <th scope="row" className="px-5 py-5 text-left text-base font-semibold text-brand-navy">
                      {plan.title}
                      {plan.subtitle ? <p className="mt-1 text-sm font-normal text-brand-muted">{plan.subtitle}</p> : null}
                    </th>
                    <td className="px-5 py-5">
                      <ul className="space-y-2 text-sm text-brand-muted">
                        {(plan.features || []).map((feature) => (
                          <li key={feature} className="flex gap-2">
                            <FaCheck className="mt-1 h-3.5 w-3.5 flex-none text-green-600" aria-hidden="true" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="whitespace-nowrap px-5 py-5 text-lg font-bold text-brand-navy">{plan.price}</td>
                    <td className="px-5 py-5">
                      {plan.href ? (
                        <a
                          href={plan.href}
                          className="inline-flex rounded-full bg-brand-gold px-4 py-2 text-sm font-semibold text-brand-ink transition hover:bg-brand-navy hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2"
                        >
                          {plan.ctaLabel || 'Enquire'}
                        </a>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {note ? <p className="mt-4 text-center text-sm text-brand-muted">{note}</p> : null}
      </div>
    </section>
  );
}

export default PricingTable;
