import { profile } from "../data/profile";
import ProjectTicker from "./ProjectTicker";
import styles from "./Intro.module.css";

export default function Intro() {
  return (
    <section className={styles.section}>
      <div className={styles.content}>
        <h1 className={styles.name}>
          <span className={styles.greeting}>{profile.greeting}</span>
          {profile.name}
        </h1>

        <p className={styles.tags}>{profile.tags.join(" • ")}</p>

        <p className={styles.bio}>
          {profile.bioPrefix}
          <span className={styles.highlight}>{profile.bioHighlight}</span>
          {profile.bioSuffix}
        </p>
      </div>

      <ProjectTicker />
    </section>
  );
}
