import {useState, useRef, useEffect} from "react";
import styles from "./SortDropdown.module.css";

type SortDir = "asc" | "desc";

interface SortOption {
  label: string;
  value: string;
  field: string;
  dir: SortDir;
}

interface SortDropdownProps {
  onSort: (field: string, dir: SortDir) => void;
  defaultValue?: string;
}

const SORT_OPTIONS: SortOption[] = [
  {label: "A to Z", value: "name_asc", field: "name", dir: "asc"},
  {label: "Z to A", value: "name_desc", field: "name", dir: "desc"},
  {
    label: "Less than 10$",
    value: "price_asc",
    field: "price_per_hour",
    dir: "asc",
  },
  {
    label: "Greater than 10$",
    value: "price_desc",
    field: "price_per_hour",
    dir: "desc",
  },
  {label: "Popular", value: "rating_desc", field: "rating", dir: "desc"},
  {label: "Not popular", value: "rating_asc", field: "rating", dir: "asc"},
  {label: "Show all", value: "show_all", field: "show_all", dir: "asc"},
];

export default function SortDropdown({
  onSort,
  defaultValue = "show_all",
}: SortDropdownProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<SortOption>(
    SORT_OPTIONS.find((o) => o.value === defaultValue) ?? SORT_OPTIONS[0],
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (opt: SortOption) => {
    setSelected(opt);
    setOpen(false);
    onSort(opt.field, opt.dir);
  };

  return (
    <div className={styles.wrapper} ref={ref}>
      <p className={styles.label}>Filters</p>
      <div className={styles.dropdown}>
        <button className={styles.btn} onClick={() => setOpen((o) => !o)}>
          <span>{selected.label}</span>
          <svg
            width="20"
            height="20"
            className={styles.chevron}
            style={{transform: open ? "rotate(0deg)" : "rotate(180deg)"}}
          >
            <use href="/icons/sprite.svg#icon-chevron" />
          </svg>
        </button>

        {open && (
          <ul className={styles.list}>
            {SORT_OPTIONS.map((opt) => (
              <li key={opt.value}>
                <button
                  className={`${styles.item}${selected.value === opt.value ? ` ${styles["item--active"]}` : ""}`}
                  onClick={() => handleSelect(opt)}
                >
                  {opt.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
