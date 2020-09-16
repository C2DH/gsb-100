import React from 'react'
import { useLocation } from 'react-router-dom'
import { usePrefetchDocument } from '../../miller'
import IconSwitch from '../../components/IconSwitch'
import LangLink from '../../components/LangLink'
import styles from './ExplorationsCategory.module.scss'

function ExplorationsCategoryImage({ doc }) {
  const url = doc.data.resolutions?.thumbnail.url
  const location = useLocation()
  const prefetchDocument = usePrefetchDocument()

  return (
    <div key={doc.id} className={styles.previewContainer}>
      <LangLink
        onClick={() => {
          prefetchDocument(doc.id)
        }}
        to={{
          pathname: `/documents/${doc.id}`,
          state: { background: location, modalDocument: doc },
        }}
      >
        {url ? (
          <img
            className={`${styles.preview} mr-2`}
            alt={doc.data.title}
            src={url}
          />
        ) : (
          <div className={`${styles.notFound} mr-2`}>
            <IconSwitch type={doc.type}></IconSwitch>
          </div>
        )}
      </LangLink>
    </div>
  )
}

export default ExplorationsCategoryImage
