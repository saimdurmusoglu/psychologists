import {useState} from "react";
import {NavLink, useNavigate} from "react-router-dom";
import {useAuth} from "../../context/AuthContext";
import {useTheme} from "../../context/ThemeContext";
import AuthModal from "../AuthModal/AuthModal";
import toast from "react-hot-toast";
import styles from "./Header.module.css";

type AuthModalMode = "login" | "register";

export default function Header() {
  const {user, logout} = useAuth();
  const {theme, setTheme} = useTheme();
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
        <div className={styles["header__inner"]}>
          <NavLink to="/" className={styles["header__logo"]}>
            <span className={styles["logo-colored"]}>psychologists</span>
            <span className={styles["logo-services"]}>.services</span>
          </NavLink>

          <nav className={styles["header__nav"]}>
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

          <div className={styles["header__auth"]}>
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

          <button
            className={styles.burger}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        {menuOpen && (
          <>
            <div
              className={styles["mobile-overlay"]}
              onClick={() => setMenuOpen(false)}
            />
            <div className={styles["mobile-menu"]}>
            <button
              className={styles["mobile-close"]}
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg width="24" height="24" style={{color: "var(--color-bg)"}}>
                <use href="/icons/sprite.svg#icon-close" />
              </svg>
            </button>
            <nav className={styles["mobile-nav"]}>
              <NavLink to="/" end onClick={() => setMenuOpen(false)}>
                Home
              </NavLink>
              <NavLink to="/psychologists" onClick={() => setMenuOpen(false)}>
                Psychologists
              </NavLink>
              {user && (
                <NavLink to="/favorites" onClick={() => setMenuOpen(false)}>
                  Favorites
                </NavLink>
              )}
            </nav>
            <div className={styles["mobile-themes"]}>
              {(["green", "blue", "orange"] as const).map((t) => (
                <button
                  key={t}
                  className={`${styles["mobile-theme-dot"]} ${styles[`mobile-theme-dot--${t}`]}${theme === t ? ` ${styles["mobile-theme-dot--active"]}` : ""}`}
                  onClick={() => setTheme(t)}
                  title={t.charAt(0).toUpperCase() + t.slice(1)}
                />
              ))}
            </div>
            <div className={styles["mobile-auth"]}>
              {user ? (
                <>
                  <div className={styles["mobile-user"]}>
                    <div className={styles["user-icon"]}>
                      <svg width="24" height="24">
                        <use href="/icons/sprite.svg#icon-user" />
                      </svg>
                    </div>
                    <span className={styles["header__user"]}>
                      {user.displayName ?? user.email}
                    </span>
                  </div>
                  <button
                    className={styles["btn-login"]}
                    onClick={handleLogout}
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <button
                    className={`${styles["btn-login"]} ${styles["btn-full"]}`}
                    onClick={() => {
                      setAuthModal("login");
                      setMenuOpen(false);
                    }}
                  >
                    Log in
                  </button>
                  <button
                    className={`${styles["btn-register"]} ${styles["btn-full"]}`}
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
          </>
        )}
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
