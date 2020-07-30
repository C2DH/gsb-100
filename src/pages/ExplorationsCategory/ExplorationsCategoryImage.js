import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { usePrefetchDocument } from '../../miller'
import IconSwitch from '../../components/IconSwitch'
import PopoverPreview from '../../components/PopoverPreview'
import LangLink from '../../components/LangLink'
import styles from './ExplorationsCategory.module.scss'

function ExplorationsCategoryImage({ doc }) {
  const [show, setShow] = useState(false)
  const url = doc.data.resolutions?.thumbnail.url
  const location = useLocation()
  const prefetchDocument = usePrefetchDocument()

  return (
    <div
      key={doc.id}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      className={styles.previewContainer}
    >
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
      {/*{show && <PopoverPreview doc={doc}></PopoverPreview>}*/}
    </div>
  )
}

export default ExplorationsCategoryImage
