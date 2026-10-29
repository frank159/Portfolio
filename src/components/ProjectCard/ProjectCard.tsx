"use client";

import { useState } from "react";
import Image from "next/image";
import ProjectModal from "@/src/components/ProjectCard/ProjectModal";

export type ProjectCardProps = {
  name: string;
  /** Capa do card */
  image: string;
  /** Imagens do modal, de cima para baixo. Sem imagens válidas, o card não abre o modal */
  images?: string[];
  siteHref?: string;
};

export default function ProjectCard({
  name,
  image,
  images,
  siteHref,
}: ProjectCardProps) {
  const [open, setOpen] = useState(false);

  // só conta imagem com src preenchido (ignora vazios/espaços)
  const validImages = (images ?? []).filter(
    (src) => typeof src === "string" && src.trim() !== "",
  );
  const canOpen = validImages.length > 0;
  const openModal = () => {
    if (canOpen) setOpen(true);
  };

  return (
    <>
      <article className="group flex flex-col overflow-hidden border border-[#8b0000]">
        {/* Capa: clicável. Fica fora do tab (o botão do rodapé é o acessível) */}
        <button
          type="button"
          onClick={openModal}
          tabIndex={-1}
          aria-hidden
          disabled={!canOpen}
          className={`relative block aspect-[8/5] w-full overflow-hidden ${
            canOpen ? "cursor-pointer" : "cursor-default"
          }`}
        >
          <Image
            src={image}
            alt=""
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className={`object-cover transition-transform duration-500 ${
              canOpen ? "group-hover:scale-[1.03]" : ""
            }`}
          />
        </button>

        <div className="flex items-center gap-2 border-t border-[#8b0000] text-sm">
          {/* Título: ocupa toda a largura livre, então o rodapé inteiro abre o modal */}
          <button
            type="button"
            onClick={openModal}
            disabled={!canOpen}
            aria-haspopup={canOpen ? "dialog" : undefined}
            className={`flex flex-1 items-center gap-2 px-3 py-2 text-left ${
              canOpen ? "cursor-pointer" : "cursor-default"
            }`}
          >
            <Image
              src="/imgs/StarMini.png"
              alt=""
              width={20}
              height={20}
              className="shrink-0"
            />
            <span>{name}</span>
          </button>

          {/* Link separado (não dentro do botão) para não aninhar elementos interativos */}
          {siteHref && (
            <a
              href={siteHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mr-3 rounded-full border border-[#8b0000] px-2 py-0.5 text-[#8b0000] transition-colors hover:bg-[#8b0000] hover:text-[#f9fadb]"
            >
              Visitar site
            </a>
          )}
        </div>
      </article>

      {canOpen && (
        <ProjectModal
          open={open}
          name={name}
          images={validImages}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}