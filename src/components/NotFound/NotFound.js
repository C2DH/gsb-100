import React from 'react'
import { useTranslation } from 'react-i18next'
import MenuResponsive from '../MenuResponsive'
import styles from './NotFound.module.scss'

export default function NotFound({ menu = true }) {
  const { t } = useTranslation()
  return (
    <div className="d-flex flex-column h-100">
      {menu && <MenuResponsive></MenuResponsive>}
      <div className={styles.notFound}>
        <h1 className="text-danger">{t('page not found')}</h1>
      </div>
    </div>
  )
}
