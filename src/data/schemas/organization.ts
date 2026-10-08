import { SITE, WA_URL } from '../site';

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.legalName,
    alternateName: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/images/logo-horizontal.png`,
    description: SITE.description,
    foundingDate: String(SITE.foundingYear),
    areaServed: ['ID', 'ASEAN'],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: `+${SITE.waNumber}`,
      email: SITE.email,
      availableLanguage: 'Indonesian',
      contactOption: 'TollFree',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Jakarta',
      addressCountry: 'ID',
    },
    sameAs: [WA_URL],
  };
}
