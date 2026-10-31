import { IconBrandGithub, IconBrandTelegram, IconBrandLinkedin, IconBrandX, IconMail } from "@tabler/icons-react";
import { profile } from "@/lib/portfolio";

const socials = [
  { name: "GitHub", href: profile.github, icon: IconBrandGithub },
  { name: "Telegram", href: profile.telegram, icon: IconBrandTelegram },
  { name: "LinkedIn", href: profile.linkedin, icon: IconBrandLinkedin },
  { name: "X", href: profile.x, icon: IconBrandX },
  { name: "Email", href: `mailto:${profile.email}`, icon: IconMail },
];

export function SocialLinks() {
  return <div className="flex flex-wrap gap-2" aria-label="Find me online">
    {socials.map(({ name, href, icon: Icon }) => <a className="social-link" href={href} key={name} target={name === "Email" ? undefined : "_blank"} rel={name === "Email" ? undefined : "noopener noreferrer"}><Icon size={15} stroke={1.7} aria-hidden="true" />{name}</a>)}
  </div>;
}
