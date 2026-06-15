import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import SectionTitle from '../common/SectionTitle.jsx';

function getFaqId(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function FAQSection({
  eyebrow = 'FAQ',
  title = 'Frequently Asked Questions',
  description,
  faqs = [],
}) {
  const [openId, setOpenId] = useState(faqs[0]?.id || faqs[0]?.question || null);

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow={eyebrow} title={title} description={description} />
        <div className="mt-10 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
          {faqs.map((faq) => {
            const id = faq.id || faq.question;
            const panelId = `faq-${getFaqId(id)}`;
            const isOpen = openId === id;

            const buttonId = `faq-button-${getFaqId(id)}`;
            return (
              <div key={id}>
                <button
                  id={buttonId}
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left font-semibold text-brand-navy focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-gold"
                  onClick={() => setOpenId(isOpen ? null : id)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                >
                  <span>{faq.question}</span>
                  <FaChevronDown className={`h-4 w-4 flex-none transition ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                </button>
                {isOpen ? (
                  <div id={panelId} role="region" aria-labelledby={buttonId} className="px-5 pb-5 text-sm leading-7 text-brand-muted">
                    {faq.answer}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
