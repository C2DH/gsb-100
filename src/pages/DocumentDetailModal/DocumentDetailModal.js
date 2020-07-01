import React, { useMemo, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useCacheDocument } from '../../miller'
import DocumentInfo from '../../components/DocumentInfo'
import { X } from 'react-feather'
import styles from './DocumentDetailModal.module.scss'

export default function DocumentDetailModal({ previewDocument }) {
  const { id } = useParams()
  const history = useHistory()

  const [fullDocument] = useCacheDocument(id, null, {
    suspense: false,
  })

  useEffect(() => {
    const body = document.getElementsByTagName('body')[0]
    body.classList.add('no-overflow')
    return () => {
      body.classList.remove('no-overflow')
    }
  }, [])

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
    <div className={styles.DocModalContent}>
      <div
        onClick={() => history.goBack()}
        className={styles.close}
      >
        <X size={30} />
      </div>
      <DocumentInfo doc={doc} />
    </div>
  )
}
