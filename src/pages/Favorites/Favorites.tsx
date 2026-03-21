import { useFavorites } from '../../context/FavoritesContext'
import PsychologistCard from '../../components/PsychologistCard/PsychologistCard'
import { Link } from 'react-router-dom'
import styles from './Favorites.module.css'

export default function Favorites() {
  const { favorites } = useFavorites()

  return (
    <section className="psychologists-page container">
      <h1 className={styles['page-title']}>Favorites</h1>

      {favorites.length === 0 ? (
        <div className={styles['empty-favorites']}>
          <p>You haven't added any psychologists to your favorites yet.</p>
          <Link to="/psychologists" className="btn btn--primary">Browse psychologists</Link>
        </div>
      ) : (
        <ul className={styles['psych-list']}>
          {favorites.map(p => (
            <li key={p.name}>
              <PsychologistCard psychologist={p} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}