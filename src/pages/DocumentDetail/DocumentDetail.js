import React from 'react'
import { useParams } from 'react-router-dom'
import { useCacheDocument } from '../../miller'
import DocumentInfo from '../../components/DocumentInfo'
import LangLink from '../../components/LangLink'
import styles from './DocumentDetail.module.scss'
import { ArrowLeft } from 'react-feather'

export default function DocumentDetail() {
  const { id } = useParams()
  const [doc] = useCacheDocument(id)

  return (
    <div className="h-100 position-relative">
      <LangLink to="/explorations/all" className={styles.close}>
        <ArrowLeft />
        All sources
      </LangLink>
      <DocumentInfo doc={doc} />
    </div>
  )
}
