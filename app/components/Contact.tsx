import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";
import { contact } from "../data/contact";
import styles from "./Contact.module.css";

export default function Contact() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.info}>
          <h2 className={styles.heading}>
            Get in <span className={styles.accent}>touch!</span>
          </h2>

          <div className={styles.list}>
            <div className={styles.item}>
              <span className={styles.label}>LinkedIn</span>
              <a
                href={contact.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.value}
              >
                <span className={styles.iconTile}>
                  <FaLinkedin />
                </span>
                {contact.linkedin.label}
              </a>
            </div>

            <div className={styles.item}>
              <span className={styles.label}>Github</span>
              <a
                href={contact.github.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.value}
              >
                <span className={styles.iconTile}>
                  <FaGithub />
                </span>
                {contact.github.label}
              </a>
            </div>

            <div className={styles.item}>
              <span className={styles.label}>Email</span>
              <a href={`mailto:${contact.email}`} className={styles.value}>
                <span className={styles.iconTile}>
                  <FaEnvelope />
                </span>
                {contact.email}
              </a>
            </div>

            <div className={styles.item}>
              <span className={styles.label}>Active in</span>
              <div className={styles.activeIn}>
                {contact.activeIn.map((place) => (
                  <span key={place}>{place}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.mapCard}>
          <iframe
            src={contact.mapEmbedSrc}
            className={styles.map}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Map showing Kuala Lumpur, Malaysia"
          />
        </div>
      </div>
    </section>
  );
}
