import {useState, useRef, useEffect} from "react";
import {useTheme} from "../../context/ThemeContext";
import styles from "./ThemePicker.module.css";

type Theme = "green" | "blue" | "orange";

export default function ThemePicker() {
  const {theme, setTheme} = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className={styles.picker} ref={ref}>
      <button
        className={styles["picker__btn"]}
        onClick={() => setOpen((o) => !o)}
        aria-label="Change theme"
        title="Change theme"
      >
        <svg width="40" height="40">
          <use href="/icons/sprite.svg#icon-palette" />
        </svg>
      </button>

      {open && (
        <div className={styles["picker__panel"]}>
          {(["green", "blue", "orange"] as Theme[]).map((t) => (
            <button
              key={t}
              className={`${styles["picker__dot"]} ${styles[`picker__dot--${t}`]}${theme === t ? ` ${styles.active}` : ""}`}
              onClick={() => {
                setTheme(t);
                setOpen(false);
              }}
              title={t.charAt(0).toUpperCase() + t.slice(1)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
