import { IconDatabase, IconPalette, IconServer2, IconTool } from "@tabler/icons-react";
import { stack } from "@/lib/portfolio";

const categories = [
  { key: "Frontend", title: "Frontend", icon: IconPalette },
  { key: "Backend", title: "Backend", icon: IconServer2 },
  { key: "Databases", title: "Databases", icon: IconDatabase },
  { key: "Technologies & DevOps", title: "Tools & DevOps", icon: IconTool },
];

export function TechStack() {
  return <div className="tech-stack-grid">
    {categories.map(({ key, title, icon: Icon }) => {
      const group = stack.find(group => group.key === key)!;
      return <article className="tech-card" key={key}>
        <h3><Icon className="tech-card-icon" size={21} stroke={1.7} aria-hidden="true" />{title}</h3>
        <ul className="tech-badges">{group.values.map(value => <li key={value}>{value}</li>)}</ul>
      </article>;
    })}
  </div>;
}
