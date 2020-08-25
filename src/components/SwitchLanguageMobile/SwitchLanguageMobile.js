import React from 'react'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { useMiller } from '../../miller'
import styles from './SwitchLanguageMobile.module.scss'
import SwitchLanguageLink from './SwitchLanguageLink'

export default function SwitchLanguageMobile() {
  const { i18n } = useTranslation()
  const { langs } = useMiller()

  return (
    <div className={`${styles.langBlockContainer} d-flex`}>
      {langs.map((lang) => (
        <div
          key={lang}
          className={classNames(styles.langBlock, 'col text-center', {
            [styles.active]: i18n.language === lang,
          })}
        >
          <SwitchLanguageLink
            lang={lang}
            onClick={() => {
              i18n.changeLanguage(lang)
            }}
          >
            {lang.split('_')[0]}
          </SwitchLanguageLink>
        </div>
      ))}
    </div>
  )
}
