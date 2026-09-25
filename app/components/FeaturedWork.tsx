"use client";

import { motion } from "framer-motion";
import { FaGithub } from "react-icons/fa";
import { selectedWork } from "../data/selectedWork";
import PhoneMockup from "./PhoneMockup";
import styles from "./FeaturedWork.module.css";

export default function FeaturedWork() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <motion.h2
          className={styles.heading}
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          Selected Work
        </motion.h2>
        <p className={styles.subheading}>
          While many of my projects are out in the world, but not all can be
          shared yet
        </p>
      </div>

      <div className={styles.list}>
        {selectedWork.map((item) => (
          <motion.div
            key={item.slug}
            className={styles.card}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
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
                <h3 className={styles.title}>
                  {item.title}
                  {item.subtitle && (
                    <span className={styles.subtitle}> {item.subtitle}</span>
                  )}
                </h3>
                <p className={styles.description}>{item.description}</p>
                {item.techStack && item.techStack.length > 0 && (
                  <div className={styles.chips} aria-label="Tech stack">
                    {item.techStack.map((t) => (
                      <span key={t} className={styles.chip}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                {item.tag && (
                  <div className={styles.meta}>
                    <span className={styles.tag}>{item.tag}</span>
                  </div>
                )}
              </div>

              {item.caseStudyUrl && (
                <a
                  href={item.caseStudyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.cta}
                >
                  <FaGithub aria-hidden="true" />
                  GitHub
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
