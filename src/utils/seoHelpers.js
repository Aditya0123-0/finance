import { DEFAULT_SEO } from '../constants/seo.js';

export function buildPageTitle(title) {
  return title ? `${title} | TaxFiler Global` : DEFAULT_SEO.title;
}
