import React from 'react'
import { useBodyNoOverflow } from '../../hooks'
import { X } from 'react-feather'
import styles from './OutlineDocumentModal.module.scss'

export default function OutlineDocumentModal({ doc, onClose }) {
  useBodyNoOverflow()
  return (
    <div className={styles.ModalContainer}>
      <div className={styles.close} onClick={onClose}>
        <X size={30} />
      </div>
      <div className="row no-gutters h-100 py-4">
        <div className="col-md-5 offset-md-2">
          <div className={styles.ImageContainer}>
            <div className={styles.ImageWrapper}>
              <img
                title={doc.title}
                alt={doc.title}
                src={doc.data.translated_urls}
              />
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className={styles.InfoBoxContainer}>
            <div>
              <div className={styles.InfoLabel}>Map</div>
              <h2>{doc.data.title}</h2>
              <p>{doc.data.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
