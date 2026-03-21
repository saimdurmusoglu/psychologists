import {useFavorites} from "../../context/FavoritesContext";
import PsychologistCard from "../../components/PsychologistCard/PsychologistCard";
import SortDropdown from "../../components/SortDropdown/SortDropdown";
import {Link} from "react-router-dom";
import styles from "./Favorites.module.css";

type SortDir = "asc" | "desc";

export default function Favorites() {
  const {favorites, setFavorites} = useFavorites();

  const handleSort = (field: string, dir: SortDir) => {
    const sorted = [...favorites].sort((a, b) => {
      if (field === "show_all") return 0;
      const aVal = a[field as keyof typeof a] as string | number;
      const bVal = b[field as keyof typeof b] as string | number;
      if (aVal < bVal) return dir === "asc" ? -1 : 1;
      if (aVal > bVal) return dir === "asc" ? 1 : -1;
      return 0;
    });
    setFavorites(sorted);
  };

  return (
    <section className={styles["favorites-page"]}>
      <div className="container">
        <div className={styles["favorites-page__top"]}>
          <SortDropdown onSort={handleSort} defaultValue="rating_desc" />
        </div>

        {favorites.length === 0 ? (
          <div className={styles["empty-favorites"]}>
            <p>You haven't added any psychologists to your favorites yet.</p>
            <Link to="/psychologists" className="btn btn--primary">
              Browse psychologists
            </Link>
          </div>
        ) : (
          <ul className={styles["psych-list"]}>
            {favorites.map((p) => (
              <li key={p.name}>
                <PsychologistCard psychologist={p} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
