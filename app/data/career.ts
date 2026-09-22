export type CareerItem = {
  slug: string;
  role: string;
  subtitle?: string;
  description: string;
  period: string;
  image?: string;
  imageAlt?: string;
  tags?: string[];
};

export const career: CareerItem[] = [
  {
    slug: "ifast-global-hub-ai",
    role: "Software Engineering Intern @iFAST Global Hub AI",
    description:
      "Placeholder description for this role. Replace with real responsibilities and highlights.",
    period: "Nov 2025 — Feb 2026",
    tags: [
      "Full-Stack",
      "Angular",
      "Spring Boot",
      "Agentic Test Automation",
      "RAG",
      "AI Chatbot",
    ],
  },
  {
    slug: "monash-university",
    role: "Monash University",
    subtitle: "CS Grad",
    description:
      "Placeholder description for this role. Replace with real responsibilities and highlights.",
    period: "2023 — Present",
    image: "/career/monash.jpeg",
    imageAlt: "Monash University",
  },
  {
    slug: "research-assistant-monash",
    role: "Research Assistant @Monash University Malaysia",
    description:
      "Placeholder description for this role. Replace with real responsibilities and highlights.",
    period: "2024 — 2025",
  },
];
