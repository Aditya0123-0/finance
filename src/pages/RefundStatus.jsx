import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import SEO from '../components/common/SEO.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { subscribeToCollection, updateDocument, addDocument } from '../firebase/firestoreService.js';
import { queryRefundStatusSecurely } from '../firebase/refundStatusTrackerService.js';
import { COLLECTIONS } from '../constants/collections.js';
import {
  FaPlus,
  FaSpinner,
  FaCheckCircle,
  FaClock,
  FaSearch,
  FaTimes,
  FaEdit,
  FaChevronDown,
  FaFileAlt,
  FaHourglassHalf,
  FaExclamationTriangle,
  FaArrowLeft,
  FaInfoCircle
} from 'react-icons/fa';

const COL_REQUESTS = COLLECTIONS.REFUND_STATUS_REQUESTS || 'refundStatusRequests';

// Form validation schema for submitting requests (private portal)
const refundRequestFormSchema = yup.object({
  taxYear: yup
    .string()
    .required('Tax year is required')
    .matches(/^[0-9]{4}$/, 'Tax year must be a 4-digit number'),
  filingType: yup
    .string()
    .oneOf(['federal', 'state', 'both'], 'Filing type must be federal, state, or both')
    .required('Filing type is required'),
  filingStatus: yup.string().required('Filing status is required'),
  ssn4: yup
    .string()
    .required('SSN last 4 digits is required')
    .matches(/^[0-9]{4}$/, 'SSN must be exactly 4 digits'),
  expectedRefund: yup.string().required('Expected refund amount is required'),
  note: yup.string(),
});

// Form validation schema for guest check (public tracker)
const guestLookupSchema = yup.object({
  referenceNumber: yup.string().trim().required('Reference number is required'),
  email: yup.string().trim().email('Enter a valid email').required('Email is required'),
  phone: yup.string().trim().required('Phone number is required'),
});

const STATUS_STEPS = [
  'Pending Documents',
  'Documents Submitted',
  'Processing',
  'Completed'
];

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs text-red-600 font-semibold">{message}</p>;
}

