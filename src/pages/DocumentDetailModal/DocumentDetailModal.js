import React, { useMemo } from 'react'
import Helmet from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { useParams, useHistory } from 'react-router-dom'
import { useCacheDocument } from '../../miller'
import DocumentInfo from '../../components/DocumentInfo'
import { X } from 'react-feather'
import styles from './DocumentDetailModal.module.scss'
import { useBodyNoOverflow } from '../../hooks'

export default function DocumentDetailModal({ previewDocument }) {
  const { id } = useParams()
  const history = useHistory()
  const { i18n } = useTranslation()

  const [fullDocument] = useCacheDocument(id, undefined, {
    suspense: false,
  })

  useBodyNoOverflow()

  const doc = useMemo(() => {
    if (fullDocument === null) {
      return {
        ...previewDocument,
        documents: [],
      }
    }
    return fullDocument
  }, [fullDocument, previewDocument])

  return (
    <React.Fragment>
      <Helmet>
        <html lang={i18n.language.split('_')[0]} />
        <title itemProp="name">{doc.data.title}</title>
      </Helmet>
      <div className={styles.DocModalContent}>
        <div onClick={() => history.goBack()} className={styles.close}>
          <X size={30} />
        </div>
        <DocumentInfo doc={doc} />
      </div>
    </React.Fragment>
  )
}
