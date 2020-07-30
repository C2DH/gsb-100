import React, { useState } from 'react'
import DocLink from '../DocLink'
import IconSwitch from '../IconSwitch'
import PopoverPreview from '../PopoverPreview'
import styles from './DocumentsGrid.module.scss'

function DocumentGridItem({ doc }) {
  const [show, setShow] = useState(false)
  const imageUrl = doc.data.resolutions?.thumbnail.url

  return (
    <div
      className={styles.itemBlock}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <DocLink document={doc}>
        {imageUrl ? (
          <img
            className={styles.smallImage}
            alt={doc.data.title.substring(0, 10)}
            src={imageUrl}
          />
        ) : (
          <div className="w-100 h-100 border bg-secondary d-flex align-items-center justify-content-center">
            <IconSwitch color={'white'} type={doc.type}></IconSwitch>
          </div>
        )}
      </DocLink>
      {show && <PopoverPreview doc={doc}></PopoverPreview>}
    </div>
  )
}

export default React.memo(DocumentGridItem)
