import React from 'react'
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap'
import { useTranslation } from 'react-i18next'
import { useMiller } from '../../miller'
import styles from './SwitchLanguage.module.scss'
import SwitchLanguageLink from './SwitchLanguageLink'

export default function SwitchLanguage() {
  const { i18n } = useTranslation()
  const { langs } = useMiller()

  return (
    <UncontrolledDropdown className="d-flex">
      <DropdownToggle color="secondary" className={styles.dropdownToggle} caret>
        {i18n.language.split('_')[0]}
      </DropdownToggle>
      <DropdownMenu className={styles.dropdownMenu} right>
        {langs.map((lang) => (
          <DropdownItem
            tag={SwitchLanguageLink}
            lang={lang}
            onClick={() => {
              i18n.changeLanguage(lang)
            }}
            key={lang}
            active={i18n.language === lang}
          >
            {lang.split('_')[0]}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}
