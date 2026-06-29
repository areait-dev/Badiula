import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disattivato: in dev lo StrictMode monta gli effetti due volte e va in
  // conflitto con i pin di GSAP ScrollTrigger (errore "removeChild" su null).
  reactStrictMode: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'wp.agribadiula.it' },
    ],
  },
};

export default withNextIntl(nextConfig);
