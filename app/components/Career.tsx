import { career } from "../data/career";
import styles from "./Career.module.css";

export default function Career() {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Career</h2>

      <div className={styles.list}>
        {career.map((item, i) => (
          <a key={item.slug} href={`/career/${item.slug}`} className={styles.card}>
            <div className={styles.image}>
              {item.image && (
                <img
                  src={item.image}
                  alt={item.imageAlt ?? item.role}
                  className={styles.photo}
                />
              )}
              <span className={styles.viewBadge}>View role</span>
            </div>

            <div className={styles.info}>
              <div className={styles.row}>
                <div className={styles.text}>
                  <h3 className={styles.title}>{item.role}</h3>
                  {item.subtitle && (
                    <p className={styles.subtitle}>{item.subtitle}</p>
                  )}
                  <p className={styles.description}>{item.description}</p>
                </div>
                <span className={styles.index}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              {item.tags && item.tags.length > 0 && (
                <div className={styles.chips} aria-label="Skills and tech stack">
                  {item.tags.map((t) => (
                    <span key={t} className={styles.chip}>
                      {t}
                    </span>
                  ))}
                </div>
              )}
              <span className={styles.tag}>{item.period}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
