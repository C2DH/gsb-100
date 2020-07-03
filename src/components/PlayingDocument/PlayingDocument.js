import React, { useState, useCallback } from 'react'
import OutlineDocumentModal from '../OutlineDocumentModal'
import styles from './PlayingDocument.module.scss'

function PlayingDocument({ document, onClick }) {
  const [showModal, setShowModal] = useState(false)
  const toggleModal = useCallback((e) => {
    setShowModal((a) => !a)
    onClick && onClick(e)
  }, [onClick])
  return (
    <>
      <div className={`${styles.PlayingDocument} m-5`} onClick={toggleModal}>
        <img src={document.data.translated_thumb_urls} alt={document.title} />
      </div>
      {showModal && (
        <OutlineDocumentModal doc={document} onClose={toggleModal} />
      )}
    </>
  )
}

export default React.memo(PlayingDocument)
