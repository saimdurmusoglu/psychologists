import {useState} from "react";
import {useAuth} from "../../context/AuthContext";
import {useFavorites} from "../../context/FavoritesContext";
import {Psychologist} from "../../hooks/usePsychologists";
import AppointmentModal from "../AppointmentModal/AppointmentModal";
import toast from "react-hot-toast";
import styles from "./PsychologistCard.module.css";

function StarIcon({filled}: {filled: boolean}) {
  return (
    <svg
      width="16"
      height="16"
      style={{color: filled ? "#FFC531" : "transparent"}}
    >
      <use href="/icons/sprite.svg#icon-star" />
    </svg>
  );
}

function HeartIcon({active}: {active: boolean}) {
  return (
    <svg
      width="26"
      height="26"
      style={{color: active ? "var(--color-primary)" : "var(--color-text)"}}
    >
      <use
        href={
          active
            ? "/icons/sprite.svg#icon-heart-filled"
            : "/icons/sprite.svg#icon-heart"
        }
      />
    </svg>
  );
}

interface Props {
  psychologist: Psychologist;
}

export default function PsychologistCard({psychologist}: Props) {
  const {user} = useAuth();
  const {isFavorite, addFavorite, removeFavorite} = useFavorites();
  const [expanded, setExpanded] = useState(false);
  const [appointmentOpen, setAppointmentOpen] = useState(false);
  const fav = isFavorite(psychologist.name);

  const handleFavorite = () => {
    if (!user) {
      toast.error(
        "This feature is available only for authorized users. Please log in or register.",
      );
      return;
    }
    if (fav) {
      removeFavorite(psychologist.name);
      toast.success("Removed from favorites");
    } else {
      addFavorite(psychologist);
      toast.success("Added to favorites");
    }
  };

  const tagList = [
    {label: "Experience", value: psychologist.experience},
    {label: "License", value: psychologist.license},
    {label: "Specialization", value: psychologist.specialization},
    {label: "Initial_consultation", value: psychologist.initial_consultation},
  ];

  const tagRows: (typeof tagList)[] = [];
  for (let i = 0; i < tagList.length; i += 2) {
    tagRows.push(tagList.slice(i, i + 2));
  }

  return (
    <article className={styles["psych-card"]}>
      {/* mobil kalp — absolute sağ üst */}
      <button
        className={`${styles["psych-card__fav"]}${fav ? ` ${styles.active}` : ""}`}
        onClick={handleFavorite}
        aria-label={fav ? "Remove from favorites" : "Add to favorites"}
      >
        <HeartIcon active={fav} />
      </button>

      {/* mobilde: avatar + label/isim yan yana */}
      <div className={styles["psych-card__top-section"]}>
        <div className={styles["psych-card__avatar-wrap"]}>
          <img
            src={psychologist.avatar_url}
            alt={psychologist.name}
            className={styles["psych-card__avatar"]}
          />
          <span className={styles["psych-card__online"]} aria-label="Online" />
        </div>
        <div className={styles["psych-card__label-wrap"]}>
          <span className={styles["psych-card__label"]}>Psychologist</span>
          <h2 className={styles["psych-card__name"]}>{psychologist.name}</h2>
        </div>
      </div>

      <div className={styles["psych-card__body"]}>
        {/* desktop: isim solda + rating+kalp sağda aynı satırda */}
        <div className={styles["psych-card__name-row-desktop"]}>
          <div className={styles["psych-card__label-wrap-desktop"]}>
            <span className={styles["psych-card__label"]}>Psychologist</span>
            <h2 className={styles["psych-card__name"]}>{psychologist.name}</h2>
          </div>
          <div className={styles["psych-card__top-row"]}>
            <div className={styles["psych-card__actions"]}>
              <div className={styles["psych-card__rating"]}>
                <StarIcon filled />
                <span>Rating: {psychologist.rating.toFixed(2)}</span>
              </div>
              <span className={styles["psych-card__divider"]} />
              <span className={styles["psych-card__price-inline"]}>
                Price / 1 hour: <strong>${psychologist.price_per_hour}</strong>
              </span>
            </div>
            <button
              className={`${styles["psych-card__fav"]} ${styles["psych-card__fav--desktop"]}${fav ? ` ${styles.active}` : ""}`}
              onClick={handleFavorite}
              aria-label={fav ? "Remove from favorites" : "Add to favorites"}
            >
              <HeartIcon active={fav} />
            </button>
          </div>
        </div>

        {/* mobil: rating ayrı satırda */}
        <div className={styles["psych-card__top-row-mobile"]}>
          <div className={styles["psych-card__actions"]}>
            <div className={styles["psych-card__rating"]}>
              <StarIcon filled />
              <span>Rating: {psychologist.rating.toFixed(2)}</span>
            </div>
            <span className={styles["psych-card__divider"]} />
            <span className={styles["psych-card__price-inline"]}>
              Price / 1 hour: <strong>${psychologist.price_per_hour}</strong>
            </span>
          </div>
        </div>

        <ul className={styles["psych-card__tags"]}>
          {tagRows.map((row, rowIndex) => (
            <li key={rowIndex} className={styles["psych-card__tag-row"]}>
              {row.map((tag) => (
                <span key={tag.label} className={styles["psych-card__tag"]}>
                  <span className={styles["psych-card__tag-label"]}>
                    {tag.label}:{" "}
                  </span>
                  <span className={styles["psych-card__tag-value"]}>
                    {tag.value}
                  </span>
                </span>
              ))}
            </li>
          ))}
        </ul>

        <p className={styles["psych-card__about"]}>{psychologist.about}</p>

        {!expanded ? (
          <button
            className={styles["psych-card__read-more"]}
            onClick={() => setExpanded(true)}
          >
            Read more
          </button>
        ) : (
          <div className={styles["psych-card__expanded"]}>
            <ul className={styles["psych-card__reviews"]}>
              {psychologist.reviews?.map((review, i) => (
                <li key={i} className={styles["review"]}>
                  <div className={styles["review__header"]}>
                    <span className={styles["review__avatar"]}>
                      {review.reviewer[0]}
                    </span>
                    <div className={styles["review__info"]}>
                      <p className={styles["review__name"]}>
                        {review.reviewer}
                      </p>
                      <div className={styles["review__stars"]}>
                        <StarIcon filled />
                        <span className={styles["review__rating-value"]}>
                          {review.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className={styles["review__comment"]}>{review.comment}</p>
                </li>
              ))}
            </ul>
            <button
              className={styles["psych-card__appointment-btn"]}
              onClick={() => setAppointmentOpen(true)}
            >
              Make an appointment
            </button>
          </div>
        )}
      </div>

      {appointmentOpen && (
        <AppointmentModal
          psychologist={psychologist}
          onClose={() => setAppointmentOpen(false)}
        />
      )}
    </article>
  );
}
