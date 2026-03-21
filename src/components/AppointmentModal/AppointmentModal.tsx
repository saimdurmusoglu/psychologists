import {useEffect, useRef, useState} from "react";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {Psychologist} from "../../hooks/usePsychologists";
import toast from "react-hot-toast";
import styles from "./AppointmentModal.module.css";

interface AppointmentModalProps {
  psychologist: Psychologist;
  onClose: () => void;
}

interface FormData {
  name: string;
  phone: string;
  time: string;
  email: string;
  comment: string;
}

const schema = yup.object({
  name: yup.string().min(2, "Min 2 characters").required("Name is required"),
  phone: yup
    .string()
    .matches(/^\+?[\d\s\-()]{7,}$/, "Invalid phone number")
    .required("Phone is required"),
  time: yup.string().required("Please select a time"),
  email: yup.string().email("Invalid email").required("Email is required"),
  comment: yup.string().required("Comment is required"),
});

const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

export default function AppointmentModal({
  psychologist,
  onClose,
}: AppointmentModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);
  const [timeOpen, setTimeOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState("");

  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (timeRef.current && !timeRef.current.contains(e.target as Node))
        setTimeOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === backdropRef.current) onClose();
  };

  const onSubmit = async (_data: FormData) => {
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Your appointment has been scheduled!");
    onClose();
  };

  const handleTimeSelect = (t: string) => {
    setSelectedTime(t);
    setValue("time", t, {shouldValidate: true});
    setTimeOpen(false);
  };

  return (
    <div
      className={styles["modal-backdrop"]}
      ref={backdropRef}
      onClick={handleBackdrop}
    >
      <div className={styles["modal"]} role="dialog" aria-modal="true">
        <button
          className={styles["modal__close"]}
          onClick={onClose}
          aria-label="Close"
        >
          <svg width="32" height="32" style={{color: "var(--color-text)"}}>
            <use href="/icons/sprite.svg#icon-close" />
          </svg>
        </button>

        <h2 className={styles["modal__title"]}>
          Make an appointment with a psychologists
        </h2>
        <p className={styles["modal__subtitle"]}>
          You are on the verge of changing your life for the better. Fill out
          the short form below to book your personal appointment with a
          professional psychologist. We guarantee confidentiality and respect
          for your privacy.
        </p>

        <div className={styles["appointment-doctor"]}>
          <img
            src={psychologist.avatar_url}
            alt={psychologist.name}
            className={styles["appointment-doctor__img"]}
          />
          <div>
            <span className={styles["appointment-doctor__label"]}>
              Your psychologists
            </span>
            <p className={styles["appointment-doctor__name"]}>
              {psychologist.name}
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles["modal__form"]}
          noValidate
        >
          <input type="hidden" {...register("time")} />

          <div className={styles["field"]}>
            <div className={styles["field__row"]}>
              <label className={styles["field__label"]}>Name</label>
              <input
                {...register("name")}
                type="text"
                className={`${styles["field__input"]}${errors.name ? ` ${styles["field__input--error"]}` : ""}`}
              />
            </div>
            {errors.name && (
              <span className={styles["field__error"]}>
                {errors.name.message}
              </span>
            )}
          </div>

          <div className={styles["form__row"]}>
            <div className={styles["field"]}>
              <div className={styles["field__row"]}>
                <label className={styles["field__label"]}>+380</label>
                <input
                  {...register("phone")}
                  type="tel"
                  className={`${styles["field__input"]}${errors.phone ? ` ${styles["field__input--error"]}` : ""}`}
                />
              </div>
              {errors.phone && (
                <span className={styles["field__error"]}>
                  {errors.phone.message}
                </span>
              )}
            </div>

            <div className={styles["field"]}>
              <div
                className={`${styles["field__row"]}${errors.time ? ` ${styles["field__row--error"]}` : ""}`}
              >
                <div className={styles["time-picker"]} ref={timeRef}>
                  <button
                    type="button"
                    className={styles["time-picker__btn"]}
                    onClick={() => setTimeOpen((o) => !o)}
                  >
                    <span
                      className={
                        selectedTime
                          ? styles["time-picker__value"]
                          : styles["time-picker__placeholder"]
                      }
                    >
                      {selectedTime || "00:00"}
                    </span>
                    <svg
                      width="20"
                      height="20"
                      style={{color: "var(--color-text-secondary)"}}
                    >
                      <use href="/icons/sprite.svg#icon-clock" />
                    </svg>
                  </button>
                  {timeOpen && (
                    <div className={styles["time-picker__dropdown"]}>
                      <p className={styles["time-picker__title"]}>
                        Meeting time
                      </p>
                      <ul className={styles["time-picker__list"]}>
                        {TIME_SLOTS.map((t) => (
                          <li key={t}>
                            <button
                              type="button"
                              className={`${styles["time-picker__option"]}${selectedTime === t ? ` ${styles["time-picker__option--active"]}` : ""}`}
                              onClick={() => handleTimeSelect(t)}
                            >
                              {t.replace(":", " : ")}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              {errors.time && (
                <span className={styles["field__error"]}>
                  {errors.time.message}
                </span>
              )}
            </div>
          </div>

          <div className={styles["field"]}>
            <div className={styles["field__row"]}>
              <label className={styles["field__label"]}>Email</label>
              <input
                {...register("email")}
                type="email"
                className={`${styles["field__input"]}${errors.email ? ` ${styles["field__input--error"]}` : ""}`}
              />
            </div>
            {errors.email && (
              <span className={styles["field__error"]}>
                {errors.email.message}
              </span>
            )}
          </div>

          <div className={styles["field"]}>
            <div className={styles["field__row--comment"]}>
              <label className={styles["field__label--comment"]}>Comment</label>
              <textarea
                {...register("comment")}
                rows={4}
                className={`${styles["field__input--comment"]}${errors.comment ? ` ${styles["field__input--error"]}` : ""}`}
              />
            </div>
            {errors.comment && (
              <span className={styles["field__error"]}>
                {errors.comment.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className={styles["modal__submit"]}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
