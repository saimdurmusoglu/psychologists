import {useEffect, useRef, useState} from "react";
import {usePsychologists} from "../../hooks/usePsychologists";
import PsychologistCard from "../../components/PsychologistCard/PsychologistCard";
import SortDropdown from "../../components/SortDropdown/SortDropdown";
import styles from "./Psychologists.module.css";

type SortDir = "asc" | "desc";

export default function Psychologists() {
  const {psychologists, loading, hasMore, fetchPsychologists, resetAndFetch} =
    usePsychologists();
  const [sortField, setSortField] = useState<string>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const initialLoad = useRef(false);

  useEffect(() => {
    if (!initialLoad.current) {
      initialLoad.current = true;
      resetAndFetch("name", "asc");
    }
  }, [resetAndFetch]);

  const handleSort = (field: string, dir: SortDir) => {
    if (field === "show_all") {
      setSortField("show_all");
      setSortDir("asc");
      resetAndFetch("show_all", "asc");
    } else {
      setSortField(field);
      setSortDir(dir);
      resetAndFetch(field, dir);
    }
  };

  return (
    <section className={styles["psychologists-page"]}>
      <div className="container">
        <div className={styles["psychologists-page__top"]}>
          <SortDropdown onSort={handleSort} defaultValue="name_asc" />
        </div>

        {psychologists.length === 0 && !loading && (
          <p className={styles["empty-state"]}>No psychologists found.</p>
        )}

        <ul className={styles["psych-list"]}>
          {psychologists.map((p) => (
            <li key={p.id ?? p.name}>
              <PsychologistCard psychologist={p} />
            </li>
          ))}
        </ul>

        {loading && (
          <div className={styles["loader-wrap"]}>
            <div className={styles.spinner} />
          </div>
        )}

        {!loading && hasMore && psychologists.length > 0 && (
          <div className={styles["load-more-wrap"]}>
            <button
              className={styles["btn-load-more"]}
              onClick={() => fetchPsychologists(sortField, sortDir, false)}
            >
              Load more
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
