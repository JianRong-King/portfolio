export type SelectedWorkItem = {
  slug: string;
  title: string;
  description: string;
  team: string;
  tag: string;
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
      "A full-stack web interface for realtime ASL sign language recognition. Shortlisted for BP Final Year Award Presentation 2025.",
    team: "Team: Placeholder",
    tag: "Computer Vision",
    image: "/work/sign2text-architecture.svg",
    imageAlt: "Sign2Text system architecture diagram",
    imageRatio: "1440 / 770",
  },
  {
    slug: "nutritrack",
    title: "NutriTrack",
    description:
      "Personalized AI powered nutrition tracking Android app built with Kotlin and MVVM architecture.",
    team: "Team: Placeholder",
    tag: "Mobile App",
    image: "/work/nutritrack.png",
    imageAlt: "NutriTrack app screens",
    imageRatio: "16 / 10",
    mockup: "phones",
    screens: 4,
  },
  {
    slug: "guitar-hero",
    title: "Guitar Hero",
    description:
      "A web-based Guitar Hero style game using Functional Reactive Programming in TypeScript.",
    team: "Team: Placeholder",
    tag: "Web Game",
    image: "/work/guitar-hero.mp4",
    imageAlt: "Guitar Hero style game gameplay",
    imageRatio: "2160 / 1440",
  },
  {
    slug: "santorini-game",
    title: "Santorini Game",
    description:
      "Placeholder description for this project. Replace with real project details.",
    team: "Team: Placeholder",
    tag: "Game",
    image: "/work/santorini.mp4",
    imageAlt: "Santorini board game gameplay",
    imageRatio: "1460 / 1080",
  },
];
