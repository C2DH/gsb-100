import React from 'react'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import DocumentInfoMetadata from '../DocumentInfoMetadata'
import styles from './DocumentInfoBox.module.scss'

export default function DocumentInfoBox({ doc }) {
  const { t } = useTranslation()
  return (
    <div className={classNames('py-3', styles.InfoBoxContainer)}>
      <div className="container">
        <div className="row">
          <div className="col-10 offset-md-1 pl-0">
            <p
              className={classNames(
                'text-capitalize text-primary mb-1',
                styles.label
              )}
            >
              {t(doc.data.type)}
            </p>
            <h2>{doc.data.title}</h2>
          </div>
        </div>
        <div className={`row mt-2`}>
          <div className={`${styles.rowBorder} col-2 offset-md-1 pt-3 pl-0`}>
            <div className="text-primary">{t('Description')}</div>
          </div>
          <div className={`${styles.rowBorder} col-md-5 pt-3`}>
            {doc.data.description}
          </div>
          <div className={`${styles.rowBorder} col-md-3 pr-0`}>
            <DocumentInfoMetadata data={doc.data}></DocumentInfoMetadata>
          </div>
        </div>
      </div>
    </div>
  )
}
