import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";
import { contact } from "../data/contact";
import styles from "./Contact.module.css";

export default function Contact() {
  return (
    <section id="contact" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.info}>
          <h2 className={styles.heading}>Get in touch</h2>

          <dl className={styles.list}>
            <div className={styles.item}>
              <dt className={styles.label}>LinkedIn</dt>
              <dd>
                <a
                  href={contact.linkedin.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.value}
                >
                  <FaLinkedin aria-hidden="true" />
                  {contact.linkedin.label}
                </a>
              </dd>
            </div>

            <div className={styles.item}>
              <dt className={styles.label}>GitHub</dt>
              <dd>
                <a
                  href={contact.github.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.value}
                >
                  <FaGithub aria-hidden="true" />
                  {contact.github.label}
                </a>
              </dd>
            </div>

            <div className={styles.item}>
              <dt className={styles.label}>Email</dt>
              <dd>
                <a href={`mailto:${contact.email}`} className={styles.value}>
                  <FaEnvelope aria-hidden="true" />
                  {contact.email}
                </a>
              </dd>
            </div>

            <div className={styles.item}>
              <dt className={styles.label}>Active in</dt>
              <dd className={styles.activeIn}>
                {contact.activeIn.map((place) => (
                  <span key={place}>{place}</span>
                ))}
              </dd>
            </div>
          </dl>
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
