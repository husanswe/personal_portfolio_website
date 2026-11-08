export const profile = {
  name: "Husan Suleyman",
  role: "Backend Engineer",
  github: "https://github.com/husanswe",
  telegram: "https://t.me/husanswe",
  linkedin: "https://www.linkedin.com/in/husan-suleyman-6a2495264/",
  x: "https://x.com/husanswe",
  email: "sulaymonovhusan2002@gmail.com",
};

export const skillGroups = [
  { id: "frontend", name: "Frontend", skills: ["HTML5", "CSS3", "Bootstrap 5", "Tailwind CSS 4", "JavaScript", "Vue.js"] },
  { id: "backend", name: "Backend", skills: ["PHP", "Composer", "Laravel", "Laravel Octane", "REST APIs"] },
  { id: "devops", name: "Tools & DevOps", skills: ["Apache HTTP Server", "Nginx", "Ubuntu Linux", "Docker", "XAMPP", "Postman"] },
  { id: "laravel", name: "Laravel ecosystem", skills: ["Blade", "Sanctum", "Laravel Eloquent", "Filament PHP", "Laravel Livewire", "TALL stack"] },
  { id: "testing", name: "Testing", skills: ["PHPUnit", "Pest"] },
  { id: "databases", name: "Databases", skills: ["MySQL", "PostgreSQL"] },
];

export const experience = [
  {
    id: "itransition", title: "Web Developer Intern", company: "Itransition Group", employment: "Internship",
    website: "https://www.itransition.com/",
    dates: "Jul 2025 – Aug 2025", duration: "2 mos", location: "Tashkent, Uzbekistan", arrangement: "Remote",
  },
  {
    id: "citifuel", title: "Salesperson", company: "Citifuel LLC", employment: "Full-time",
    website: "https://citifuel.com/",
    dates: "Dec 2024", duration: "1 mo", location: "Tashkent, Uzbekistan", arrangement: "On-site",
  },
  {
    id: "hermes", title: "Truck Dispatcher", company: "Hermes Express", employment: "Full-time",
    website: null,
    dates: "Nov 2023 – Oct 2024", duration: "1 yr", location: "Tashkent, Uzbekistan", arrangement: "On-site",
  },
];

export const projects = [
  {
    slug: "texmart", name: "Texmart", category: "E-commerce platform", status: "In development",
    description: "An e-commerce platform for home appliances and electronics, from PCs and phones to tablets and everyday essentials.",
    tags: ["PHP", "Laravel", "E-commerce"], url: null,
  },
  {
    slug: "klean", name: "Klean", category: "Blog platform", status: "Deployment coming soon",
    description: "A blog website built with PHP and Laravel. A place for ideas, stories, and thoughtful writing.",
    tags: ["PHP", "Laravel", "Blog"], url: null,
  },
  {
    slug: "swarovski", name: "Swarovski", category: "Jewelry storefront", status: "Live website",
    description: "A frontend recreation of the Swarovski jewelry website, built with HTML, CSS, and Tailwind CSS. Hosted on Netlify.",
    tags: ["HTML", "CSS", "Tailwind CSS", "Netlify"], url: "https://swarovski-clone.netlify.app/",
  },
  {
    slug: "breed", name: "Breed", category: "Portfolio website", status: "Live website",
    description: "A frontend recreation of the Breed portfolio template, built with HTML, CSS, and JavaScript. Hosted on Netlify.",
    tags: ["HTML", "CSS", "JavaScript", "Netlify"], url: "https://breed-portfolio-clone.netlify.app/",
  },
] as const;
