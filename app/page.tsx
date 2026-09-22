import Intro from "./components/Intro";
import TechStack from "./components/TechStack";
import Career from "./components/Career";
import FeaturedWork from "./components/FeaturedWork";

export default function Home() {
  return (
    <main>
      <Intro />
      <TechStack />
      <Career />
      <FeaturedWork />
    </main>
  );
}
