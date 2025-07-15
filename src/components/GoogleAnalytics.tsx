// Em: src/components/GoogleAnalytics.tsx

import Script from 'next/script';

const GoogleAnalytics = () => {
  return (
    <>
      {/* <!-- Script do Google Tag Manager --> */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=G-TWH7PTN5N0`}
      />
      {/* <!-- Script de inicialização do GA --> */}
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-TWH7PTN5N0');
          `,
        }}
      />
    </>
  );
};

export default GoogleAnalytics;