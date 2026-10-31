import Image from "next/image";
import { IconArrowUpRight, IconCode, IconDeviceLaptop, IconHeadphones, IconShoppingBag, IconSearch } from "@tabler/icons-react";

// Unpublished projects use illustrative covers; Swarovski uses the supplied screenshot.
export function ProjectPreview({ kind }: { kind: string }) {
  if (kind === "texmart") return <div className="project-art texmart-art" aria-label="Illustrative Texmart project cover">
    <div className="preview-toolbar"><span className="texmart-brand">texmart<span>®</span></span><span className="preview-search"><IconSearch size={9} />Find your next upgrade</span><IconShoppingBag size={12} /></div>
    <div className="texmart-inner"><span className="preview-eyebrow">A little more possibility.</span><strong>Your everyday.<br />Upgraded.</strong><div className="mini-button">Explore electronics <IconArrowUpRight size={8} /></div></div>
    <div className="product-orbit"><div className="orbit-ring" /><IconDeviceLaptop className="product-laptop" stroke={0.8} /><IconHeadphones className="product-headphones" stroke={1.1} /></div>
    <div className="art-caption">ELECTRONICS / HOME / MORE</div>
  </div>;
  if (kind === "klean") return <div className="project-art klean-art" aria-label="Illustrative Klean project cover">
    <div className="klean-toolbar"><span>klean<span className="klean-dot">.</span></span><span>Thoughts, well collected.</span><IconArrowUpRight size={13} /></div>
    <div className="klean-inner"><span className="preview-eyebrow">THE ART OF KEEPING IT SIMPLE</span><strong>Good ideas.<br />A clean space.</strong><div className="klean-lines"><i /><i /><i /></div></div>
    <div className="paper-stack"><div /><div /><div><IconCode size={33} stroke={1} /><span>Ideas worth<br />putting into words.</span></div></div>
    <div className="art-caption">A JOURNAL BUILT WITH LARAVEL</div>
  </div>;
  return <div className="project-art swarovski-art">
    <Image src="/projects/swarovski.png" width={1905} height={918} sizes="(max-width: 520px) 100vw, (max-width: 700px) 50vw, 430px" alt="Screenshot of Husan's Swarovski frontend project, featuring the Spring–Summer 2025 jewelry collection" className="project-screenshot" />
  </div>;
}
