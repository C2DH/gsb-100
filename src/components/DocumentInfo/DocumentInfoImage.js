import React from 'react'
import classNames from 'classnames'
import ZoomAndPanMedia from '../ZoomAndPanMedia'
import styles from './DocumentInfoImage.module.scss'

const InfoRow = ({ label, value }) => (
  <div className={classNames(styles.InfoRow, 'd-flex justify-content-between')}>
    <div className='text-primary'>{label}</div>
    <div className={'text-white'}>{value}</div>
  </div>
)

export default function DocumentInfoImage({ doc }) {
  return (
    <div className={styles.InfoImageContainer}>
      <ZoomAndPanMedia src={doc.attachment} />
      <div className={styles.InfoBoxContainer}>
        <div className={styles.InfoBox}>
          <div className={styles.Label}>Image</div>
          <h2>{doc.title}</h2>
          <div className={classNames("row no-gutters", styles.InfoRowsGroup)}>
            <div className="col-md-8 d-flex justify-content-between">
              <div className="text-primary">Desription</div>
              <div className="text-center flex-grow-1">
                {doc.data.description || 'hahahaaha'}
              </div>
            </div>
            <div className={classNames("col-md-4", styles.InfoRows)}>
              <InfoRow label="Date" value={doc.data.date} />
              <InfoRow label="Provenance" value={doc.data.date} />
              <InfoRow label="Copyright" value={doc.data.creator} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
