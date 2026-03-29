import { Link } from 'react-router-dom'
import styles from './Home.module.css'

const base = import.meta.env.BASE_URL

export default function Home() {
  return (
    <section className={styles.hero}>
      <div className={styles['hero__inner']}>
        <div className={styles['hero__content']}>
          <h1 className={styles['hero__title']}>
            The road to the <em>depths</em> of the human soul
          </h1>
          <p className={styles['hero__sub']}>
            We help you to reveal your potential, overcome challenges and find a guide in your own life with the help of our experienced psychologists.
          </p>
          <Link to="/psychologists" className="btn btn--hero">
            Get started
            <svg className={styles["hero__btn-icon"]}>
              <use href={`${base}icons/sprite.svg#icon-arrow`} />
            </svg>
          </Link>
        </div>

        <div className={styles['hero__visual-side']}>
          <div className={styles['hero__img-wrap']}>
            <img
              src={`${base}images/hero-photo@1x.jpg`}
              srcSet={`${base}images/hero-photo@1x.jpg 1x, ${base}images/hero-photo@2x.jpg 2x`}
              alt="Psychologist"
              className={styles['hero__photo']}
            />
            <div className={styles['hero__badge--question']}>
              <svg width="10" height="17">
                <use href={`${base}icons/sprite.svg#icon-question`} />
              </svg>
            </div>
            <div className={styles['hero__badge--hash']}>
              <svg width="25" height="25">
                <use href={`${base}icons/sprite.svg#icon-users`} />
              </svg>
            </div>
            <div className={styles['hero__stat']}>
              <div className={styles['hero__stat-check']}>
                <svg width="30" height="30" style={{ color: 'var(--color-primary)' }}>
                  <use href={`${base}icons/sprite.svg#icon-check`} />
                </svg>
              </div>
              <div>
                <p className={styles['hero__stat-label']}>Experienced psychologists</p>
                <p className={styles['hero__stat-num']}>15,000</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}