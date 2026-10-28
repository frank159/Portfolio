import Image from "next/image";

export type ProjectCardProps = {
  name: string;
  image: string;
  projectHref: string;
  siteHref?: string;
};

export default function ProjectCard({
  name,
  image,
  projectHref,
  siteHref,
}: ProjectCardProps) {
  return (
    <article className="flex flex-col overflow-hidden border border-[#8b0000]">
      <div className="relative aspect-[8/5] w-full">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="flex items-center gap-2 border-t border-[#8b0000] px-3 py-2 text-sm">
        <Image
          src="/imgs/StarMini.png"
          alt=""
          width={20}
          height={20}
          className="shrink-0"
        />
        <span className="mr-auto">{name}</span>
        {siteHref && (
          <a
            href={siteHref}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-[#8b0000] px-2 py-0.5 text-[#8b0000] transition-colors hover:bg-[#8b0000] hover:text-[#f9fadb]"
          >
            Visitar site
          </a>
        )}
      </div>
    </article>
  );
}