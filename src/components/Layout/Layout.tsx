import { Outlet } from 'react-router-dom'
import Header from '../Header/Header'
import ThemePicker from '../ThemePicker/ThemePicker'
import styles from './Layout.module.css'

export default function Layout() {
  return (
    <>
      <div className={styles.wrapper}>
        <Header />
        <main className={styles.main}><Outlet /></main>
      </div>
      <ThemePicker />
    </>
  )
}