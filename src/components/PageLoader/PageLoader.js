import React from 'react'
import Menu from '../Menu'
import styles from './PageLoader.module.scss'

// Used as placeholder while loading a page
export default function PageLoader({ menu = false }) {
  return (
    <div>
      {menu && <Menu />}
      <div className={styles.DelayedSpinner}>
        Loading your page... You Spin Me Round
      </div>
    </div>
  )
}