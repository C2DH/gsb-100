import React from 'react'
import { useParams } from 'react-router-dom'
import { useCacheDocument } from '../../miller'
import { useTranslation } from 'react-i18next'
import DocumentInfo from '../../components/DocumentInfo'
import Header from '../../components/Header'
import LangLink from '../../components/LangLink'
import styles from './DocumentDetail.module.scss'
import { ArrowLeft } from 'react-feather'

export default function DocumentDetail() {
  const { id } = useParams()
  const [doc] = useCacheDocument(id)
  const { t } = useTranslation()

  return (
    <React.Fragment>
      <Header
        title={doc.data.title}
        description={doc.data.description}
        image={doc.data.resolutions?.medium.url}
      ></Header>
      <div className={`${styles.documentDetailCont} h-100 position-relative`}>
        <LangLink
          to="/explorations/all"
          className={`${styles.close} d-flex align-items-center`}
        >
          <ArrowLeft />
          <span className="ml-2 text-uppercase font-weight-bold">
            {t('all sources')}
          </span>
        </LangLink>
        <DocumentInfo doc={doc} />
      </div>
    </React.Fragment>
  )
}
