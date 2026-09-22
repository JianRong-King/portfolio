import { selectedWork } from "../data/selectedWork";
import PhoneMockup from "./PhoneMockup";
import styles from "./FeaturedWork.module.css";

export default function FeaturedWork() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Selected Work</h2>
        <p className={styles.subheading}>
          While many of my projects are out in the world, but not all can be
          shared yet
        </p>
      </div>

      <div className={styles.list}>
        {selectedWork.map((item) => (
          <div key={item.slug} className={styles.card}>
            <div
              className={styles.preview}
              aria-hidden={!item.image}
              style={
                item.imageRatio
                  ? ({
                      "--preview-ratio": item.imageRatio,
                    } as React.CSSProperties)
                  : undefined
              }
            >
              {item.image &&
                (item.mockup === "phones" ? (
                  <PhoneMockup
                    src={item.image}
                    alt={item.imageAlt ?? item.title}
                    screens={item.screens}
                  />
                ) : item.image.endsWith(".mp4") ? (
                  <video
                    src={item.image}
                    aria-label={item.imageAlt ?? item.title}
                    className={styles.previewImage}
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  <img
                    src={item.image}
                    alt={item.imageAlt ?? item.title}
                    className={styles.previewImage}
                  />
                ))}
            </div>

            <div className={styles.info}>
              <div className={styles.text}>
                <h3 className={styles.title}>{item.title}</h3>
                <p className={styles.description}>{item.description}</p>
                <div className={styles.meta}>
                  <span className={styles.team}>{item.team}</span>
                  <span className={styles.tag}>{item.tag}</span>
                </div>
              </div>

              <a href={`/work/${item.slug}`} className={styles.cta}>
                View case study
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
