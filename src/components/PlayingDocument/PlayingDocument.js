import React, { useState, useCallback } from 'react'
import { Transition } from 'react-spring/renderprops'
import OutlineDocumentModal from '../OutlineDocumentModal'
import styles from './PlayingDocument.module.scss'

function PlayingDocument({ document, onClick, style }) {
  const [showModal, setShowModal] = useState(false)
  const toggleModal = useCallback(
    (e) => {
      setShowModal((a) => !a)
      onClick && onClick(e)
    },
    [onClick]
  )
  return (
    <React.Fragment>
      <img
        className={`${styles.PlayingDocument} customCursor`}
        src={document.data.translated_thumb_urls}
        onClick={toggleModal}
        alt={document.data.title}
        style={style}
      />
      <Transition
        items={showModal}
        from={{ opacity: 0 }}
        enter={{ opacity: 1 }}
        leave={{ opacity: 0 }}
      >
        {(showModal) =>
          showModal &&
          ((props) => (
            <OutlineDocumentModal
              doc={document}
              onClose={toggleModal}
              style={props}
            />
          ))
        }
      </Transition>
    </React.Fragment>
  )
}

export default React.memo(PlayingDocument)
