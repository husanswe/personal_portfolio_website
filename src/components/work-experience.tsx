import { IconDiamond } from "@tabler/icons-react";
import { experience } from "@/lib/portfolio";

export function WorkExperience() {
  return <section id="experience" className="experience-section" aria-labelledby="experience-heading">
    <div className="experience-panel">
      <h2 id="experience-heading">Experience</h2>
      <ol className="experience-list">
        {experience.map(job => <li className="experience-job" key={job.id}>
          <div className={`company-logo company-logo-${job.id}`} aria-hidden="true" />
          <div className="experience-details">
            <h3>{job.title}</h3>
            <p className="experience-company">{job.company}<span> · </span>{job.employment}</p>
            <p className="experience-meta">{job.dates}<span> · </span>{job.duration}</p>
            <p className="experience-meta">{job.location}<span> · </span>{job.arrangement}</p>
            <p className="experience-description">{job.description}</p>
            {job.skills ? <p className="experience-skills"><IconDiamond size={16} stroke={1.8} aria-hidden="true" />{job.skills}</p> : null}
          </div>
        </li>)}
      </ol>
    </div>
  </section>;
}
