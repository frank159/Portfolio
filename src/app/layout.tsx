import localFont from 'next/font/local';
import {
  Anton_SC,
  Beth_Ellen,
  Google_Sans_Flex,
  Nunito_Sans,
  Playfair_Display,
  Ribeye,
} from 'next/font/google';
import './globals.css';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const font42dot = localFont({
  src: '../../public/fonts/42dotsans-regular.ttf',
  variable: '--font-42dot',
});

// Fonte dos títulos (classe font-display / componente Title)
const antonSC = Anton_SC({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-anton-sc',
});

// Fonte dos textos (classe font-sans / componente Text)
const googleSansFlex = Google_Sans_Flex({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-google-sans-flex',
});

const ribeye = Ribeye({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-ribeye',
});

const bethEllen = Beth_Ellen({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-beth-ellen',
});

const playfair = Playfair_Display({
  weight: ["400", "500", "600"],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

const nunitoSans = Nunito_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-nunito-sans',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${font42dot.variable} ${antonSC.variable} ${googleSansFlex.variable} ${nunitoSans.variable} ${ribeye.variable} ${playfair.variable} ${bethEllen.variable}`}
    >
      <body className={`${font42dot.className} bg-zinc-50 text-black dark:bg-zinc-950 dark:text-zinc-50`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}