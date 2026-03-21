import {useState} from "react";
import {NavLink, useNavigate} from "react-router-dom";
import {useAuth} from "../../context/AuthContext";
import AuthModal from "../AuthModal/AuthModal";
import toast from "react-hot-toast";
import styles from "./Header.module.css";

type AuthModalMode = "login" | "register";

export default function Header() {
  const {user, logout} = useAuth();
  const navigate = useNavigate();
  const [authModal, setAuthModal] = useState<AuthModalMode | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
    toast.success("Logged out successfully");
    setMenuOpen(false);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={`${styles["header__inner"]} container`}>
          <NavLink to="/" className={styles["header__logo"]}>
            <span className={styles["logo-colored"]}>psychologists</span>
            <span className={styles["logo-services"]}>.services</span>
          </NavLink>

          <button
            className={styles.burger}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>

          <nav
            className={`${styles["header__nav"]}${menuOpen ? ` ${styles.open}` : ""}`}
          >
            <NavLink
              to="/"
              end
              onClick={() => setMenuOpen(false)}
              className={({isActive}) =>
                isActive ? styles["nav-link--active"] : ""
              }
            >
              {({isActive}) => (
                <span className={styles["nav-item"]}>
                  <span className={styles["nav-text"]}>Home</span>
                  {isActive && <span className={styles["nav-dot"]} />}
                </span>
              )}
            </NavLink>
            <NavLink
              to="/psychologists"
              onClick={() => setMenuOpen(false)}
              className={({isActive}) =>
                isActive ? styles["nav-link--active"] : ""
              }
            >
              {({isActive}) => (
                <span className={styles["nav-item"]}>
                  <span className={styles["nav-text"]}>Psychologists</span>
                  {isActive && <span className={styles["nav-dot"]} />}
                </span>
              )}
            </NavLink>
            {user && (
              <NavLink
                to="/favorites"
                onClick={() => setMenuOpen(false)}
                className={({isActive}) =>
                  isActive ? styles["nav-link--active"] : ""
                }
              >
                {({isActive}) => (
                  <span className={styles["nav-item"]}>
                    <span className={styles["nav-text"]}>Favorites</span>
                    {isActive && <span className={styles["nav-dot"]} />}
                  </span>
                )}
              </NavLink>
            )}
          </nav>

          <div
            className={`${styles["header__auth"]}${menuOpen ? ` ${styles.open}` : ""}`}
          >
            {user ? (
              <>
                <div className={styles["user-icon"]}>
                  <svg width="24" height="24">
                    <use href="/icons/sprite.svg#icon-user" />
                  </svg>
                </div>
                <span className={styles["header__user"]}>
                  {user.displayName ?? user.email}
                </span>
                <button className={styles["btn-login"]} onClick={handleLogout}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <button
                  className={styles["btn-login"]}
                  onClick={() => {
                    setAuthModal("login");
                    setMenuOpen(false);
                  }}
                >
                  Log in
                </button>
                <button
                  className={styles["btn-register"]}
                  onClick={() => {
                    setAuthModal("register");
                    setMenuOpen(false);
                  }}
                >
                  Registration
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {authModal && (
        <AuthModal
          mode={authModal}
          onClose={() => setAuthModal(null)}
          onSwitch={(m: AuthModalMode) => setAuthModal(m)}
        />
      )}
    </>
  );
}
