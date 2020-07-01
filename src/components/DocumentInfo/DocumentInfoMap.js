import React from 'react'
import styles from './DocumentInfoMap.module.scss'

export default function DocumentInfoMap({ doc }) {
  return (
    <div className="row no-gutters h-100 py-4">
      <div className="col-md-5 offset-md-2">
        <div className={styles.MapImageContainer}>
          <div className={styles.MapImageWrapper}>
            <img
              title={doc.title}
              alt={doc.title}
              src={doc.data.translated_urls}
            />
          </div>
        </div>
      </div>
      <div className='col-md-3'>
        <div className={styles.InfoBoxContainer}>
          <div>
            <div className={styles.InfoLabel}>Map</div>
            <h2>{doc.data.title}</h2>
            <p>{doc.data.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}