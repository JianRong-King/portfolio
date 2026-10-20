import { profile } from "../data/profile";
import { contact } from "../data/contact";
import styles from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <a href={`mailto:${contact.email}`} className={styles.name}>
        {profile.name}
      </a>
      <div className={styles.meta}>
        <span>&copy; {year} {profile.name}</span>
        <span>{contact.activeIn[0]}</span>
        <a href="#top" className={styles.top}>
          Back to top
        </a>
      </div>
    </footer>
  );
}
