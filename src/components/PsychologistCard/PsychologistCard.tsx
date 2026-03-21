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

  return (
    <article className={styles["psych-card"]}>
      <div className={styles["psych-card__header"]}>
        <div className={styles["psych-card__avatar-wrap"]}>
          <img
            src={psychologist.avatar_url}
            alt={psychologist.name}
            className={styles["psych-card__avatar"]}
          />
          <span className={styles["psych-card__online"]} aria-label="Online" />
        </div>

        <div className={styles["psych-card__meta"]}>
          <div className={styles["psych-card__label-wrap"]}>
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
              className={`${styles["psych-card__fav"]}${fav ? ` ${styles.active}` : ""}`}
              onClick={handleFavorite}
              aria-label={fav ? "Remove from favorites" : "Add to favorites"}
            >
              <HeartIcon active={fav} />
            </button>
          </div>

          <ul className={styles["psych-card__tags"]}>
            <li className={styles["psych-card__tag"]}>
              <span>Experience: </span>
              {psychologist.experience}
            </li>
            <li className={styles["psych-card__tag"]}>
              <span>License: </span>
              {psychologist.license}
            </li>
            <li className={styles["psych-card__tag"]}>
              <span>Specialization: </span>
              {psychologist.specialization}
            </li>
            <li className={styles["psych-card__tag"]}>
              <span>Initial_consultation: </span>
              {psychologist.initial_consultation}
            </li>
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
                    <p className={styles["review__comment"]}>
                      {review.comment}
                    </p>
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
