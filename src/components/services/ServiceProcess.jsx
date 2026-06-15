import SectionTitle from '../common/SectionTitle.jsx';

/**
 * ServiceProcess
 * Numbered vertical step list for service detail pages.
 * Props:
 *   steps   – string[]  (from service.processSteps)
 *   eyebrow – optional section label
 *   title   – optional section heading
 */
function ServiceProcess({
  steps = [],
  eyebrow = 'How It Works',
  title = 'Our Process',
  description,
}) {
  if (!steps.length) return null;

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow={eyebrow} title={title} description={description} />
        <ol className="relative mt-12 ml-5 border-l-2 border-brand-gold/30">
          {steps.map((step, index) => (
            <li key={step} className="mb-10 ml-7 last:mb-0">
              {/* Step number bubble */}
              <span className="absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-brand-navy text-xs font-bold text-brand-gold ring-4 ring-white">
                {index + 1}
              </span>
              <div className="rounded-xl border border-slate-100 bg-brand-surface p-5 shadow-sm">
                <p className="text-sm font-medium leading-7 text-brand-navy">{step}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default ServiceProcess;
