import { ContactForm, SectionTitle } from '../index.js';

/**
 * ServiceInquiryForm
 * Full-page inquiry form section for service detail pages.
 * Props:
 *   serviceTitle    – displayed in the heading
 *   inquirySubject  – pre-filled subject for ContactForm
 *   defaultMessage  – pre-filled message body
 */
function ServiceInquiryForm({ serviceTitle, inquirySubject, defaultMessage }) {
  const prefilledMessage =
    defaultMessage ||
    `I would like to learn more about ${serviceTitle}. Please contact me with the next steps and any documents required.`;

  return (
    <section id="service-inquiry" className="bg-white py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.5fr] lg:px-8">
        {/* Left column – context copy */}
        <div>
          <SectionTitle
            align="left"
            eyebrow="Inquiry Form"
            title={`Request ${serviceTitle}`}
            description="Fill in your contact details and a short message. We'll review your request, confirm the required documents, and share the next steps — typically within one business day."
          />

          <ul className="mt-8 space-y-4 text-sm text-brand-muted">
            {[
              'Secure and confidential submission',
              'One business day response time',
              'No obligation — just an open conversation',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-brand-gold" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Right column – form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
          <ContactForm
            services={[serviceTitle, 'Other']}
            defaultValues={{
              serviceInterest: serviceTitle,
              subject: inquirySubject || `Inquiry for ${serviceTitle}`,
              message: prefilledMessage,
            }}
            submitLabel="Submit Service Inquiry"
          />
        </div>
      </div>
    </section>
  );
}

export default ServiceInquiryForm;
