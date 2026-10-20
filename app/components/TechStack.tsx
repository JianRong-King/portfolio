"use client";

import { motion } from "framer-motion";
import {
  SiReact,
  SiNodedotjs,
  SiTypescript,
  SiMongodb,
  SiFigma,
  SiVite,
  SiTailwindcss,
  SiPostman,
  SiPython,
  SiFramer,
  SiGithub,
  SiJavascript,
  SiGitlab,
  SiKubernetes,
  SiAngular,
  SiClaudecode,
  SiLanggraph,
  SiSpringboot,
} from "react-icons/si";
import { FaJava } from "react-icons/fa";
import type { IconType } from "react-icons";
import { primaryTech, toolStrip, type TechItem } from "../data/techStack";
import styles from "./TechStack.module.css";

const icons: Record<string, IconType> = {
  SiReact,
  SiNodedotjs,
  SiTypescript,
  SiMongodb,
  FaJava,
  SiFigma,
  SiVite,
  SiTailwindcss,
  SiPostman,
  SiPython,
  SiFramer,
  SiGithub,
  SiJavascript,
  SiGitlab,
  SiKubernetes,
  SiAngular,
  SiClaudecode,
  SiLanggraph,
  SiSpringboot,
};

function Icon({ item }: { item: TechItem }) {
  const IconComp = icons[item.icon];
  if (!IconComp) return null;
  return <IconComp aria-hidden="true" />;
}

export default function TechStack() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <motion.h2
          className={styles.heading}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          Tech stack and tools
        </motion.h2>

        <ul className={styles.list}>
          {primaryTech.map((item, i) => (
            <motion.li
              key={item.name}
              className={styles.item}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{
                duration: 0.7,
                delay: i * 0.07,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <span className={styles.name}>{item.name}</span>
              <span className={styles.use}>
                {item.use}
                <Icon item={item} />
              </span>
            </motion.li>
          ))}
        </ul>
      </div>

      <div className={styles.strip}>
        <div className={styles.marquee}>
          <div className={styles.track}>
            {[...toolStrip, ...toolStrip].map((item, i) => (
              <span
                key={`${item.name}-${i}`}
                className={styles.stripItem}
                aria-hidden={i >= toolStrip.length}
              >
                <Icon item={item} />
                {item.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
