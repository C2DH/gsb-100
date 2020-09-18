import React, { useMemo } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useCacheDocument } from '../../miller'
import Header from '../../components/Header'
import DocumentInfo from '../../components/DocumentInfo'
import { X } from 'react-feather'
import styles from './DocumentDetailModal.module.scss'
import { useBodyNoOverflow } from '../../hooks'

export default function DocumentDetailModal({ previewDocument }) {
  const { id } = useParams()
  const history = useHistory()

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
      <Header
        title={doc.data.title}
        description={doc.data.description}
      ></Header>
      <div className={styles.DocModalContent}>
        <div onClick={() => history.goBack()} className={styles.close}>
          <X size={30} />
        </div>
        <DocumentInfo doc={doc} />
      </div>
    </React.Fragment>
  )
}
