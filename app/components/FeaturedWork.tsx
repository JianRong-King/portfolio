"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  FaGithub,
  FaArrowLeft,
  FaArrowRight,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { selectedWork } from "../data/selectedWork";
import PhoneMockup from "./PhoneMockup";
import styles from "./FeaturedWork.module.css";

const ease = [0.16, 1, 0.3, 1] as const;

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.7, delay, ease },
});

function Gallery({
  slides,
  title,
}: {
  slides: { src: string; alt: string }[];
  title: string;
}) {
  const [index, setIndex] = useState(0);
  const touchX = useRef<number | null>(null);
  const go = (step: number) =>
    setIndex((i) => Math.min(Math.max(i + step, 0), slides.length - 1));

  return (
    <div
      className={styles.gallery}
      role="region"
      aria-roledescription="carousel"
      aria-label={`${title} pictures`}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(-1);
        if (e.key === "ArrowRight") go(1);
      }}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <div
        className={styles.track}
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            className={styles.slide}
            aria-hidden={i !== index}
          />
        ))}
      </div>

      {index > 0 && (
        <button
          type="button"
          className={`${styles.arrow} ${styles.arrowLeft}`}
          onClick={() => go(-1)}
          aria-label="Previous picture"
        >
          <FaArrowLeft aria-hidden="true" />
        </button>
      )}
      {index < slides.length - 1 && (
        <button
          type="button"
          className={`${styles.arrow} ${styles.arrowRight}`}
          onClick={() => go(1)}
          aria-label="Next picture"
        >
          <FaArrowRight aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

export default function FeaturedWork() {
  return (
    <section id="work" className={styles.section}>
      <div className={styles.header}>
        <motion.h2 className={styles.heading} {...rise()}>
          Projects
        </motion.h2>
      </div>

      <div className={styles.list}>
        {selectedWork.map((item) => (
          <article key={item.slug} className={styles.card}>
            <motion.div
              className={styles.preview}
              aria-hidden={!item.image}
              style={
                item.imageRatio
                  ? ({
                      "--preview-ratio": item.imageRatio,
                    } as React.CSSProperties)
                  : undefined
              }
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.9, ease }}
            >
              {item.gallery && item.gallery.length > 1 ? (
                <Gallery slides={item.gallery} title={item.title} />
              ) : (
                item.image &&
                (item.mockup === "phones" ? (
                  <PhoneMockup
                    src={item.image}
                    alt={item.imageAlt ?? item.title}
                    screens={item.screens}
                  />
                ) : item.image.endsWith(".mp4") ? (
                  <video
                    src={item.image}
                    poster={item.poster}
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
                    loading="lazy"
                    className={styles.previewImage}
                  />
                ))
              )}
            </motion.div>

            <div className={styles.info}>
              <div className={styles.text}>
                <motion.h3 className={styles.title} {...rise()}>
                  {item.title}
                  {item.subtitle && (
                    <span className={styles.subtitle}>{item.subtitle}</span>
                  )}
                </motion.h3>
                <motion.p className={styles.description} {...rise(0.08)}>
                  {item.description}
                </motion.p>
                {item.techStack && item.techStack.length > 0 && (
                  <motion.ul
                    className={styles.chips}
                    aria-label="Tech stack"
                    {...rise(0.16)}
                  >
                    {item.techStack.map((t) => (
                      <li key={t} className={styles.chip}>
                        {t}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </div>

              {(item.caseStudyUrl || item.liveUrl) && (
                <div className={styles.actions}>
                  {item.liveUrl && (
                    <a
                      href={item.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button"
                    >
                      <FaExternalLinkAlt aria-hidden="true" />
                      Live site
                    </a>
                  )}
                  {item.caseStudyUrl && (
                    <a
                      href={item.caseStudyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button"
                    >
                      <FaGithub aria-hidden="true" />
                      GitHub
                    </a>
                  )}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
