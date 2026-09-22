import {
  SiReact,
  SiNodedotjs,
  SiTypescript,
  SiMongodb,
  SiFigma,
  SiVite,
  SiTailwindcss,
  SiPostman,
  SiPython,
  SiFramer,
  SiGithub,
  SiJavascript,
  SiGitlab,
  SiKubernetes,
  SiAngular,
  SiClaudecode,
} from "react-icons/si";
import { FaJava } from "react-icons/fa";
import type { IconType } from "react-icons";
import { primaryTech, toolStrip, type TechItem } from "../data/techStack";
import styles from "./TechStack.module.css";

const icons: Record<string, IconType> = {
  SiReact,
  SiNodedotjs,
  SiTypescript,
  SiMongodb,
  FaJava,
  SiFigma,
  SiVite,
  SiTailwindcss,
  SiPostman,
  SiPython,
  SiFramer,
  SiGithub,
  SiJavascript,
  SiGitlab,
  SiKubernetes,
  SiAngular,
  SiClaudecode,
};

function Icon({ item }: { item: TechItem }) {
  const IconComp = icons[item.icon];
  if (!IconComp) return null;
  return <IconComp color={item.color} />;
}

export default function TechStack() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>
          Tech Stack <span className={styles.accent}>&amp; Tools</span>
        </h2>

        <div className={styles.grid}>
          {primaryTech.map((item) => (
            <div key={item.name} className={styles.card}>
              <div className={styles.tile}>
                <Icon item={item} />
              </div>
              <span className={styles.label}>{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.strip}>
        <div className={styles.marquee}>
          <div className={styles.track}>
            {[...toolStrip, ...toolStrip].map((item, i) => (
              <span key={`${item.name}-${i}`} className={styles.stripItem}>
                <Icon item={item} />
                {item.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
