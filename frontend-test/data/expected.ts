export type MediaKind = "gallery" | "image" | "phones" | "video";

export const expected = {
  nav: {
    homeLabel: "King Jian Rong, home",
    links: [
      { label: "Career", href: "#career" },
      { label: "Projects", href: "#work" },
      { label: "Contact", href: "#contact" },
    ],
  },

  intro: {
    greeting: "Hello! I'm",
    name: "King Jian Rong",
    facts: ["22 • Malaysia", "CS Grad / AI / Full Stack"],
  },

  ticker: {
    caption: "Contributed projects",
    logos: ["FSMOne", "iFAST Global Bank", "Monash University"],
  },

  techStack: {
    heading: "Tech stack and tools",
    primary: [
      { name: "Java", use: "OOP, design patterns" },
      { name: "TypeScript", use: "Angular, RxJS" },
      { name: "React", use: "Web front ends" },
      { name: "LangGraph", use: "AI agent workflows" },
      { name: "Spring Boot", use: "REST APIs, backend" },
    ],
    tools: [
      "Figma",
      "Tailwind CSS",
      "Postman",
      "Python",
      "Framer",
      "GitHub",
      "JavaScript",
      "Oracle",
      "GitLab",
      "Kubernetes",
      "Angular",
      "Claude Code",
      "Codex",
      "AWS",
    ],
  },

  career: {
    heading: "Career",
    items: [
      { org: "Monash University", role: "Computer Science", period: "2023 – present" },
      { org: "iFAST Global Hub AI", role: "Software Engineering Intern", period: "Nov 2025 – Feb 2026" },
      { org: "Monash Malaysia", role: "Research Assistant", period: "2024 – 2025" },
    ],
  },

  projects: {
    heading: "Projects",
    items: [
      {
        title: "AskMH",
        description: "An agentic RAG chatbot",
        media: { kind: "gallery", name: "AskMH pictures" },
      },
      {
        title: "JustPay",
        description: "A multi-currency wallet REST API",
        media: { kind: "image", name: "JustPay logo" },
      },
      {
        title: "Sign2Text",
        description: "realtime ASL sign language recognition",
        media: { kind: "gallery", name: "Sign2Text pictures" },
      },
      {
        title: "AI-Powered NutriTrack",
        description: "personalized nutrition tracking Android application",
        media: { kind: "phones", name: "NutriTrack app screens" },
      },
      {
        title: "Guitar Hero",
        description: "Developed a Guitar Hero game clone",
        media: { kind: "video", name: "Guitar Hero style game gameplay" },
      },
      {
        title: "Santorini Game",
        description: "A Java-based board game",
        media: { kind: "video", name: "Santorini board game gameplay" },
      },
    ] satisfies { title: string; description: string; media: { kind: MediaKind; name: string } }[],
  },

  contact: {
    heading: "Get in touch",
    linkedin: { label: "Jian Rong King", url: "https://www.linkedin.com/in/jianrong-king" },
    github: { label: "JianRong-King", url: "https://github.com/JianRong-King" },
    email: "kingjianrong3249@gmail.com",
    activeIn: ["Kuala Lumpur - Malaysia", "Singapore - Singapore"],
    mapTitle: "Map showing Kuala Lumpur, Malaysia",
  },

  footer: {
    name: "King Jian Rong",
    location: "Kuala Lumpur - Malaysia",
    backToTop: "Back to top",
  },
} as const;
