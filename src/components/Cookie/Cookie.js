import React from 'react'
import CookieBanner from 'react-cookie-banner'
import LangLink from '../LangLink'
import styles from './Cookie.module.scss'

function Cookie({ children }) {
  const text =
    'Diese Seite verwendet Cookies. Durch die Nutzung dieser Webseite erklären Sie sich mit der Verwendung von Cookies einverstanden.'
  return (
    <React.Fragment>
      {children}
      <CookieBanner
        message={text}
        buttonMessage={'Got it'}
        dismissOnScroll={true}
        className={styles.banner}
        link={<LangLink to={`/terms-of-use`}>More info</LangLink>}
      />
    </React.Fragment>
  )
}
export default Cookie
