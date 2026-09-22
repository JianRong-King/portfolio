export type TechItem = {
  name: string;
  icon: string;
  color: string;
};

export const primaryTech: TechItem[] = [
  { name: "Java", icon: "FaJava", color: "#E76F00" },
  { name: "TypeScript", icon: "SiTypescript", color: "#3178C6" },
  { name: "React", icon: "SiReact", color: "#61DAFB" },
  { name: "Node.js", icon: "SiNodedotjs", color: "#5FA04E" },
  { name: "MongoDB", icon: "SiMongodb", color: "#47A248" },
];

export const toolStrip: TechItem[] = [
  { name: "Figma", icon: "SiFigma", color: "#F24E1E" },
  { name: "Tailwind CSS", icon: "SiTailwindcss", color: "#06B6D4" },
  { name: "Postman", icon: "SiPostman", color: "#FF6C37" },
  { name: "Python", icon: "SiPython", color: "#3776AB" },
  { name: "Framer", icon: "SiFramer", color: "#0055FF" },
  { name: "GitHub", icon: "SiGithub", color: "var(--ink-strong)" },
  { name: "JavaScript", icon: "SiJavascript", color: "#F7DF1E" },
  { name: "Oracle", icon: "", color: "var(--text-muted)" },
  { name: "GitLab", icon: "SiGitlab", color: "#FC6D26" },
  { name: "Kubernetes", icon: "SiKubernetes", color: "#326CE5" },
  { name: "Angular", icon: "SiAngular", color: "#DD0031" },
  { name: "Claude Code", icon: "SiClaudecode", color: "#D97757" },
  { name: "Codex", icon: "", color: "var(--text-muted)" },
  { name: "AWS", icon: "", color: "var(--text-muted)" },
];
