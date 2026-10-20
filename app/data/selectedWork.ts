export type SelectedWorkItem = {
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  tag?: string;
  techStack?: string[];
  caseStudyUrl?: string;
  liveUrl?: string;
  image?: string;
  poster?: string;
  imageAlt?: string;
  imageRatio?: string;
  mockup?: "phones";
  screens?: number;
  gallery?: { src: string; alt: string; position?: string }[];
};

export const selectedWork: SelectedWorkItem[] = [
  {
    slug: "askmh",
    title: "AskMH",
    subtitle: "Full-Stack RAG Chatbot Web App",
    description:
      "An agentic RAG chatbot that answers Malaysia Airlines passenger questions using their web FAQ as its knowledge base. Under the hood, a LangGraph state machine routes each message, retrieves and grades relevant articles, and generates grounded answers.",
    techStack: ["Python", "FastAPI", "LangGraph", "RAG", "Docker", "Agent Orchestration"],
    caseStudyUrl: "https://github.com/JianRong-King/AskMH",
    liveUrl: "https://askmh-194250607947.asia-southeast1.run.app/",
    image: "/work/askmh.webp",
    imageAlt: "AskMH landing page, a Malaysia Airlines FAQ assistant",
    imageRatio: "1440 / 770",
    gallery: [
      {
        src: "/work/askmh.webp",
        alt: "AskMH landing page, a Malaysia Airlines FAQ assistant",
      },
      {
        src: "/work/askmh-chat.webp",
        alt: "AskMH chat answering a delayed baggage question with cited FAQ sources",
      },
    ],
  },
  {
    slug: "sign2text",
    title: "Sign2Text",
    description:
      "A full-stack web interface for realtime ASL sign language recognition, built to translate sign language gestures into text in real time.\nShortlisted for BP Final Year Award Presentation 2025.",
    techStack: ["Python", "PyTorch", "Docker", "WebSocket"],
    caseStudyUrl: "https://github.com/dboo0012/sign2text",
    image: "/work/sign2text-architecture.svg",
    imageAlt: "Sign2Text system architecture diagram",
    imageRatio: "1440 / 770",
    gallery: [
      {
        src: "/work/sign2text-presentation.webp",
        alt: "King Jian Rong presenting Sign2Text at the FYP Final Award Presentation",
      },
      {
        src: "/work/sign2text-architecture.svg",
        alt: "Sign2Text system architecture diagram",
      },
    ],
  },
  {
    slug: "nutritrack",
    title: "AI-Powered NutriTrack",
    subtitle: "Mobile App",
    description:
      "NutriTrack Pro is a personalized nutrition tracking Android application developed using Kotlin, Jetpack Compose, RoomDB, and MVVM architecture.",
    techStack: ["Kotlin", "MVVM", "AI Suggestion", "Social Leaderboard", "Gradle", "Android Studio"],
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
    poster: "/work/guitar-hero-poster.jpg",
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
    poster: "/work/santorini-poster.jpg",
    imageAlt: "Santorini board game gameplay",
    imageRatio: "1460 / 1080",
  },
];
