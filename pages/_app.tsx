import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { AppProps } from 'next/app';
import { Lato, Noto_Sans_JP, Noto_Sans_KR } from 'next/font/google';
import localFont from 'next/font/local';
import Script from 'next/script';
import Header from '@/components/Header';
import Services from '@/components/Services';
import { GA_TRACKING_ID, pageview } from '@/lib/gtag';
import 'styles/globals.sass';
import Footer from '@/components/Footer';

const fontKR = Noto_Sans_KR({
  weight: ['400', '700'],
  subsets: ['cyrillic'],
});

const fontJP = Noto_Sans_JP({
  weight: ['400', '700'],
  subsets: ['vietnamese'],
});

const fontLato = Lato({
  weight: ['100', '300', '400', '700', '900'],
  subsets: ['latin'],
});

const IBMPlexSansKR = localFont({
  src: [
    {
      path: '../fonts/IBMPlexSansKR-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/IBMPlexSansKR-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const registInit = async () => {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        registration.waiting?.postMessage('SKIP_WAITING');
      };
      registInit();
    }
  }, []);
  const homePage = router.pathname === '/';
  const musicPage = router.pathname.includes('/musics');
  const noticePage = router.pathname.includes('/notices');
  const contactPage = router.pathname.includes('/contact-us');
  const openPage = router.pathname.includes('/open-sources');
  const licensePage = router.pathname.includes('/licenses');
  const usagePage = router.pathname.includes('/usage');

  return (
    <>
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_TRACKING_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
      <style jsx global>
        {`
          body,
          pre,
          input,
          button,
          textarea,
          select {
            font-family: ${IBMPlexSansKR.style.fontFamily}, ${fontJP.style.fontFamily}, monospace;
          }
          .noto {
            font-family: ${fontKR.style.fontFamily};
          }
          time,
          nav > ol a {
            font-family: ${fontLato.style.fontFamily};
          }
        `}
      </style>
      <Header />
      <Component {...pageProps} />
      {homePage || musicPage || noticePage || contactPage || openPage || licensePage || usagePage ? (
        <Footer />
      ) : (
        <Services />
      )}
    </>
  );
}
