import Image from "next/image";
import { IconArrowUpRight, IconDeviceLaptop, IconHeadphones, IconShoppingBag, IconSearch } from "@tabler/icons-react";

// Texmart uses an illustrative cover; the other projects use supplied screenshots.
export function ProjectPreview({ kind }: { kind: string }) {
  if (kind === "texmart") return <div className="project-art texmart-art" aria-label="Illustrative Texmart project cover">
    <div className="preview-toolbar"><span className="texmart-brand">texmart<span>®</span></span><span className="preview-search"><IconSearch size={9} />Find your next upgrade</span><IconShoppingBag size={12} /></div>
    <div className="texmart-inner"><span className="preview-eyebrow">A little more possibility.</span><strong>Your everyday.<br />Upgraded.</strong><div className="mini-button">Explore electronics <IconArrowUpRight size={8} /></div></div>
    <div className="product-orbit"><div className="orbit-ring" /><IconDeviceLaptop className="product-laptop" stroke={0.8} /><IconHeadphones className="product-headphones" stroke={1.1} /></div>
    <div className="art-caption">ELECTRONICS / HOME / MORE</div>
  </div>;
  if (kind === "klean") return <div className="project-art klean-art">
    <Image src="/projects/klean.png" width={1908} height={927} sizes="(max-width: 520px) 100vw, (max-width: 700px) 50vw, 430px" alt="Screenshot of Husan's Klean website, showing its green and yellow homepage and cleaning services hero" className="project-screenshot" />
  </div>;
  if (kind === "breed") return <div className="project-art breed-art">
    <Image src="/projects/breed.png" width={1903} height={923} sizes="(max-width: 520px) 100vw, (max-width: 700px) 50vw, 430px" alt="Screenshot of Husan's Breed portfolio project, featuring a white homepage with a blue and purple hero background" className="project-screenshot" />
  </div>;
  return <div className="project-art swarovski-art">
    <Image src="/projects/swarovski.png" width={1905} height={918} sizes="(max-width: 520px) 100vw, (max-width: 700px) 50vw, 430px" alt="Screenshot of Husan's Swarovski frontend project, featuring the Spring–Summer 2025 jewelry collection" className="project-screenshot" />
  </div>;
}
