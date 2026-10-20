import Intro from "./components/Intro";
import TechStack from "./components/TechStack";
import Career from "./components/Career";
import FeaturedWork from "./components/FeaturedWork";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main id="top">
      <Intro />
      <TechStack />
      <Career />
      <FeaturedWork />
      <Contact />
      <Footer />
    </main>
  );
}
