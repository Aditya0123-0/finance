const baseServices = [
  {
    id: 'tax-planning-advisory',
    slug: 'tax-planning-advisory',
    title: 'Tax Planning Advisory',
    category: 'individual-tax',
    categoryLabel: 'US Individual Tax',
    description: 'Personalized planning for US taxpayers, NRIs, expats, and global income situations.',
    features: ['Federal and state planning', 'NRI and expat guidance', 'Double taxation advisory'],
    processSteps: ['Review income profile', 'Identify tax-saving opportunities', 'Prepare advisory action plan'],
    requiredDocuments: ['Prior year tax return', 'Income documents', 'Residency and foreign account details'],
  },
  {
    id: 'tax-return-services',
    slug: 'tax-return-services',
    title: 'Tax Return Services',
    category: 'individual-tax',
    categoryLabel: 'US Individual Tax',
    description: 'Accurate individual tax return preparation with secure document handling and review.',
    features: ['Form 1040 support', 'Federal and state returns', 'E-filing or paper filing guidance'],
    processSteps: ['Collect documents', 'Prepare return', 'Review and file'],
    requiredDocuments: ['W-2/1099 forms', 'Deduction records', 'Identity information'],
  },
  {
    id: 'tax-consultant-advisory',
    slug: 'tax-consultant-advisory',
    title: 'Tax Consultant & Tax Advisory',
    category: 'individual-tax',
    categoryLabel: 'US Individual Tax',
    description: 'Expert advisory for complex tax questions, notices, amendments, and compliance decisions.',
    features: ['IRS notice guidance', 'Amended return support', 'Multi-state advisory'],
    processSteps: ['Understand issue', 'Evaluate options', 'Recommend next steps'],
    requiredDocuments: ['Tax notice if any', 'Filed returns', 'Supporting records'],
  },
  {
    id: 'itin-processing',
    slug: 'itin-processing',
    title: 'ITIN Processing',
    category: 'individual-tax',
    categoryLabel: 'US Individual Tax',
    description: 'ITIN application and renewal assistance for eligible taxpayers and dependents.',
    features: ['Form W-7 guidance', 'Renewal support', 'Document checklist'],
    processSteps: ['Confirm eligibility', 'Prepare W-7 package', 'Submit with tax filing or renewal'],
    requiredDocuments: ['Passport or ID documents', 'Tax return where applicable', 'Proof of eligibility'],
  },
  {
    id: 'fbar-fatca-processing',
    slug: 'fbar-fatca-processing',
    title: 'FBAR/FATCA Processing',
    category: 'individual-tax',
    categoryLabel: 'US Individual Tax',
    description: 'Foreign account reporting assistance for FBAR and FATCA compliance.',
    features: ['FBAR filing support', 'FATCA review', 'Foreign asset reporting guidance'],
    processSteps: ['Collect account data', 'Determine reporting need', 'Prepare compliance filing'],
    requiredDocuments: ['Foreign bank statements', 'Maximum account balances', 'Asset ownership details'],
  },
  {
    id: 'extension-filing',
    slug: 'extension-filing',
    title: 'Extension Filing',
    category: 'individual-tax',
    categoryLabel: 'US Individual Tax',
    description: 'Federal and state extension filing support when more time is needed to prepare returns.',
    features: ['Federal extension', 'State extension guidance', 'Deadline reminders'],
    processSteps: ['Confirm filing need', 'Estimate tax due', 'Submit extension'],
    requiredDocuments: ['Basic taxpayer details', 'Estimated income', 'Prior year return'],
  },
  {
    id: 'tax-preparation-services',
    slug: 'tax-preparation-services',
    title: 'Tax Preparation Services',
    category: 'individual-tax',
    categoryLabel: 'US Individual Tax',
    description: 'End-to-end preparation for individuals, sole proprietors, and expat taxpayers.',
    features: ['Income and deduction review', 'Schedule support', 'Refund optimization guidance'],
    processSteps: ['Document intake', 'Preparation', 'Quality review'],
    requiredDocuments: ['Income forms', 'Expense records', 'Prior filings'],
  },
  {
    id: 'business-incorporation-consulting',
    slug: 'business-incorporation-consulting',
    title: 'Business Incorporation Consulting',
    category: 'business-tax',
    categoryLabel: 'US Business Tax',
    description: 'Entity setup guidance for LLCs, corporations, startups, and global founders.',
    features: ['Entity selection guidance', 'Startup compliance checklist', 'Registration coordination'],
    processSteps: ['Understand business goals', 'Recommend structure', 'Support filing path'],
    requiredDocuments: ['Founder details', 'Business activity', 'Preferred state details'],
  },
  {
    id: 'accounting-bookkeeping',
    slug: 'accounting-bookkeeping',
    title: 'Accounting Bookkeeping',
    category: 'business-tax',
    categoryLabel: 'US Business Tax',
    description: 'Reliable bookkeeping and accounting support for growing businesses.',
    features: ['Monthly books', 'QuickBooks support', 'Financial reports'],
    processSteps: ['Set up books', 'Reconcile accounts', 'Deliver monthly reports'],
    requiredDocuments: ['Bank statements', 'Sales records', 'Expense records'],
  },
  {
    id: 'payroll-processing',
    slug: 'payroll-processing',
    title: 'Payroll Processing',
    category: 'business-tax',
    categoryLabel: 'US Business Tax',
    description: 'Payroll processing support with attention to compliance and reporting schedules.',
    features: ['Payroll calculations', 'Payroll tax support', 'Employee payment records'],
    processSteps: ['Collect payroll inputs', 'Process payroll', 'Prepare reports'],
    requiredDocuments: ['Employee details', 'Pay schedule', 'Time and salary records'],
  },
  {
    id: 'tax-return-planning-preparation',
    slug: 'tax-return-planning-preparation',
    title: 'Tax Return Planning Preparation',
    category: 'business-tax',
    categoryLabel: 'US Business Tax',
    description: 'Business tax planning and return preparation for LLCs, partnerships, and corporations.',
    features: ['LLC and corporation returns', 'Planning review', 'Federal and state support'],
    processSteps: ['Review books', 'Plan tax position', 'Prepare return'],
    requiredDocuments: ['Financial statements', 'Payroll reports', 'Prior returns'],
  },
  {
    id: 'cpa-bookkeeping-accounting',
    slug: 'cpa-bookkeeping-accounting',
    title: 'Bookkeeping and Accounting',
    category: 'accountants-cpas',
    categoryLabel: 'For Accountants / CPAs',
    description: 'Back-office bookkeeping and accounting support for accounting firms and CPA practices.',
    features: ['White-label support', 'Monthly close assistance', 'Workpaper preparation'],
    processSteps: ['Define scope', 'Assign workflow', 'Deliver reviewed workpapers'],
    requiredDocuments: ['Client access details', 'Chart of accounts', 'Prior workpapers'],
  },
  {
    id: 'audit-support',
    slug: 'audit-support',
    title: 'Audit Support',
    category: 'accountants-cpas',
    categoryLabel: 'For Accountants / CPAs',
    description: 'Structured audit support for documentation, reconciliations, and schedules.',
    features: ['Audit schedules', 'Document organization', 'Reconciliation support'],
    processSteps: ['Map audit request list', 'Collect support', 'Prepare schedules'],
    requiredDocuments: ['PBC list', 'Ledger exports', 'Source documents'],
  },
  {
    id: 'tax-support',
    slug: 'tax-support',
    title: 'Tax Support',
    category: 'accountants-cpas',
    categoryLabel: 'For Accountants / CPAs',
    description: 'Tax season support for CPA firms, EAs, and accounting teams.',
    features: ['Return preparation support', 'Organizer review', 'Tax workpaper support'],
    processSteps: ['Receive client file', 'Prepare draft', 'Route for firm review'],
    requiredDocuments: ['Client organizer', 'Tax documents', 'Prior return'],
  },
  {
    id: 'backoffice-support',
    slug: 'backoffice-support',
    title: 'Backoffice Support',
    category: 'accountants-cpas',
    categoryLabel: 'For Accountants / CPAs',
    description: 'Scalable back-office operations support for accounting and advisory firms.',
    features: ['Dedicated process support', 'Workflow documentation', 'Secure handoff'],
    processSteps: ['Design workflow', 'Set delivery cadence', 'Track service status'],
    requiredDocuments: ['Process checklist', 'Client file access', 'Reporting template'],
  },
];

