import { Link } from 'react-router-dom'
import styles from './NotFound.module.css'

export default function NotFound() {
  return (
    <div className={`${styles['not-found']} container`}>
      <h1>404</h1>
      <p>Page not found</p>
      <Link to="/" className="btn btn--primary">Go home</Link>
    </div>
  )
}