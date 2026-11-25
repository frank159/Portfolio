import type { Metadata } from "next";
import { Anton_SC, Figtree, Homemade_Apple } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import Olho from "../../components/Olho/Olho";
import Text from "@/src/components/Text/Text";
import TelaCheia from "@/src/components/TelaCheia/TelaCheia";

const titulo = Anton_SC({ subsets: ["latin"], weight: "400" });
const texto = Figtree({ subsets: ["latin"] });
const manuscrita = Homemade_Apple({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "Loja em construção | Guará Estúdio",
};

const botao =
  "border px-7 py-2 text-base transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4";

export default function Loja() {
  return (
    <TelaCheia
      className={`${texto.className} relative isolate flex min-h-[calc(100dvh-var(--header-height,4rem)-var(--footer-height,4rem))] flex-col items-center justify-center overflow-hidden bg-[#FAFADC] px-6 pb-[clamp(1rem,calc(65dvh-20.25rem),7rem)] pt-[min(2rem,4.8dvh)] text-center text-black md:pb-[min(2rem,4.8dvh)]`}
    >
      <p
        className={`${manuscrita.className} mb-[min(1.5rem,3.6dvh)] -rotate-3 text-xl text-[#7D0103] md:text-2xl`}
      >
        Estamos de olho nisso!
      </p>

      <Olho className="h-auto w-[min(50vw,267px,33vh)]" />

      <div className="relative mt-[min(2rem,4.8dvh)]">

        <h1
          className={`${titulo.className} text-[clamp(2rem,7vw,4rem)] leading-none text-[#5C7A85]`}
        >
          Em construção
        </h1>
      </div>

      <Text className="mt-[min(1.5rem,3.6dvh)] max-w-xl text-lg leading-snug">
        Nossa página da Loja está sendo feita por mãos humanas.
        <br />
        Volte em breve ;)
      </Text>

      <div className="mt-[min(2rem,4.8dvh)] flex flex-wrap justify-center gap-4">
        <Link
          href="/projetos/serigrafia"
          aria-label="Voltar para a página inicial"
          className={`${botao} group border-[#5C7A85] text-[#5C7A85] hover:bg-[#5C7A85] hover:text-[#FAFADC]`}
        >
          Voltar
        </Link>
      </div>

      <Image
        src="/logo/logoCarimbo.png"
        alt=""
        width={640}
        height={639}
        className="pointer-events-none absolute -bottom-16 -right-16 -z-10 h-auto w-44 animate-spin [animation-duration:40s] motion-reduce:animate-none md:-bottom-24 md:-right-24 md:w-80"
      />
    </TelaCheia>
  );
}