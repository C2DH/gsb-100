import React from 'react'
import ReactPlayer from 'react-player'
import classNames from 'classnames'
import styles from './YtVideo.module.scss'

function YtVideo({ url, detail }) {
  return (
    <div
      className={classNames(styles.playerWrapper, {
        [styles.detail]: detail,
      })}
    >
      <ReactPlayer
        className={styles.reactPlayer}
        url={url}
        width="100%"
        height="100%"
      />
    </div>
  )
}

export default YtVideo
