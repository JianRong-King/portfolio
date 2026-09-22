"use client";

import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import styles from "./Nav.module.css";

const links = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
];

export default function Nav() {
  const pathname = usePathname();
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

      <div className={styles.right}>
        <div className={styles.pills}>
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`${styles.pill} ${
                pathname === l.href ? styles.active : ""
              }`}
            >
              {l.label}
            </a>
          ))}
        </div>

        <button className={styles.lang} type="button">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
            <path
              d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9s1.3-6.4 3.8-9Z"
              stroke="currentColor"
              strokeWidth="1.6"
            />
          </svg>
          English
        </button>
      </div>
    </nav>
  );
}
