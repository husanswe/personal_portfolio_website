export const profile = {
  name: "Husan Suleyman",
  role: "Junior backend engineer",
  github: "https://github.com/husanswe",
  telegram: "https://t.me/husanswe",
  linkedin: "https://www.linkedin.com/in/husan-suleyman-6a2495264/",
  x: "https://x.com/husanswe",
  email: "sulaymonovhusan2002@gmail.com",
};

export const stack = [
  { key: "Backend", values: ["PHP", "Laravel"] },
  { key: "Frontend", values: ["HTML5", "CSS3", "Bootstrap 5", "Tailwind CSS 4", "JavaScript", "Vue.js"] },
  { key: "Databases", values: ["MySQL", "PostgreSQL"] },
  { key: "Technologies & DevOps", values: ["Apache", "Nginx", "Ubuntu Linux"] },
];

export const skillGroups = [
  { name: "Backend & ecosystem", skills: ["PHP", "Composer", "Laravel", "Laravel Octane", "Blade", "Sanctum", "Laravel Eloquent", "REST APIs", "Filament PHP", "Laravel Livewire", "TALL stack"] },
  { name: "Data & infrastructure", skills: ["MySQL", "PostgreSQL", "Apache HTTP Server", "Nginx", "Ubuntu Linux", "Docker", "XAMPP"] },
  { name: "Testing", skills: ["PHPUnit", "Pest"] },
  { name: "Frontend", skills: ["HTML5", "CSS3", "Bootstrap 5", "Tailwind CSS", "JavaScript", "Vue.js"] },
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
] as const;