const detailContentBySlug = {
  'tax-planning-advisory': {
    heroTitle: 'Strategic Tax Planning Advisory',
    longDescription:
      'Tax Planning Advisory helps individuals plan ahead before filing deadlines, major income events, foreign reporting requirements, and multi-state obligations. The service is designed for taxpayers who want practical guidance before decisions become costly.',
    benefits: [
      'Identify planning opportunities before filing season',
      'Reduce avoidable penalties and missed deadlines',
      'Coordinate US, state, and foreign reporting considerations',
      'Get a documented action plan for next steps',
    ],
    faqs: [
      {
        question: 'Who should use tax planning advisory?',
        answer: 'This service is useful for NRIs, expats, high-income earners, multi-state taxpayers, and anyone with foreign accounts or complex income.',
      },
      {
        question: 'Is this the same as tax return preparation?',
        answer: 'No. Advisory focuses on planning and decisions. Tax return preparation focuses on preparing and filing the return.',
      },
    ],
  },
  'tax-return-services': {
    heroTitle: 'US Individual Tax Return Services',
    longDescription:
      'Tax Return Services cover preparation support for individual US tax filings with organized document intake, review, and filing guidance. The process is structured to reduce back-and-forth and keep records clear.',
    benefits: [
      'Organized preparation for federal and state returns',
      'Review of income, deductions, and eligible credits',
      'Support for e-filing or paper filing paths',
      'Clear communication through the filing process',
    ],
    faqs: [
      {
        question: 'Can you help with both federal and state returns?',
        answer: 'Yes. The service supports federal and state return preparation based on the taxpayer situation.',
      },
      {
        question: 'Can prior year returns be prepared?',
        answer: 'Yes. Prior year filing support can be reviewed based on available records and filing requirements.',
      },
    ],
  },
  'tax-consultant-advisory': {
    heroTitle: 'Tax Consultant & Advisory Support',
    longDescription:
      'Tax Consultant & Tax Advisory provides issue-specific guidance for notices, amendments, filing questions, residency concerns, and tax positions that require professional review.',
    benefits: [
      'Get clarity on complex tax questions',
      'Understand options before responding to notices',
      'Review amendments and correction paths',
      'Plan next steps with practical documentation',
    ],
    faqs: [
      {
        question: 'Can you help with an IRS notice?',
        answer: 'Yes. Notices can be reviewed and mapped to a response plan based on the issue and supporting records.',
      },
      {
        question: 'Do I need to register before asking a question?',
        answer: 'You can submit an inquiry first. Registration may be used later for secure service tracking or document handling.',
      },
    ],
  },
  'itin-processing': {
    heroTitle: 'ITIN Application & Renewal Processing',
    longDescription:
      'ITIN Processing supports eligible taxpayers and dependents with Form W-7 preparation, renewal review, checklist creation, and filing coordination.',
    benefits: [
      'Clear checklist for ITIN documents',
      'Support for new applications and renewals',
      'Coordination with tax filing where required',
      'Reduced risk of incomplete submissions',
    ],
    faqs: [
      {
        question: 'What is an ITIN?',
        answer: 'An ITIN is an Individual Taxpayer Identification Number used by taxpayers who are not eligible for a Social Security Number but have US tax filing needs.',
      },
      {
        question: 'Can dependents apply for ITINs?',
        answer: 'Eligible dependents may apply when they meet IRS requirements and have the required supporting documentation.',
      },
    ],
  },
  'fbar-fatca-processing': {
    heroTitle: 'FBAR/FATCA Processing',
    longDescription:
      'FBAR/FATCA Processing helps taxpayers review foreign account and asset reporting requirements, organize account data, and prepare compliance filings.',
    benefits: [
      'Review foreign account reporting obligations',
      'Organize maximum balance and ownership details',
      'Support FBAR and FATCA compliance workflows',
      'Reduce missed reporting risk',
    ],
    faqs: [
      {
        question: 'What is FBAR filing?',
        answer: 'FBAR is a foreign bank account reporting requirement for certain US persons with foreign financial accounts above applicable thresholds.',
      },
      {
        question: 'Is FATCA the same as FBAR?',
        answer: 'No. FBAR and FATCA are separate reporting regimes with different forms, thresholds, and filing rules.',
      },
    ],
  },
  'extension-filing': {
    heroTitle: 'Federal and State Extension Filing',
    longDescription:
      'Extension Filing supports taxpayers who need more time to prepare complete returns while still managing deadlines and estimated payments responsibly.',
    benefits: [
      'Avoid rushed or incomplete return filing',
      'Understand extension deadlines',
      'Coordinate federal and state extension needs',
      'Review estimated payment considerations',
    ],
    faqs: [
      {
        question: 'Does an extension extend the time to pay?',
        answer: 'Generally, an extension gives more time to file, not more time to pay. Estimated tax due should still be reviewed.',
      },
      {
        question: 'Can state extensions be handled too?',
        answer: 'State extension requirements vary, but they can be reviewed as part of the service.',
      },
    ],
  },
  'tax-preparation-services': {
    heroTitle: 'Tax Preparation Services',
    longDescription:
      'Tax Preparation Services provide end-to-end support for organizing documents, preparing returns, reviewing tax positions, and helping taxpayers move confidently toward filing.',
    benefits: [
      'Structured document intake',
      'Preparation support for common and complex income items',
      'Review-focused workflow before filing',
      'Clear next steps for missing records',
    ],
    faqs: [
      {
        question: 'What documents are needed to start?',
        answer: 'Common documents include income forms, prior returns, identity details, expense records, and any foreign account information if applicable.',
      },
      {
        question: 'Can sole proprietors use this service?',
        answer: 'Yes. Sole proprietor tax preparation can be supported when business income and expense records are available.',
      },
    ],
  },
  'business-incorporation-consulting': {
    heroTitle: 'Business Incorporation Consulting',
    longDescription:
      'Business Incorporation Consulting helps founders and business owners evaluate entity options, understand registration steps, and prepare for ongoing tax and accounting obligations.',
    benefits: [
      'Compare entity setup considerations',
      'Clarify startup compliance needs',
      'Prepare business registration information',
      'Coordinate accounting and tax readiness',
    ],
    faqs: [
      {
        question: 'Can you help choose between LLC and corporation?',
        answer: 'The service can explain practical tax and compliance considerations so the owner can make an informed decision with professional guidance.',
      },
      {
        question: 'Is bookkeeping setup included?',
        answer: 'Bookkeeping setup can be coordinated as a separate or follow-on service depending on business needs.',
      },
    ],
  },
  'accounting-bookkeeping': {
    heroTitle: 'Accounting Bookkeeping Services',
    longDescription:
      'Accounting Bookkeeping services keep business records organized through reconciliations, monthly bookkeeping, reporting, and accounting support.',
    benefits: [
      'Maintain clean monthly books',
      'Improve visibility into business performance',
      'Prepare records for tax filing',
      'Support QuickBooks-based workflows',
    ],
    faqs: [
      {
        question: 'Can you work with QuickBooks?',
        answer: 'Yes. QuickBooks bookkeeping support is part of the service scope.',
      },
      {
        question: 'How often are books updated?',
        answer: 'Most clients use monthly bookkeeping, but frequency can be adjusted based on transaction volume and reporting needs.',
      },
    ],
  },
  'payroll-processing': {
    heroTitle: 'Payroll Processing Services',
    longDescription:
      'Payroll Processing supports businesses with organized payroll inputs, calculation workflows, employee payment records, and payroll reporting coordination.',
    benefits: [
      'Keep payroll records consistent',
      'Support recurring payroll schedules',
      'Reduce manual calculation errors',
      'Prepare payroll reports for accounting and tax use',
    ],
    faqs: [
      {
        question: 'What payroll details are needed?',
        answer: 'Employee details, pay schedule, salary or hourly records, time records, and applicable deductions are commonly needed.',
      },
      {
        question: 'Can payroll reports support tax preparation?',
        answer: 'Yes. Payroll records can support business tax filing and accounting reconciliation.',
      },
    ],
  },
  'tax-return-planning-preparation': {
    heroTitle: 'Business Tax Return Planning Preparation',
    longDescription:
      'Tax Return Planning Preparation helps businesses review books, plan tax positions, and prepare returns for entities such as LLCs, partnerships, and corporations.',
    benefits: [
      'Connect bookkeeping with tax preparation',
      'Review business deductions and reporting needs',
      'Support entity-specific return preparation',
      'Prepare records for federal and state obligations',
    ],
    faqs: [
      {
        question: 'Which business entities are supported?',
        answer: 'LLCs, partnerships, S corporations, C corporations, and sole proprietorships can be reviewed depending on the facts.',
      },
      {
        question: 'Do books need to be completed first?',
        answer: 'Clean books make tax preparation more accurate. Bookkeeping cleanup may be recommended before filing.',
      },
    ],
  },
  'cpa-bookkeeping-accounting': {
    heroTitle: 'Bookkeeping and Accounting For CPA Firms',
    longDescription:
      'Bookkeeping and Accounting support gives accounting firms scalable back-office capacity for client bookkeeping, monthly close, reconciliations, and workpaper preparation.',
    benefits: [
      'Add capacity without expanding internal headcount immediately',
      'Standardize bookkeeping workflows',
      'Prepare review-ready workpapers',
      'Support recurring client deliverables',
    ],
    faqs: [
      {
        question: 'Can this be white-label support?',
        answer: 'Yes. The workflow can be structured as back-office support for the accounting firm.',
      },
      {
        question: 'Can you follow our firm checklist?',
        answer: 'Yes. Firm-specific checklists and templates can be used to keep delivery consistent.',
      },
    ],
  },
  'audit-support': {
    heroTitle: 'Audit Support Services',
    longDescription:
      'Audit Support helps accounting teams organize PBC lists, prepare schedules, reconcile accounts, and structure documentation for audit workflows.',
    benefits: [
      'Organize audit request lists',
      'Prepare support schedules',
      'Improve documentation readiness',
      'Reduce pressure on internal teams during audit season',
    ],
    faqs: [
      {
        question: 'What is needed to start audit support?',
        answer: 'A PBC list, ledger exports, trial balance, and source documents are typically needed.',
      },
      {
        question: 'Can you prepare reconciliations?',
        answer: 'Yes. Reconciliation support can be included based on the audit request list and available records.',
      },
    ],
  },
  'tax-support': {
    heroTitle: 'Tax Support For CPA Firms',
    longDescription:
      'Tax Support helps CPA firms, EAs, and accounting teams manage tax season workloads through organizer review, document preparation, and return-support workflows.',
    benefits: [
      'Increase tax season capacity',
      'Prepare organized workpapers',
      'Support client document review',
      'Route completed files for firm-level review',
    ],
    faqs: [
      {
        question: 'Does the firm retain final review?',
        answer: 'Yes. Tax support is designed to prepare and organize work for the firm review process.',
      },
      {
        question: 'Can you support individual and business returns?',
        answer: 'Support can be structured for both individual and business return workflows depending on scope.',
      },
    ],
  },
  'backoffice-support': {
    heroTitle: 'Backoffice Support For Accounting Teams',
    longDescription:
      'Backoffice Support provides scalable operational help for accounting, tax, audit, bookkeeping, and reporting workflows used by professional firms.',
    benefits: [
      'Document repeatable processes',
      'Create steady delivery cadence',
      'Support multiple service lines',
      'Improve visibility through status tracking',
    ],
    faqs: [
      {
        question: 'What tasks can be included?',
        answer: 'Bookkeeping support, document organization, workpaper preparation, tax support, audit schedules, and reporting tasks can be considered.',
      },
      {
        question: 'Can work be tracked by status?',
        answer: 'Yes. The architecture supports safe service status tracking without exposing sensitive client data publicly.',
      },
    ],
  },
};

function buildDefaultFaqs(service) {
  return [
    ...(detailContentBySlug[service.slug]?.faqs || []),
    {
      question: `How do I start ${service.title}?`,
      answer: 'Submit the inquiry form on this page or contact TaxFiler Global through WhatsApp. The team will review your request and share the next steps.',
    },
    {
      question: 'Is my information handled securely?',
      answer: 'The application architecture uses Firebase Authentication, Firestore rules, and Firebase Storage rules so private records and documents are not publicly exposed.',
    },
  ];
}

export const fallbackServices = baseServices.map((service) => {
  const details = detailContentBySlug[service.slug] || {};

  return {
    ...service,
    heroTitle: details.heroTitle || service.title,
    longDescription: details.longDescription || service.description,
    benefits: details.benefits || service.features,
    faqs: buildDefaultFaqs(service),
    inquirySubject: `Inquiry for ${service.title}`,
    ctaText: `Start ${service.title}`,
  };
});

export function getServicesByCategory(category) {
  return fallbackServices.filter((service) => service.category === category);
}

export function getServiceBySlug(slug) {
  return fallbackServices.find((service) => service.slug === slug);
}
