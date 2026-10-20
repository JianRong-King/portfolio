"use client";

import { motion } from "framer-motion";
import { career } from "../data/career";
import styles from "./Career.module.css";

const ease = [0.16, 1, 0.3, 1] as const;

export default function Career() {
  return (
    <section id="career" className={styles.section}>
      <motion.h2
        className={styles.heading}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.7, ease }}
      >
        Career
      </motion.h2>

      <ol className={styles.list}>
        {career.map((item) => (
          <motion.li
            key={item.slug}
            className={styles.row}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease }}
          >
            <div
              className={
                item.imageFit === "contain"
                  ? `${styles.thumb} ${styles.thumbPaper}`
                  : styles.thumb
              }
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.imageAlt ?? item.org}
                  loading="lazy"
                  className={
                    item.imageFit === "contain"
                      ? `${styles.photo} ${styles.photoContain}`
                      : styles.photo
                  }
                />
              )}
            </div>

            <div className={styles.head}>
              <h3 className={styles.title}>{item.org}</h3>
              <p className={styles.role}>{item.role}</p>
            </div>

            <p className={styles.period}>{item.period}</p>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
