import { profile } from "../data/profile";
import ProjectTicker from "./ProjectTicker";
import styles from "./Intro.module.css";

export default function Intro() {
  return (
    <section className={styles.section}>
      <div className={styles.content}>
        <div className={styles.title}>
          <h1 className={styles.name}>
            <span className={styles.greeting}>{profile.greeting} </span>
            {profile.nameLines.map((line, i) => (
              <span key={line} className={styles.line}>
                <span
                  data-line
                  style={{ "--i": i } as React.CSSProperties}
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>
          <p className={styles.facts}>
            {profile.facts.map((fact) => (
              <span key={fact}>{fact}</span>
            ))}
          </p>
        </div>
      </div>

      <ProjectTicker />
    </section>
  );
}
