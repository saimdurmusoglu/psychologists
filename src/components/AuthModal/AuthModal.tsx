import {useEffect, useRef, useState} from "react";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {useAuth} from "../../context/AuthContext";
import toast from "react-hot-toast";
import styles from "./AuthModal.module.css";

type AuthModalMode = "login" | "register";

interface AuthModalProps {
  mode: AuthModalMode;
  onClose: () => void;
  onSwitch: (mode: AuthModalMode) => void;
}

interface LoginFormData {
  email: string;
  password: string;
}
interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}
type FormData = LoginFormData | RegisterFormData;

const loginSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Min 6 characters")
    .required("Password is required"),
});

const registerSchema = yup.object({
  name: yup.string().min(2, "Min 2 characters").required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Min 6 characters")
    .required("Password is required"),
});

export default function AuthModal({mode, onClose, onSwitch}: AuthModalProps) {
  const {login, register} = useAuth();
  const backdropRef = useRef<HTMLDivElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const isLogin = mode === "login";
  const schema = isLogin ? loginSchema : registerSchema;

  const {
    register: reg,
    handleSubmit,
    formState: {errors, isSubmitting},
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema) as never,
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

  const onSubmit = async (data: FormData) => {
    try {
      if (isLogin) {
        const {email, password} = data as LoginFormData;
        await login(email, password);
        toast.success("Welcome back!");
      } else {
        const {name, email, password} = data as RegisterFormData;
        await register(name, email, password);
        toast.success("Account created!");
      }
      onClose();
    } catch (err) {
      toast.error((err as Error).message ?? "Something went wrong");
    }
  };

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === backdropRef.current) onClose();
  };

  const handleSwitch = (newMode: AuthModalMode) => {
    reset();
    onSwitch(newMode);
  };

  return (
    <div
      className={styles["modal-backdrop"]}
      ref={backdropRef}
      onClick={handleBackdrop}
    >
      <div
        className={`${styles.modal} ${isLogin ? styles["modal--login"] : styles["modal--register"]}`}
        role="dialog"
        aria-modal="true"
      >
        <button
          className={styles["modal__close"]}
          onClick={onClose}
          aria-label="Close"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M1 1L15 15M15 1L1 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className={styles["modal__header"]}>
          <h2 className={styles["modal__title"]}>
            {isLogin ? "Log In" : "Registration"}
          </h2>
          <p className={styles["modal__subtitle"]}>
            {isLogin
              ? "Welcome back! Please enter your credentials to access your account and continue your search for a psychologist."
              : "Thank you for your interest in our platform! In order to register, we need some information. Please provide us with the following information."}
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles["modal__form"]}
          noValidate
        >
          <div className={styles["modal__fields"]}>
            {!isLogin && (
              <div className={styles["field"]}>
                <input
                  {...reg("name" as keyof FormData)}
                  type="text"
                  placeholder="Name"
                  className={`${styles["field__input"]}${(errors as Record<string, unknown>).name ? ` ${styles["field__input--error"]}` : ""}`}
                  autoComplete="name"
                />
                {(errors as Record<string, {message?: string}>).name && (
                  <span className={styles["field__error"]}>
                    {
                      (errors as Record<string, {message?: string}>).name
                        ?.message
                    }
                  </span>
                )}
              </div>
            )}

            <div className={styles["field"]}>
              <input
                {...reg("email")}
                type="email"
                placeholder="Email"
                className={`${styles["field__input"]}${errors.email ? ` ${styles["field__input--error"]}` : ""}`}
                autoComplete="email"
              />
              {errors.email && (
                <span className={styles["field__error"]}>
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className={styles["field"]}>
              <div className={styles["field__password-wrap"]}>
                <input
                  {...reg("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className={`${styles["field__input"]}${errors.password ? ` ${styles["field__input--error"]}` : ""}`}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                />
                <button
                  type="button"
                  className={styles["field__eye"]}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <svg
                    width="20"
                    height="20"
                    style={{color: "var(--color-text-secondary)"}}
                  >
                    <use
                      href={
                        showPassword
                          ? "/icons/sprite.svg#icon-eye-on"
                          : "/icons/sprite.svg#icon-eye-off"
                      }
                    />
                  </svg>
                </button>
              </div>
              {errors.password && (
                <span className={styles["field__error"]}>
                  {errors.password.message}
                </span>
              )}
            </div>
          </div>

          <button
            type="submit"
            className={styles["modal__submit"]}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Please wait..." : isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>

        <p className={styles["modal__switch"]}>
          {isLogin ? (
            <>
              Don't have an account?{" "}
              <button
                className={styles["modal__switch-btn"]}
                onClick={() => handleSwitch("register")}
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                className={styles["modal__switch-btn"]}
                onClick={() => handleSwitch("login")}
              >
                Log in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
