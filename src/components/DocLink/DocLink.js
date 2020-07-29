import React, { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { usePrefetchDocument } from '../../miller'
import LangLink from '../LangLink'
import styles from './DocLink.module.scss'

const DocLink = ({ children, document, className = styles.docLink }) => {

  // NOTE: Cause the world isn't perfect
  const fixedDocument = useMemo(() => {
    // Miller document in relation such as story
    if (document.document_id) {
      const fixedDocument = { ...document, id: document.document_id }
      delete fixedDocument.document_id
      return fixedDocument
    }
    return document
  }, [document])

  const location = useLocation()
  const prefetchDocument = usePrefetchDocument()
  return (
    <LangLink
      onClick={() => {
        prefetchDocument(fixedDocument.id)
      }}
      to={{
        pathname: `/documents/${fixedDocument.id}`,
        state: { background: location, modalDocument: fixedDocument },
      }}
      className={className}
    >
      {children}
    </LangLink>
  )
}

export default DocLink