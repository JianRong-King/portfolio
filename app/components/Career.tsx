"use client";

import { motion } from "framer-motion";
import { career } from "../data/career";
import styles from "./Career.module.css";

export default function Career() {
  return (
    <section className={styles.section}>
      <motion.h2
        className={styles.heading}
        initial={{ opacity: 0, x: -80 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        Career
      </motion.h2>

      <div className={styles.list}>
        {career.map((item, i) => (
          <motion.div
            key={item.slug}
            className={styles.card}
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            whileHover={{ scale: 1.015 }}
          >
            <div className={styles.image}>
              {item.image && (
                <img
                  src={item.image}
                  alt={item.imageAlt ?? item.role}
                  className={
                    item.imageFit === "contain"
                      ? `${styles.photo} ${styles.photoContain}`
                      : styles.photo
                  }
                />
              )}
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
          </motion.div>
        ))}
      </div>
    </section>
  );
}
