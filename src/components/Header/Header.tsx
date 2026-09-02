import Link from "next/link";

export default function Header() {
  return (
    <header className="flex w-full h-14 items-stretch border-b border-black bg-white font-semibold text-sm tracking-wide text-black">
      
      <div className="flex items-center mr-100 px-8">
        <h1 className="m-0 text-base font-bold uppercase tracking-wider">
          Guará Estúdio
        </h1>
      </div>

      <nav className="flex flex-1 items-center justify-between border-l border-black px-8 uppercase">
        <Link href="/" className="hover:opacity-70 transition-opacity">INÍCIO</Link>
        <Link href="/" className="hover:opacity-70 transition-opacity">WEB SITE</Link>
        <Link href="/" className="hover:opacity-70 transition-opacity">SERIGRAFIA</Link>
        <Link href="/" className="hover:opacity-70 transition-opacity">DESEN. DE CÓDIGO</Link>
        <Link href="/" className="hover:opacity-70 transition-opacity">DESIGN</Link>
        <Link href="/" className="hover:opacity-70 transition-opacity">JOGOS</Link>
        <Link href="/" className="hover:opacity-70 transition-opacity">LOJA</Link>
        <Link href="/" className="hover:opacity-70 transition-opacity">CONTATO</Link>
      </nav>

    </header>
  );
}