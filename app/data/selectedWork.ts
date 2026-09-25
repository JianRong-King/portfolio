export type SelectedWorkItem = {
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  tag?: string;
  techStack?: string[];
  caseStudyUrl?: string;
  image?: string;
  imageAlt?: string;
  imageRatio?: string;
  mockup?: "phones";
  screens?: number;
};

export const selectedWork: SelectedWorkItem[] = [
  {
    slug: "sign2text",
    title: "Sign2Text",
    description:
      "A full-stack web interface for realtime ASL sign language recognition, built to translate sign language gestures into text in real time.\nShortlisted for BP Final Year Award Presentation 2025.",
    techStack: ["React", "Docker", "FastAPI", "WebSocket", "Model Deployment"],
    caseStudyUrl: "https://github.com/dboo0012/sign2text",
    image: "/work/sign2text-architecture.svg",
    imageAlt: "Sign2Text system architecture diagram",
    imageRatio: "1440 / 770",
  },
  {
    slug: "nutritrack",
    title: "AI-Powered NutriTrack",
    subtitle: "Mobile App",
    description:
      "Personalized AI powered nutrition tracking Android app built with Kotlin and MVVM architecture, using a Repository → ViewModel → DAO pattern with RoomDB. Handles API communication via Retrofit + Coroutines, multi-user login with persistent sessions, and integrates the Gemini GenAI API for dynamic nutrition tips alongside FruityVice for real-time fruit data.",
    techStack: ["Kotlin", "MVVM", "AI Suggestion", "Social Leaderboard"],
    caseStudyUrl: "https://github.com/JianRong-King/AI-Nutrition-Android-Mobile-App",
    image: "/work/nutritrack.png",
    imageAlt: "NutriTrack app screens",
    imageRatio: "16 / 10",
    mockup: "phones",
    screens: 4,
  },
  {
    slug: "guitar-hero",
    title: "Guitar Hero",
    subtitle: "Web Game",
    description:
      "Developed a Guitar Hero game clone, that allows users to play guitar notes using their keyboard using asynchronous and functional programming. Leveraging RxJS observables for real-time input, animation, and pure state management.",
    techStack: ["Functional Programming", "TypeScript", "HTML", "CSS", "RxJS"],
    image: "/work/guitar-hero.mp4",
    imageAlt: "Guitar Hero style game gameplay",
    imageRatio: "2160 / 1440",
  },
  {
    slug: "santorini-game",
    title: "Santorini Game",
    description:
      "A Java-based board game built with OOP design, SOLID principles, and design patterns. Architecture was iteratively refined using UML diagrams and CRC cards, with full gameplay logic for player turns, movement, building mechanics, and win conditions.",
    techStack: ["Java", "OOP", "User Story"],
    caseStudyUrl: "https://github.com/JianRong-King/Santorini",
    image: "/work/santorini.mp4",
    imageAlt: "Santorini board game gameplay",
    imageRatio: "1460 / 1080",
  },
];
