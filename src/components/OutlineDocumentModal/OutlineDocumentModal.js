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
      <div className="container h-100 d-flex flex-column">
        <div className="row h-100 align-items-center flex-grow-1">
          <div className={`${styles.colImg} col-12 col-lg-7`}>
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
          <div className={`${styles.colOverflow} col-3 d-none d-lg-block`}>
            <div className={styles.InfoLabel}>{doc.data.type}</div>
            <h2 className="pb-3 mb-3 border-bottom border-light">
              {doc.data.title}
            </h2>
            <p className="text-white-50">{doc.data.description}</p>
          </div>
        </div>
        <div className="row d-lg-none">
          <div className="col-12">
            <div className={styles.InfoLabel}>{doc.data.type}</div>
            <h3 className="pb-2 mb-2 border-bottom border-light">
              {doc.data.title}
            </h3>
            <p className="text-white-50">{doc.data.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
