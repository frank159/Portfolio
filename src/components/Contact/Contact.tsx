import Link from "next/link";
import Title from "@/src/components/Title/Title";

const BG = "#FAFADC";
const BLUE = "#5a7a8a";
const RED = "#8b0000";

export default function Contact() {
    return (
        <section
            className="border-t px-5 sm:px-[54px] py-10 lg:py-14 lg:min-h-[310px] flex flex-col justify-center"
            style={{ backgroundColor: BG, borderColor: RED }}
        >
            <div className="relative inline-block py-2 -my-2">
                <Title
                    as="h2"
                    className="text-[64px] sm:text-[88px] leading-[0.9] uppercase"
                    style={{ color: BLUE }}
                >
                    Contato
                </Title>

                <span className="absolute left-50 bottom-[110%] -ml-1 translate-y-2 origin-bottom-left scale-60 whitespace-nowrap font-beth-ellen text-[26px] sm:text-[34px] leading-none text-[#7D0103]">
                    Manda um olá!!!
                </span>
            </div>

            <p className="mt-3 font-sans text-[15px] leading-snug">
                Ficou com alguma dúvida? entre em contato.
                <br />
                Ficaremos felizes em te atender ;)
            </p>

            <Link
                href="/contato"
                className="mt-6 inline-block self-start border px-5 py-2 text-[15px] hover:bg-[#5a7a8a] hover:text-[#FAFADC] transition-colors"
                style={{ borderColor: BLUE, color: BLUE }}
            >
                Entrar em contato
            </Link>
        </section>
    );
}