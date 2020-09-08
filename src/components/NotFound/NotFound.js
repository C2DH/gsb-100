import React from 'react'
import MenuResponsive from '../MenuResponsive'
import styles from './NotFound.module.scss'

export default function NotFound() {
  return (
    <div className="d-flex flex-column h-100">
      <MenuResponsive></MenuResponsive>
      <div className={styles.notFound}>
        <h1 className="text-danger">Page not found</h1>
      </div>
    </div>
  )
}
