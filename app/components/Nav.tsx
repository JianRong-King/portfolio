"use client";

import { useLayoutEffect, useRef } from "react";
import styles from "./Nav.module.css";

export default function Nav() {
  const navRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = navRef.current;
    if (!el) return;

    const setHeight = () =>
      document.documentElement.style.setProperty(
        "--nav-h",
        `${el.offsetHeight}px`
      );

    setHeight();
    const observer = new ResizeObserver(setHeight);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <nav ref={navRef} className={styles.nav}>
      <a href="/" className={styles.logo}>
        kjr
      </a>
    </nav>
  );
}
