import React from 'react'
import DocumentGridItem from './DocumentGridItem'
import styles from './DocumentsGrid.module.scss'

export default function DocumentsGrid({ documents }) {
  return (
    <div className={styles.gridContainer}>
      {documents.map((doc) => (
        <DocumentGridItem key={doc.id} doc={doc} />
      ))}
    </div>
  )
}
