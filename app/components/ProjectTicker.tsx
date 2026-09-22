import { contributedProjects } from "../data/contributedProjects";
import styles from "./ProjectTicker.module.css";

export default function ProjectTicker() {
  return (
    <div className={styles.ticker}>
      <p className={styles.caption}>Contributed Projects</p>

      <div className={styles.row}>
        {contributedProjects.map((project) => (
          <img
            key={project.name}
            src={project.logo}
            alt={project.name}
            className={styles.logo}
          />
        ))}
      </div>
    </div>
  );
}
