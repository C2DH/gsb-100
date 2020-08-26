import React, { useState, useCallback } from 'react'
import OutlineDocumentModal from '../OutlineDocumentModal'
import styles from './PlayingDocument.module.scss'

function PlayingDocument({ document, onClick }) {
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
      />
      {showModal && (
        <OutlineDocumentModal doc={document} onClose={toggleModal} />
      )}
    </React.Fragment>
  )
}

export default React.memo(PlayingDocument)
