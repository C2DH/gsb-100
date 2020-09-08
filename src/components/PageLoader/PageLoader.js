import React from 'react'
import MenuResponsive from '../MenuResponsive'
import loader from './loader.png'
import styles from './PageLoader.module.scss'

// Used as placeholder while loading a page
export default function PageLoader({ menu = false }) {
  return (
    <div className="h-100">
      {menu && <MenuResponsive />}
      <div className={styles.DelayedSpinner}>
        <img src={loader} alt="loading"></img>
      </div>
    </div>
  )
}
