import React from 'react'
import classNames from 'classnames'
import styles from './DocumentInfoBox.module.scss'

const InfoRow = ({ label, value }) => (
  <div className={classNames(styles.InfoRow, 'd-flex justify-content-between')}>
    <div className="text-primary">{label}</div>
    <div className={'text-white'}>{value}</div>
  </div>
)

export default function DocumentInfoBox({ doc }) {
  return (
    <div className={styles.InfoBoxContainer}>
      <div className={styles.InfoBox}>
        <div className={classNames(styles.Label, 'text-capitalize')}>
          {doc.type}
        </div>
        <h2>{doc.title}</h2>
        <div className={classNames('row no-gutters', styles.InfoRowsGroup)}>
          <div className="col-md-8 d-flex justify-content-between">
            <div className="text-primary">Desription</div>
            <div className="flex-grow-1 pl-4">
              {doc.data.description || 'hahahaaha'}
            </div>
          </div>
          <div className={classNames('col-md-4', styles.InfoRows)}>
            <InfoRow label="Date" value={doc.data.date} />
            <InfoRow label="Provenance" value={doc.data.date} />
            <InfoRow label="Copyright" value={doc.data.copyright} />
          </div>
        </div>
      </div>
    </div>
  )
}
