import { IconCode, IconDatabase, IconPalette, IconServer2, IconSettings, IconTool } from "@tabler/icons-react";
import { skillGroups } from "@/lib/portfolio";

const categoryIcons = {
  frontend: IconPalette,
  backend: IconDatabase,
  devops: IconTool,
  laravel: IconCode,
  testing: IconSettings,
  databases: IconServer2,
};

export function SkillsTechnologies() {
  return <section id="stack" className="skills-section" aria-labelledby="skills-heading">
    <span id="skills" className="section-anchor" aria-hidden="true" />
    <h2 id="skills-heading">Skills &amp; Technologies</h2>
    <div className="skills-heading-accent" aria-hidden="true" />
    <div className="tech-stack-grid">
      {skillGroups.map(({ id, name, skills }) => {
        const Icon = categoryIcons[id as keyof typeof categoryIcons];
        return <article className="tech-card" key={id}>
          <h3><Icon className="tech-card-icon" size={21} stroke={1.7} aria-hidden="true" />{name}</h3>
          <ul className="tech-badges">{skills.map(skill => <li key={skill}>{skill}</li>)}</ul>
        </article>;
      })}
    </div>
  </section>;
}
