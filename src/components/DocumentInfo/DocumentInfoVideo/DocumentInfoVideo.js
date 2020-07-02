import React from 'react'
import ReactPlayer from 'react-player'
import styles from './DocumentInfoVideo.module.scss'
import DocumentInfoBox from '../DocumentInfoBox'

export default function DocumentInfoVideo({ doc }) {
  const WrapPlayer = React.forwardRef(({ children, ...props }, ref) => (
    <div className={styles.PlayerWrapper} {...props} ref={ref}>
      {children}
      <div className={styles.Controls}>MayBe Control Ma Video!</div>
    </div>
  ))

  return (
    <div className={styles.VideoContainer}>
      <div className={styles.PlayerContainer}>
        <ReactPlayer
          wrapper={WrapPlayer}
          width="80%"
          height="80%"
          url={doc.url}
          controls
        />
      </div>
      <DocumentInfoBox doc={doc} />
    </div>
  )
}
