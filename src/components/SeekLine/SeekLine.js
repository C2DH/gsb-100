import React, { useRef, useState } from 'react'
import classNames from 'classnames'
import styles from './SeekLine.module.scss'

function SeekLine({ index, progress, onSeek, title, abstract }) {
  const [widthPreview, setWidthPreview] = useState(0)
  const width = progress === null ? 0 : progress * 100 + '%'
  const seekLineRef = useRef()

  function handleClick(e) {
    const clientX = e.clientX
    const { left, width } = seekLineRef.current.getBoundingClientRect()
    const nextProgress = Math.min(
      Math.max(clientX - parseInt(left), 0) / width,
      1
    )
    onSeek(index, nextProgress)
  }

  function handleMouseMove(e) {
    const clientX = e.clientX
    const { left, width } = seekLineRef.current.getBoundingClientRect()
    setWidthPreview(
      Math.min(Math.max(clientX - parseInt(left), 0) / width, 1) * 100
    )
  }

  function handleMouseLeave() {
    setWidthPreview(0)
  }

  return (
    <div
      className={classNames(
        styles.SeekContent,
        index > 2 ? styles.SeekContentBig : styles.SeekContentSmall,
        { [styles.active]: progress > 0 }
      )}
    >
      <div className={styles.SeekLineContainer}>
        <p onClick={() => onSeek(index, 0)} className={styles.SeekLineText}>
          {title}
        </p>
        <div
          ref={seekLineRef}
          onClick={handleClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={styles.SeekBackground}
        >
          <div
            className={styles.SeekPreview}
            style={{ width: `${widthPreview}%` }}
          />
          <div className={styles.SeekProgress} style={{ width }} />
        </div>
        <p className={styles.SeekLineText}>{abstract}</p>
      </div>
    </div>
  )
}

export default React.memo(SeekLine)
