import React from 'react'
import DocLink from '../DocLink'
import IconSwitch from '../IconSwitch'
import styles from './DocumentsGrid.module.scss'

function DocumentGridItem({ doc }) {
  const imageUrl = doc.data.resolutions?.thumbnail.url

  return (
    <div className={styles.itemBlock}>
      <DocLink document={doc}>
        {imageUrl ? (
          <img title={doc.title} alt={doc.title} src={imageUrl} />
        ) : (
          <div className="w-100 h-100 border bg-secondary d-flex align-items-center justify-content-center">
            <IconSwitch color={'white'} type={doc.type}></IconSwitch>
          </div>
        )}
      </DocLink>
    </div>
  )
}

export default React.memo(DocumentGridItem)
