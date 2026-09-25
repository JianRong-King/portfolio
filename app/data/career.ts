export type CareerItem = {
  slug: string;
  role: string;
  subtitle?: string;
  description: string;
  period: string;
  image?: string;
  imageAlt?: string;
  imageFit?: "cover" | "contain";
  tags?: string[];
};

export const career: CareerItem[] = [
  {
    slug: "ifast-global-hub-ai",
    role: "Software Engineering Intern @iFAST Global Hub AI",
    description:
      "Developed production-grade fintech applications and AI solutions. Worked across the full SDLC and delivered multiple projects end-to-end, spanning backend, frontend, database development, automation, and AI optimisation.",
    period: "Nov 2025 — Feb 2026",
    image: "/career/ifast.webp",
    imageAlt: "iFAST Global Hub AI",
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
      "Loved learning the fundamentals, writing code from scratch, and figuring out solutions through the pre-AI era of coding. Then embracing AI and explored how it reshaped the way I learn and build as I approached the end of my university journey.",
    period: "2023 — Present",
    image: "/career/monash.jpeg",
    imageAlt: "Monash University",
  },
  {
    slug: "research-assistant-monash",
    role: "Research Assistant @Monash University Malaysia",
    description:
      "Worked with Monash researchers on machine learning research in time-series data, using deep learning and diffusion models to predict equipment failure and simulate system degradation. From reading foundational papers to evaluating results and contributing to a research paper.",
    period: "2024 — 2025",
    image: "/career/monash-logo.svg",
    imageAlt: "Monash University logo",
    imageFit: "contain",
  },
];
