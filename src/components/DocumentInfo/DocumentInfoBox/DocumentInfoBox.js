import React from 'react'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import DocumentInfoMetadata from '../DocumentInfoMetadata'
import styles from './DocumentInfoBox.module.scss'

export default function DocumentInfoBox({ doc }) {
  const { t } = useTranslation()
  return (
    <div
      className={classNames(
        'pt-3 pb-0 pt-lg-3 pb-lg-3 ',
        styles.InfoBoxContainer
      )}
    >
      <div className="container">
        <div className="row">
          <div className="col-12 col-lg-10 offset-lg-1 pl-auto pl-lg-0">
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
          <div
            className={`${styles.rowBorder} col-12 col-lg-2 offset-lg-1 pt-3 pl-auto pl-lg-0`}
          >
            <div className="text-primary text-capitalize">
              {t('description')}
            </div>
          </div>
          <div
            className={`${styles.rowDesc} col-12 col-lg-5 pt-3 pb-3 pb-lg-0`}
          >
            {doc.data.description}
          </div>
          <div
            className={`${styles.rowBorder} col-12 col-lg-3 pr-0 pl-0 pl-lg-auto`}
          >
            <DocumentInfoMetadata data={doc.data}></DocumentInfoMetadata>
          </div>
        </div>
      </div>
    </div>
  )
}
