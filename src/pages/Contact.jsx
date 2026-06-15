import { ContactForm, PageHeader } from '../components/index.js';
import { siteConfig } from '../config/siteConfig.js';

function Contact() {
  return (
    <main>
      <PageHeader
        eyebrow="Contact"
        title="Contact TaxFiler Global"
        description="Tell us what service you need. Our team will review your request and respond with the next steps."
      />
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:px-8">
          <div className="rounded-lg bg-brand-surface p-6">
            <h2 className="text-2xl font-bold text-brand-navy">Let's Connect</h2>
            <p className="mt-4 text-sm leading-7 text-brand-muted">
              Use this form for tax filing, bookkeeping, payroll, ITIN, FBAR/FATCA, CPA support, or any custom business service request.
            </p>
            <div className="mt-6 space-y-3 text-sm text-brand-muted">
              {siteConfig.email ? <p>Email: {siteConfig.email}</p> : null}
              {siteConfig.phone ? <p>Phone: {siteConfig.phone}</p> : null}
              <p>Support: Available 24/7. Emails answered within 12 hours.</p>
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contact;
