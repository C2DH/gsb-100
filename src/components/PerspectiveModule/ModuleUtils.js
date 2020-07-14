import React from 'react'
import { CornerLeftUp } from 'react-feather'
import { useLocation } from 'react-router-dom'
import { usePrefetchDocument } from '../../miller'
import LangLink from '../LangLink'
import styles from './PerspectiveModule.module.scss'

export const Caption = ({ caption }) => {
  return (
    <div className="d-flex align-items-start mt-2">
      <CornerLeftUp size="14px"></CornerLeftUp>
      <p className="ml-2 text-primary">{caption}</p>
    </div>
  )
}

export const DocLink = ({ children, document }) => {
  const location = useLocation()
  const prefetchDocument = usePrefetchDocument()
  return (
    <LangLink
      onClick={() => {
        prefetchDocument(document.document_id)
      }}
      to={{
        pathname: `/documents/${document.document_id}`,
        state: { background: location, modalDocument: document },
      }}
      className={styles.docLink}
    >
      {children}
    </LangLink>
  )
}
