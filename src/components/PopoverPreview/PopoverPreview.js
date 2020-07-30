import React from 'react'
import IconSwitch from '../IconSwitch'
import styles from './PopoverPreview.module.scss'

function PopoverPreview({ doc }) {
  const imageUrl = doc.data.resolutions?.thumbnail.url
  return (
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
  )
}

export default PopoverPreview
