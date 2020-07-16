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
    <>
      {/*<div className={`${styles.PlayingDocument} m-5`} onClick={toggleModal}>
        <img src={document.data.translated_thumb_urls} alt={document.title} />
      </div>*/}
      <img
        className={`${styles.PlayingDocument} customCursor`}
        src={document.data.translated_thumb_urls}
        onClick={toggleModal}
        alt={document.data.title}
      />
      {showModal && (
        <OutlineDocumentModal doc={document} onClose={toggleModal} />
      )}
    </>
  )
}

export default React.memo(PlayingDocument)
