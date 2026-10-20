export type TechItem = {
  name: string;
  icon: string;
  use?: string;
};

export const primaryTech: TechItem[] = [
  { name: "Java", icon: "FaJava", use: "OOP, design patterns" },
  { name: "TypeScript", icon: "SiTypescript", use: "Angular, RxJS" },
  { name: "React", icon: "SiReact", use: "Web front ends" },
  { name: "LangGraph", icon: "SiLanggraph", use: "AI agent workflows" },
  { name: "Spring Boot", icon: "SiSpringboot", use: "REST APIs, backend" },
];

export const toolStrip: TechItem[] = [
  { name: "Figma", icon: "SiFigma" },
  { name: "Tailwind CSS", icon: "SiTailwindcss" },
  { name: "Postman", icon: "SiPostman" },
  { name: "Python", icon: "SiPython" },
  { name: "Framer", icon: "SiFramer" },
  { name: "GitHub", icon: "SiGithub" },
  { name: "JavaScript", icon: "SiJavascript" },
  { name: "Oracle", icon: "" },
  { name: "GitLab", icon: "SiGitlab" },
  { name: "Kubernetes", icon: "SiKubernetes" },
  { name: "Angular", icon: "SiAngular" },
  { name: "Claude Code", icon: "SiClaudecode" },
  { name: "Codex", icon: "" },
  { name: "AWS", icon: "" },
];
