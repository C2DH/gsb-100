import React from 'react'
import CookieBanner from 'react-cookie-banner'
import { useTranslation } from 'react-i18next'
import LangLink from '../LangLink'
import styles from './Cookie.module.scss'

function Cookie({ children }) {
  const { t } = useTranslation()
  return (
    <React.Fragment>
      {children}
      <CookieBanner
        message={t('cookie')}
        buttonMessage={t('got it')}
        dismissOnScroll={true}
        className={styles.banner}
        link={<LangLink to={`/terms-of-use`}>{t('more info')}</LangLink>}
      />
    </React.Fragment>
  )
}
export default Cookie
