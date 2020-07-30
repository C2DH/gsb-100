import React, { useState } from 'react'
import DocLink from '../DocLink'
import IconSwitch from '../IconSwitch'
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
            alt={doc.data.title}
            src={imageUrl}
          />
        ) : (
          <div className="w-100 h-100 border bg-secondary d-flex align-items-center justify-content-center">
            <IconSwitch color={'white'} type={doc.type}></IconSwitch>
          </div>
        )}
      </DocLink>
      {show && (
        <div className={styles.popover}>
          <div>
            <p className={`${styles.label} m-0 text-capitalize text-primary`}>
              {doc.data.type}
            </p>
          </div>
          <div className="flex-grow-1 flex-shrink-1 d-flex overflow-hidden flex-column my-2">
            {imageUrl ? (
              <img
                className={styles.popoverImage}
                alt={doc.data.title}
                src={imageUrl}
              />
            ) : (
              <div className="w-100 h-100 border bg-secondary d-flex align-items-center justify-content-center">
                <IconSwitch color={'white'} type={doc.type}></IconSwitch>
              </div>
            )}
          </div>
          <div>
            <p className="m-0">{doc.data.title}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default React.memo(DocumentGridItem)
