import React, { useState, useCallback } from 'react'
import OutlineDocumentModal from '../OutlineDocumentModal'
import styles from './PlayingDocument.module.scss'

function PlayingDocument({ document }) {
  const [showModal, setShowModal] = useState(false)
  const toggleModal = useCallback(() => {
    setShowModal((a) => !a)
  }, [])
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
