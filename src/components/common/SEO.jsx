import { siteConfig } from '../../config/siteConfig.js';
import { DEFAULT_SEO } from '../../constants/seo.js';

/**
 * Reusable SEO Component
 * Leveraging React 19 native metadata tag hoisting to the document <head>.
 *
 * Props:
 *   title        – page-specific meta title
 *   description  – page-specific meta description
 *   keywords     – list of comma-separated SEO keywords
 *   canonicalUrl – override canonical link (defaults to current pathname)
 *   ogType       – OpenGraph content type (defaults to 'website')
 *   ogImage      – OpenGraph display image path
 *   twitterCard  – Twitter Card display type (defaults to 'summary_large_image')
 *   jsonLd       – custom structured schema object (defaults to FinancialService markup)
 *   noIndex      – boolean indicating robots should ignore this page
 */
function SEO({
  title,
  description = DEFAULT_SEO.description,
  keywords = 'tax filing, US tax, FBAR, FATCA, ITIN, bookkeeping, payroll, CPA support',
  canonicalUrl,
  ogType = 'website',
  ogImage = '/og-image.jpg',
  twitterCard = 'summary_large_image',
  jsonLd,
  noIndex = false,
}) {
  // Compute final tags
  const siteTitle = title 
    ? `${title} | ${siteConfig.name}` 
    : DEFAULT_SEO.title;
    
  const pageUrl = typeof window !== 'undefined' ? window.location.href : siteConfig.url;
  const currentUrl = canonicalUrl || pageUrl || siteConfig.url;

  const resolveAbsoluteUrl = (path) => {
    try {
      return new URL(path, siteConfig.url || currentUrl).toString();
    } catch {
      return path;
    }
  };

  const absoluteOgImage = ogImage.startsWith('http')
    ? ogImage
    : resolveAbsoluteUrl(ogImage);

  // Default Structured Schema (FinancialService)
  const defaultOrgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    'name': siteConfig.name,
    'description': siteConfig.description || description,
    'url': siteConfig.url,
    'telephone': siteConfig.phone,
    'email': siteConfig.email,
    'address': {
      '@type': 'PostalAddress',
      'addressCountry': 'US',
    },
  };

  const activeJsonLd = jsonLd || defaultOrgJsonLd;

  return (
    <>
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={currentUrl} />
      
      {/* Robots Indexing */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      {/* OpenGraph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title || siteConfig.name} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={absoluteOgImage} />
      <meta property="og:site_name" content={siteConfig.name} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title || siteConfig.name} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteOgImage} />

      {/* JSON-LD Structured Data */}
      {activeJsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(activeJsonLd)}
        </script>
      )}
    </>
  );
}

export default SEO;
