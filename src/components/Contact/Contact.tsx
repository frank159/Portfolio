import Link from "next/link";
import Title from "@/src/components/Title/Title";
import Button from "../Button/Button";

const BG = "#FAFADC";
const BLUE = "#5a7a8a";
const RED = "#8b0000";

export default function Contact() {
    return (
        <section
            className="overflow-x-clip border-t px-5 py-15 sm:px-[54px] ms:py-10 lg:py-14 lg:min-h-[310px] flex flex-col justify-center"
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

                <span className="absolute left-50 bottom-[90%] sm:bottom-[110%] ml-3 sm:-ml-1 translate-y-2 origin-bottom-left rotate-12 sm:rotate-0 scale-60 whitespace-nowrap text-left font-beth-ellen text-[26px] sm:text-[34px] leading-[1.45] sm:leading-none text-[#7D0103]">
                    <span className="block sm:inline">Manda um</span>{" "}
                    <span className="block pl-7 sm:inline sm:pl-0">oi! :)</span>
                </span>
            </div>

            <p className="mt-3 font-sans text-[15px] leading-snug">
                Ficou com alguma dúvida? entre em contato.
                <br />
                Ficaremos felizes em te atender ;)
            </p>

            <Button
                href="/contato"
                className="mt-5"
            >
                Entrar em contato
            </Button>
        </section>
    );
}