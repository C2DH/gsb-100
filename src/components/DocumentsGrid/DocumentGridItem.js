import React, { useState } from 'react'
import { useTransition } from 'react-spring'
import { usePopper } from 'react-popper'
import Portal from '../Portal'
import DocLink from '../DocLink'
import IconSwitch from '../IconSwitch'
import PopoverPreview from '../PopoverPreview'
import styles from './DocumentsGrid.module.scss'

function DocumentGridItem({ doc }) {
  const [show, setShow] = useState(false)
  const [referenceElement, setReferenceElement] = useState(null)
  const [popperElement, setPopperElement] = useState(null)

  const popper = usePopper(referenceElement, popperElement, {
    strategy: 'fixed',
  })

  const transition = useTransition(show, null, {
    from: { opacity: 0, transform: 'scale(0.25)' },
    enter: { opacity: 1, transform: 'scale(1)' },
    leave: { opacity: 0, transform: 'scale(0.25)' },
  })

  const imageUrl = doc.data.resolutions?.thumbnail.url

  return (
    <React.Fragment>
      <div
        className={styles.itemBlock}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        ref={setReferenceElement}
      >
        <DocLink document={doc}>
          {imageUrl ? (
            <img
              className={styles.smallImage}
              alt={doc.data.title.substring(0, 10)}
              src={imageUrl}
            />
          ) : (
            <div
              className={`${styles.smallPreview} border bg-secondary d-flex align-items-center justify-content-center`}
            >
              <IconSwitch color={'white'} type={doc.type}></IconSwitch>
            </div>
          )}
        </DocLink>
      </div>
      {/*{transition.map(
        ({ item, key, props }) =>
          item && (
            <Portal key={key} selector={'body'}>
              <PopoverPreview
                ref={setPopperElement}
                doc={doc}
                style={props}
                popper={popper}
              ></PopoverPreview>
            </Portal>
          )
      )}*/}
      {transition.map(
        ({ item, key, props }) =>
          item && (
            <PopoverPreview
              key={key}
              ref={setPopperElement}
              doc={doc}
              style={props}
              popper={popper}
            ></PopoverPreview>
          )
      )}
    </React.Fragment>
  )
}

export default React.memo(DocumentGridItem)
