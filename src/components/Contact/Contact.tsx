import Image from "next/image";
import Title from "@/src/components/Title/Title";
import Text from "@/src/components/Text/Text";
import Button from "../Button/Button";

const BG = "#FAFADC";
const BLUE = "#5a7a8a";
const RED = "#8b0000";

export type ContactProfile = {
    /** Foto redonda */
    image: string;
    /** Legenda manuscrita sob a foto (também vira o alt, se não houver `alt`) */
    name: string;
    alt?: string;
    /** Saudação em caixa alta acima do texto (aparece só no desktop). Ex.: "Olá ;)" */
    greeting?: string;
    /** Um parágrafo por item */
    paragraphs: string[];
};

type ContactProps = {
    /** Quando enviado, ativa a versão com foto + descrição de perfil */
    profile?: ContactProfile;
};

function ProfileBlock({ profile }: { profile: ContactProfile }) {
    return (
        <div className="flex flex-col items-center gap-6 lg:basis-[68%] lg:shrink-0 lg:flex-row lg:items-start lg:gap-[45px] lg:pr-[3vw]">
            <div className="flex shrink-0 flex-col items-center gap-2">
                <div className="relative h-[88px] w-[88px] overflow-hidden rounded-full lg:h-[132px] lg:w-[132px]">
                    <Image
                        src={profile.image}
                        alt={profile.alt ?? profile.name}
                        fill
                        sizes="(min-width: 1024px) 132px, 88px"
                        className="object-cover"
                    />
                </div>
                {/* span simples: a fonte script não deve receber o font-sans do Text */}
                <span className="font-beth-ellen -rotate-5 text-[16px] leading-none text-[#5a7a8a]">
                    {profile.name}
                </span>
            </div>

            <div className="flex flex-col gap-4 text-left lg:max-w-[900px] lg:gap-0">
                {profile.greeting && (
                    <Title
                        as="h3"
                        font="nunito"
                        weight="bold"
                        className="hidden uppercase lg:mb-3 lg:block lg:text-[14px] lg:leading-none"
                    >
                        {profile.greeting}
                    </Title>
                )}
                {profile.paragraphs.map((paragraph) => (
                    <Text key={paragraph} className="lg:leading-[18px]">
                        {paragraph}
                    </Text>
                ))}
            </div>
        </div>
    );
}

export default function Contact({ profile }: ContactProps) {
    const hasProfile = Boolean(profile);

    return (
        <section
                className={`overflow-x-clip px-5 py-15 sm:px-[54px] ms:py-10 lg:py-14 lg:min-h-[310px] flex flex-col justify-center ${
                hasProfile
                    ? "gap-10 lg:flex-row lg:items-center lg:justify-start lg:gap-0 lg:px-[5vw]"
                    : "border-t"
            }`}
            style={{ backgroundColor: BG, borderColor: RED }}
        >
            {profile && <ProfileBlock profile={profile} />}

            {/* Bloco de contato. Com perfil: divisor vertical azul no desktop, linha fina no topo no mobile */}
            <div
                className={`flex flex-col ${
                    hasProfile
                        ? "border-t border-[#5a7a8a]/30 pt-10 lg:flex-1 lg:border-l lg:border-t-0 lg:border-[#5a7a8a] lg:py-1 lg:pl-[3vw] lg:pt-1"
                        : ""
                }`}
            >
                <div className="relative inline-block self-start py-2 -my-2">
                    <Title
                        as="h2"
                        className={`text-[64px] leading-[0.9] uppercase ${
                            hasProfile ? "sm:text-[88px] lg:text-[64px]" : "sm:text-[88px]"
                        }`}
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
                    href="https://wa.me/5541996262562?text=Olá!%20Gostaria%20de%20mais%20informações."
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Entrar em contato
                </Button>
            </div>
        </section>
    );
}