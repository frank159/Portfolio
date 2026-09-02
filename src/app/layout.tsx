import localFont from 'next/font/local';
import { Nunito_Sans, Playfair_Display, Ribeye } from 'next/font/google'; 
import './globals.css';

const font42dot = localFont({
src: '../../public/fonts/42dotsans-regular.ttf',
  variable: '--font-42dot',
});

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-nunito-sans',
});

const ribeye = Ribeye({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-ribeye', 
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${font42dot.variable} ${nunitoSans.variable} ${ribeye.variable} ${playfair.variable}`}>
      <body className={`${font42dot.className} bg-zinc-50 text-black dark:bg-zinc-950 dark:text-zinc-50`}>
        {children}
      </body>
    </html>
  );
}