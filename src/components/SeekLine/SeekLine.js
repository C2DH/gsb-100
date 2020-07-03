import React, { useRef } from 'react'
import classNames from 'classnames'
import styles from './SeekLine.module.scss'

function SeekLine({ index, progress, onSeek, title, subtitle }) {
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

  return (
    <div
      className={classNames(
        styles.SeekContent,
        index > 2 ? styles.SeekContentBig : styles.SeekContentSmall,
        { [styles.active]: progress > 0 }
      )}
    >
      <div className={styles.SeekLineContainer}>
        <p className={styles.SeekLineText}>{title}</p>
        <div
          ref={seekLineRef}
          onClick={handleClick}
          className={styles.SeekBackground}
        >
          <div className={styles.SeekProgress} style={{ width }} />
        </div>
        <p className={styles.SeekLineText}>{subtitle}</p>
      </div>
    </div>
  )
}

export default React.memo(SeekLine)