function RefundStatus() {
  const { currentUser, userProfile } = useAuth();
  const isAdmin = userProfile?.role === 'admin';

  const pageDescription =
    'Secure refund status tracker for TaxFiler Global clients, with public guest lookup and authenticated portal support.';

  const refundStatusJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Refund Status',
    description: pageDescription,
    url: `${window.location.origin}/#/refund-status`,
  };

  // State for authenticated portal
  const [requests, setRequests] = useState([]);
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeRequest, setActiveRequest] = useState(null);
  const [adminResponse, setAdminResponse] = useState('');
  const [adminStatus, setAdminStatus] = useState('in-review');
  const [updating, setUpdating] = useState(false);

  // State for public guest lookup
  const [searchResult, setSearchResult] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // ─── Real-time Portal Subscriptions ─────────────────────────────────────────
  useEffect(() => {
    if (!currentUser) return;

    setPortalLoading(true);
    const constraints = isAdmin
      ? { orderBy: ['createdAt', 'desc'] }
      : { where: [['userId', '==', currentUser.uid]], orderBy: ['createdAt', 'desc'] };

    const unsubscribe = subscribeToCollection(COL_REQUESTS, constraints, (data, err) => {
      if (err) {
        setPortalError('Failed to fetch refund status requests.');
        console.error('[RefundStatus]', err);
      } else {
        setRequests(data);
        setPortalError(null);
      }
      setPortalLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, isAdmin]);

  // ─── Submission Form (Private) ──────────────────────────────────────────────
  const {
    register: registerRequest,
    handleSubmit: handleSubmitRequest,
    reset: resetRequest,
    formState: { errors: requestErrors, isSubmitting: isSubmittingRequest },
  } = useForm({
    resolver: yupResolver(refundRequestFormSchema),
    defaultValues: {
      taxYear: new Date().getFullYear().toString(),
      filingType: 'federal',
      filingStatus: '',
      ssn4: '',
      expectedRefund: '',
      note: '',
    },
  });

  const onPrivateSubmit = async (data) => {
    try {
      await addDocument(COL_REQUESTS, {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userName: userProfile?.displayName || currentUser.displayName || 'Client',
        taxYear: data.taxYear,
        filingType: data.filingType,
        filingStatus: data.filingStatus,
        ssn4: data.ssn4,
        expectedRefund: data.expectedRefund,
        note: data.note,
        status: 'pending',
        adminResponse: null,
      });
      setShowModal(false);
      resetRequest();
      setPortalError(null);
    } catch (err) {
      console.error('[RefundStatus] Create error:', err);
      setPortalError('Could not submit refund status check request. Please try again.');
    }
  };

  const handleAdminUpdate = async (requestId) => {
    setUpdating(true);
    try {
      await updateDocument(COL_REQUESTS, requestId, {
        status: adminStatus,
        adminResponse: adminResponse || null,
      });
      setActiveRequest(null);
      setAdminResponse('');
      setPortalError(null);
    } catch (err) {
      console.error('[RefundStatus] Update error:', err);
      setPortalError('Failed to update request status.');
    } finally {
      setUpdating(false);
    }
  };

  // ─── Lookup Form (Public Guest) ─────────────────────────────────────────────
  const {
    register: registerLookup,
    handleSubmit: handleSubmitLookup,
    formState: { errors: lookupErrors },
  } = useForm({
    resolver: yupResolver(guestLookupSchema),
    defaultValues: {
      referenceNumber: '',
      email: '',
      phone: '',
    },
  });

  const onGuestLookup = async (data) => {
    setSearchLoading(true);
    setSearchError(null);
    setSearchResult(null);
    setHasSearched(true);

    try {
      const { data: record, error: queryError } = await queryRefundStatusSecurely(
        data.email,
        data.phone,
        data.referenceNumber
      );

      if (queryError) {
        setSearchError(queryError.message || 'Verification failed. Check your security rules.');
      } else if (!record) {
        setSearchError('No matching tax record found. Please verify your reference number, email, and phone number.');
      } else {
        setSearchResult(record);
      }
    } catch (err) {
      console.error('[RefundStatus] Lookup error:', err);
      setSearchError('A system error occurred. Please try again.');
    } finally {
      setSearchLoading(false);
    }
  };

  // Status Style Maps
  const getStatusBadge = (status) => {
    switch (status) {
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
            <FaCheckCircle className="h-3 w-3" /> Resolved
          </span>
        );
      case 'in-review':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
            <FaSpinner className="h-3 w-3 animate-spin" /> In Review
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
            <FaClock className="h-3 w-3" /> Pending
          </span>
        );
    }
  };

  const getPublicStatusIcon = (step, currentStatus) => {
    if (currentStatus === 'Rejected') {
      return <FaExclamationTriangle className="h-5 w-5 text-red-500" />;
    }

    const currentIndex = STATUS_STEPS.indexOf(currentStatus);
    const stepIndex = STATUS_STEPS.indexOf(step);

    if (stepIndex < currentIndex) {
      return <FaCheckCircle className="h-5 w-5 text-brand-gold" />;
    } else if (stepIndex === currentIndex) {
      return <FaHourglassHalf className="h-5 w-5 text-brand-navy animate-pulse" />;
    } else {
      return <FaFileAlt className="h-5 w-5 text-slate-300" />;
    }
  };

  return (
    <>
      <SEO
        title="Refund Status | TaxFiler Global"
        description={pageDescription}
        keywords="refund status, tax refund tracker, secure lookup, refund portal"
        ogImage="/og-image.jpg"
        jsonLd={refundStatusJsonLd}
        noIndex={true}
      />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* ─── PUBLIC GUEST MODE ─── */}
      {!currentUser ? (
        <div className="mx-auto max-w-3xl space-y-10">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-brand-navy sm:text-5xl">
              Track Your Refund Status
            </h1>
            <p className="mt-4 text-base text-brand-muted">
              Enter your filing credentials and reference ID to securely retrieve your live IRS or State refund status.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-[1.2fr_1.8fr]">
            {/* Input Form */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
              <h3 className="text-lg font-bold text-brand-navy border-b border-slate-100 pb-3 mb-5">
                Secure Lookup
              </h3>

              <form onSubmit={handleSubmitLookup(onGuestLookup)} className="space-y-4" noValidate>
                <div>
                  <label htmlFor="referenceNumber" className="block text-xs font-bold text-brand-navy uppercase tracking-wider">
                    Reference Number
                  </label>
                  <input
                    id="referenceNumber"
                    type="text"
                    placeholder="E.g. REF-202688"
                    className="mt-2 block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-gold font-mono"
                    {...registerLookup('referenceNumber')}
                  />
                  <FieldError message={lookupErrors.referenceNumber?.message} />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-brand-navy uppercase tracking-wider">
                    Filing Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="mt-2 block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-gold"
                    {...registerLookup('email')}
                  />
                  <FieldError message={lookupErrors.email?.message} />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs font-bold text-brand-navy uppercase tracking-wider">
                    Filing Phone
                  </label>
                  <input
                    id="phone"
                    type="text"
                    placeholder="E.g. 555-0199"
                    className="mt-2 block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-gold"
                    {...registerLookup('phone')}
                  />
                  <FieldError message={lookupErrors.phone?.message} />
                </div>

                <button
                  type="submit"
                  disabled={searchLoading}
                  className="w-full inline-flex justify-center items-center gap-2 rounded-lg bg-brand-navy px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-blue disabled:opacity-50"
                >
                  {searchLoading ? (
                    <>
                      <FaSpinner className="h-4 w-4 animate-spin" /> Verifying...
                    </>
                  ) : (
                    <>
                      <FaSearch className="h-3.5 w-3.5" /> Check Status
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Results Display */}
            <div className="flex flex-col justify-center rounded-2xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8 min-h-[320px]">
              {searchLoading ? (
                <div className="text-center py-8 text-brand-navy">
                  <FaSpinner className="mx-auto h-10 w-10 animate-spin" />
                  <p className="mt-4 text-sm font-bold">Checking secure Firestore records...</p>
                </div>
              ) : searchError ? (
                <div className="text-center py-6">
                  <FaExclamationTriangle className="mx-auto h-12 w-12 text-red-500" />
                  <h4 className="mt-4 text-lg font-bold text-brand-navy">Access Denied / Not Found</h4>
                  <p className="mt-2 text-sm text-brand-muted leading-relaxed">
                    {searchError}
                  </p>
                </div>
              ) : searchResult ? (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <h4 className="text-lg font-extrabold text-brand-navy">
                        Record #{searchResult.referenceNumber}
                      </h4>
                      <p className="text-xs text-brand-muted mt-1">
                        Tax filer: {searchResult.customerName} (Tax Year: {searchResult.taxYear})
                      </p>
                    </div>
                    {searchResult.status === 'Rejected' ? (
                      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-800">
                        Rejected
                      </span>
                    ) : (
                      <span className="rounded-full bg-brand-surface px-3 py-1 text-xs font-bold text-brand-navy">
                        {searchResult.status}
                      </span>
                    )}
                  </div>

                  {/* Rejected Details */}
                  {searchResult.status === 'Rejected' ? (
                    <div className="rounded-xl bg-red-50 border border-red-200 p-4 space-y-2">
                      <h5 className="text-sm font-bold text-red-900 flex items-center gap-2">
                        <FaExclamationTriangle className="h-4 w-4 text-red-600" /> File Processing Suspended
                      </h5>
                      <p className="text-xs text-red-700 leading-relaxed">
                        Your submission has been rejected. Please review the details below or contact our backoffice desk for adjustments.
                      </p>
                      {searchResult.notes && (
                        <p className="text-xs text-slate-800 bg-white p-2.5 rounded border border-red-100 mt-2 font-mono">
                          <strong>Reason:</strong> {searchResult.notes}
                        </p>
                      )}
                    </div>
                  ) : (
                    /* Timeline Steps */
                    <div className="relative space-y-6 pl-8">
                      {/* Vertical line connector */}
                      <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-slate-200" />

                      {STATUS_STEPS.map((step) => {
                        const isCurrent = searchResult.status === step;
                        const isCompleted = STATUS_STEPS.indexOf(step) < STATUS_STEPS.indexOf(searchResult.status);
                        return (
                          <div key={step} className="relative flex items-start gap-4">
                            <div className="absolute -left-8 flex h-7 w-7 items-center justify-center rounded-full bg-white border border-slate-100 shadow-sm">
                              {getPublicStatusIcon(step, searchResult.status)}
                            </div>
                            <div className="pt-0.5">
                              <h5
                                className={`text-sm font-bold ${
                                  isCurrent ? 'text-brand-navy' : isCompleted ? 'text-brand-gold' : 'text-slate-400'
                                }`}
                              >
                                {step}
                              </h5>
                              <p className="text-xs text-brand-muted mt-0.5">
                                {step === 'Pending Documents' && 'Awaiting upload of tax logs/W-2.'}
                                {step === 'Documents Submitted' && 'Documents successfully loaded and validated.'}
                                {step === 'Processing' && 'File queued for backoffice IRS dispatch.'}
                                {step === 'Completed' && 'Tax return finalized and submitted.'}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Public note updates */}
                  {searchResult.notes && searchResult.status !== 'Rejected' && (
                    <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                      <p className="text-xs font-bold text-brand-navy uppercase tracking-wider flex items-center gap-1.5">
                        <FaInfoCircle className="text-brand-gold" /> Tracker Status Update
                      </p>
                      <p className="mt-2 text-xs text-brand-muted leading-relaxed whitespace-pre-line">
                        {searchResult.notes}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-300">
                  <FaFileAlt className="mx-auto h-16 w-16" />
                  <p className="mt-4 text-sm font-semibold text-brand-muted">
                    Your secure tracking details will display here once loaded.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ─── AUTHENTICATED PORTAL MODE ─── */
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <h1 className="text-3xl font-extrabold text-brand-navy">Refund Status Tracker</h1>
              <p className="mt-2 text-sm text-brand-muted">
                {isAdmin
                  ? 'Admin Portal: Monitor and respond to client refund status inquiries.'
                  : 'Securely check, submit, and track the status of your tax refunds.'}
              </p>
            </div>
            {!isAdmin && (
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 rounded-full bg-brand-gold px-5 py-3 text-sm font-bold text-brand-ink transition hover:bg-brand-navy hover:text-white"
              >
                <FaPlus className="h-3.5 w-3.5" />
                Check New Refund
              </button>
            )}
          </div>

          {/* List area */}
          <div className="mt-8">
            {portalLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-brand-muted">
                <FaSpinner className="h-10 w-10 animate-spin text-brand-navy" />
                <p className="mt-4 text-sm font-medium">Loading status requests...</p>
              </div>
            ) : portalError ? (
              <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-center text-red-800">
                <p className="font-semibold">{portalError}</p>
              </div>
            ) : requests.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-soft">
                <FaSearch className="mx-auto h-12 w-12 text-slate-300" />
                <h3 className="mt-4 text-lg font-bold text-brand-navy">No requests found</h3>
                <p className="mt-2 text-sm text-brand-muted">
                  {isAdmin
                    ? 'No client requests have been submitted yet.'
                    : "You haven't submitted any refund status check requests yet."}
                </p>
                {!isAdmin && (
                  <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-gold px-5 py-2.5 text-sm font-bold text-brand-ink transition hover:bg-brand-navy hover:text-white"
                  >
                    Submit First Request
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((req) => (
                  <div
                    key={req.id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft transition duration-200 hover:border-slate-300"
                  >
                    <div className="p-6">
                      {/* Row 1: Badges, info */}
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          {getStatusBadge(req.status)}
                          <span className="text-sm font-semibold text-brand-navy bg-brand-surface px-2.5 py-1 rounded-md">
                            Tax Year: {req.taxYear}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 font-medium">
                          Submitted: {req.createdAt?.toDate ? req.createdAt.toDate().toLocaleDateString() : 'Just now'}
                        </span>
                      </div>

                      {/* Row 2: Details */}
                      <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-4">
                        <div>
                          <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Filing Type</p>
                          <p className="mt-1 text-sm font-bold text-brand-navy capitalize">{req.filingType}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Filing Status</p>
                          <p className="mt-1 text-sm font-bold text-brand-navy capitalize">{req.filingStatus.replace('-', ' ')}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">SSN (Last 4)</p>
                          <p className="mt-1 text-sm font-bold text-brand-navy">***-**-{req.ssn4}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Expected Refund</p>
                          <p className="mt-1 text-sm font-bold text-green-700 font-mono">{req.expectedRefund}</p>
                        </div>
                      </div>

                      {/* Client Info (Visible to Admin Only) */}
                      {isAdmin && (
                        <div className="mt-4 border-t border-slate-100 pt-4 text-xs text-slate-500 flex items-center gap-4">
                          <span><strong>Client Name:</strong> {req.userName}</span>
                          <span><strong>Email:</strong> {req.userEmail}</span>
                        </div>
                      )}

                      {/* Note */}
                      {req.note && (
                        <div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-brand-muted">
                          <strong>Client Note:</strong> {req.note}
                        </div>
                      )}

                      {/* Admin Response section */}
                      {(req.adminResponse || isAdmin) && (
                        <div className="mt-6 border-t border-slate-100 pt-6">
                          {activeRequest === req.id ? (
                            /* Admin Edit Form */
                            <div className="space-y-4 rounded-xl bg-slate-50 p-4 border border-slate-200">
                              <h4 className="text-sm font-bold text-brand-navy">Update Inquiry Response</h4>
                              <div>
                                <label className="block text-xs font-bold text-brand-muted uppercase">Status</label>
                                <select
                                  value={adminStatus}
                                  onChange={(e) => setAdminStatus(e.target.value)}
                                  className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-gold"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="in-review">In Review</option>
                                  <option value="resolved">Resolved</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-brand-muted uppercase">Admin Response</label>
                                <textarea
                                  rows="3"
                                  value={adminResponse}
                                  onChange={(e) => setAdminResponse(e.target.value)}
                                  placeholder="Provide updates or details on this refund check..."
                                  className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-gold resize-y"
                                />
                              </div>
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => setActiveRequest(null)}
                                  className="rounded-lg px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  disabled={updating}
                                  onClick={() => handleAdminUpdate(req.id)}
                                  className="rounded-lg bg-brand-navy px-4 py-2 text-xs font-semibold text-white hover:bg-brand-blue disabled:opacity-50"
                                >
                                  {updating ? 'Saving...' : 'Save Updates'}
                                </button>
                              </div>
                            </div>
                          ) : (
                            /* Display Response / Edit Button */
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                              <div className="flex-1 rounded-xl bg-brand-surface border border-slate-100 p-4">
                                <p className="text-xs font-bold text-brand-navy uppercase tracking-wider">Official Response</p>
                                <p className="mt-2 text-sm leading-relaxed text-brand-ink">
                                  {req.adminResponse || 'Your request has been received. Our processing team is currently checking the IRS/State database. An update will be posted shortly.'}
                                </p>
                              </div>
                              {isAdmin && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveRequest(req.id);
                                    setAdminStatus(req.status);
                                    setAdminResponse(req.adminResponse || '');
                                  }}
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-brand-navy hover:bg-slate-100"
                                >
                                  <FaEdit className="h-3 w-3" /> Update Status
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal - New Request */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-100">
                {/* Header */}
                <div className="flex items-center justify-between bg-brand-navy px-6 py-4 text-white">
                  <h3 className="text-lg font-bold">New Refund Status Check</h3>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="rounded-full p-1.5 hover:bg-white/10 text-slate-300 hover:text-white"
                  >
                    <FaTimes className="h-4 w-4" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmitRequest(onPrivateSubmit)} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto" noValidate>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Tax Year */}
                    <div>
                      <label htmlFor="taxYear" className="block text-xs font-bold text-brand-navy uppercase">Tax Year</label>
                      <input
                        id="taxYear"
                        type="text"
                        disabled={isSubmittingRequest}
                        placeholder="2023"
                        className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-gold"
                        {...registerRequest('taxYear')}
                      />
                      <FieldError message={requestErrors.taxYear?.message} />
                    </div>

                    {/* Filing Type */}
                    <div>
                      <label htmlFor="filingType" className="block text-xs font-bold text-brand-navy uppercase">Filing Type</label>
                      <select
                        id="filingType"
                        disabled={isSubmittingRequest}
                        className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-gold"
                        {...registerRequest('filingType')}
                      >
                        <option value="federal">Federal Only</option>
                        <option value="state">State Only</option>
                        <option value="both">Federal & State</option>
                      </select>
                      <FieldError message={requestErrors.filingType?.message} />
                    </div>
                  </div>

                  {/* Filing Status */}
                  <div>
                    <label htmlFor="filingStatus" className="block text-xs font-bold text-brand-navy uppercase">Filing Status</label>
                    <select
                      id="filingStatus"
                      disabled={isSubmittingRequest}
                      className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-gold"
                      {...registerRequest('filingStatus')}
                    >
                      <option value="">Select status</option>
                      <option value="single">Single</option>
                      <option value="married-jointly">Married Filing Jointly</option>
                      <option value="married-separately">Married Filing Separately</option>
                      <option value="head-of-household">Head of Household</option>
                      <option value="surviving-spouse">Qualifying Surviving Spouse</option>
                    </select>
                    <FieldError message={requestErrors.filingStatus?.message} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* SSN Last 4 */}
                    <div>
                      <label htmlFor="ssn4" className="block text-xs font-bold text-brand-navy uppercase">SSN (Last 4 digits)</label>
                      <input
                        id="ssn4"
                        type="text"
                        maxLength={4}
                        disabled={isSubmittingRequest}
                        placeholder="1234"
                        className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-gold"
                        {...registerRequest('ssn4')}
                      />
                      <FieldError message={requestErrors.ssn4?.message} />
                    </div>

                    {/* Expected Refund */}
                    <div>
                      <label htmlFor="expectedRefund" className="block text-xs font-bold text-brand-navy uppercase">Expected Refund Amount</label>
                      <input
                        id="expectedRefund"
                        type="text"
                        disabled={isSubmittingRequest}
                        placeholder="e.g. $1,250"
                        className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-gold"
                        {...registerRequest('expectedRefund')}
                      />
                      <FieldError message={requestErrors.expectedRefund?.message} />
                    </div>
                  </div>

                  {/* Note */}
                  <div>
                    <label htmlFor="note" className="block text-xs font-bold text-brand-navy uppercase">Notes / Additional Info</label>
                    <textarea
                      id="note"
                      rows="3"
                      disabled={isSubmittingRequest}
                      placeholder="E.g. filed late, or state refund was from California..."
                      className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-gold resize-y"
                      {...registerRequest('note')}
                    />
                    <FieldError message={requestErrors.note?.message} />
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingRequest}
                      className="rounded-lg bg-brand-gold px-5 py-2.5 text-sm font-bold text-brand-ink hover:bg-brand-navy hover:text-white disabled:opacity-50"
                    >
                      {isSubmittingRequest ? 'Submitting...' : 'Submit Request'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
    </>
  );
}

export default RefundStatus;
