import styles from "./PhoneMockup.module.css";

type Props = {
  src: string;
  alt: string;
  screens?: number;
};

export default function PhoneMockup({ src, alt, screens = 4 }: Props) {
  return (
    <div className={styles.stage} role="img" aria-label={alt}>
      {Array.from({ length: screens }).map((_, i) => (
        <div key={i} className={styles.phone}>
          <div
            className={styles.screen}
            style={{
              backgroundImage: `url(${src})`,
              backgroundSize: `${screens * 100}% 100%`,
              backgroundPosition: `${(i / (screens - 1)) * 100}% 0`,
            }}
          />
        </div>
      ))}
    </div>
  );
}
