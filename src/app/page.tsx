import { IconArrowUpRight, IconArrowUp, IconBrandGithub, IconTerminal2, IconArrowRight, IconCircleFilled } from "@tabler/icons-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { SocialLinks } from "@/components/social-links";
import { ProjectPreview } from "@/components/project-preview";
import { GithubActivity } from "@/components/github-activity";
import { profile, projects, skillGroups, stack } from "@/lib/portfolio";

function Section({ id, number, title, children }: { id: string; number: string; title: string; children: React.ReactNode }) {
  return <section id={id} className="section-row"><div className="section-label"><span>{number}</span><h2>{title}</h2></div><div className="min-w-0">{children}</div></section>;
}

export default function Home() {
  return <>
    <a href="#main" className="skip-link">Skip to content</a>
    <div className="site-shell" id="top">
      <header className="site-header">
        <a href="#top" aria-label="Husan Suleyman, home" className="monogram">hs<span>.</span></a>
        <nav aria-label="Main navigation" className="flex items-center gap-6"><a href="#projects">Projects</a><a href="#stack">Stack</a><a href="#contact">Contact</a></nav>
        <ThemeToggle />
      </header>
      <main id="main">
        <section className="hero" aria-labelledby="name">
          <div className="hero-eyebrow"><span>PERSONAL PORTFOLIO</span><span className="hero-edition">VOL. 2026</span></div>
          <h1 id="name">Husan Suleyman<span className="name-period">.</span></h1>
          <div className="role-line"><span className="status-dot" /><span>Junior backend engineer</span><span className="role-divider">/</span><span className="role-stack">PHP & Laravel</span></div>
          <div className="about-copy" aria-label="About me">
            <p>I love building things and solving problems. I enjoy working on backend systems, building SaaS products, and developing scalable backend solutions that people actually use. I care about performance, clean architecture, and code that just works.</p>
            <p>I do my best work on small teams that ship often and obsess over the details. If I&apos;m not coding, I&apos;m probably exploring new dev tools, deep in a tech talk, or working on my next SaaS idea.</p>
          </div>
          <SocialLinks />
          <div className="hero-bottom"><span>Thoughtful code. Useful products.</span><a href="#projects">Explore my work <IconArrowRight size={13} aria-hidden="true" /></a></div>
        </section>

        <Section id="projects" number="01" title="Projects">
          <div className="section-intro"><p>A few things I&apos;ve been building.</p><span>03 PROJECTS</span></div>
          <div className="project-grid">
            {projects.map((project, index) => <article key={project.slug} className={`project-card ${index === 2 ? "project-wide" : ""}`}>
              {project.url ? <a href={project.url} target="_blank" rel="noopener noreferrer" className="art-link" aria-label={`Visit ${project.name}, opens in a new tab`}><ProjectPreview kind={project.slug} /><span className="preview-open"><IconArrowUpRight size={17} /></span></a> : <ProjectPreview kind={project.slug} />}
              <div className="project-info"><div className="project-meta"><span>{project.category}</span><span className={`project-status ${project.url ? "is-live" : ""}`}><IconCircleFilled size={5} />{project.status}</span></div>
              <h3>{project.url ? <a href={project.url} target="_blank" rel="noopener noreferrer">{project.name}<IconArrowUpRight size={18} /></a> : project.name}</h3>
              <p>{project.description}</p><div className="project-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div>
            </article>)}
          </div>
          <p className="project-footnote"><span className="tiny-line" />Project covers are illustrative. Klean and Texmart will be live soon.</p>
        </Section>

        <Section id="activity" number="02" title="Activity"><GithubActivity /></Section>

        <Section id="stack" number="03" title="Tech stack">
          <div className="section-intro"><p>The tools behind the work.</p><IconTerminal2 size={17} stroke={1.5} /></div>
          <div className="terminal"><div className="terminal-heading"><span className="terminal-dots"><i /><i /><i /></span><span>stack.json</span><span>~/husan</span></div>
            <div className="terminal-command"><span>husan@portfolio</span><span className="text-muted">:~$</span> cat stack.json</div>
            <div className="stack-code"><span className="bracket">{"{"}</span>{stack.map((group, index) => <div className="stack-row" key={group.key}><span className="stack-key">&quot;{group.key}&quot;</span><span>: [ </span><span>{group.values.map((value, valueIndex) => <span key={value}><span className="stack-value">&quot;{value}&quot;</span>{valueIndex < group.values.length - 1 ? ", " : ""}</span>)}</span><span> ]{index < stack.length - 1 ? "," : ""}</span></div>)}<span className="bracket">{"}"}</span></div>
            <div className="terminal-bottom"><span><span className="status-dot" />Always learning</span><span>UTF-8 · JSON</span></div>
          </div>
        </Section>

        <Section id="skills" number="04" title="Skills">
          <div className="section-intro"><p>My growing engineering toolkit.</p></div>
          <div className="skills-list">{skillGroups.map(group => <div key={group.name} className="skill-group"><h3>{group.name}</h3><ul className="flex flex-wrap gap-2">{group.skills.map(skill => <li className="skill-chip" key={skill}>{skill}</li>)}</ul></div>)}</div>
        </Section>

        <Section id="languages" number="05" title="Languages"><div className="languages-grid">{[{ name: "Uzbek", code: "UZ", level: "Native", detail: "My first language" }, { name: "Russian", code: "RU", level: "Fluent", detail: "Comfortable in conversation" }, { name: "English", code: "EN", level: "B2", detail: "Upper intermediate" }].map(language => <div className="language" key={language.name}><span className="language-code">{language.code}</span><h3>{language.name}</h3><p>{language.level}<span>{language.detail}</span></p></div>)}</div></Section>

        <Section id="contact" number="06" title="Get in touch"><div className="contact-content"><span className="contact-eyebrow">HAVE SOMETHING IN MIND?</span><h2>Let&apos;s build something<br />that works<span>.</span></h2><p>A project, an opportunity, or a good conversation.<br className="hidden sm:block" /> My inbox is always open.</p><a href={`mailto:${profile.email}`} className="contact-link">Say hello <IconArrowUpRight size={18} /></a><a href={`mailto:${profile.email}`} className="email-link">{profile.email}</a></div></Section>
      </main>
      <footer className="site-footer"><span>© {new Date().getFullYear()} Husan Suleyman</span><div><a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="Husan on GitHub"><IconBrandGithub size={16} /></a><span className="footer-divider" /><a href="#top">Back to top <IconArrowUp size={12} /></a></div></footer>
    </div>
  </>;
}
