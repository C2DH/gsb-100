import React from 'react'
import Media from 'react-media'
import DocumentGridItem from './DocumentGridItem'
import { BREAKPOINTS } from '../../utils'
import styles from './DocumentsGrid.module.scss'

export default function DocumentsGrid({ documents }) {
  return (
    <Media queries={BREAKPOINTS}>
      {(matches) => (
        <div className={styles.gridContainer}>
          {documents.map((doc) => (
            <DocumentGridItem key={doc.id} doc={doc} mobile={matches.md} />
          ))}
        </div>
      )}
    </Media>
  )
}
