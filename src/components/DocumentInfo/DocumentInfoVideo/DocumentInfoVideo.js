import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './DocumentInfoVideo.module.scss'
import DocumentInfoBox from '../DocumentInfoBox'
import Video from '../../Video'

export default function DocumentInfoVideo({ doc }) {
  const { i18n } = useTranslation()
  const videoUrl =
    doc.data.translated_urls && doc.data.translated_urls instanceof String
      ? doc.data.translated_urls
      : doc.url

  const sub = useMemo(() => {
    if (doc.data.subtitles) {
      const elm = doc.data.subtitles.filter(
        (d) => d.type === 'vtt' && d.language === i18n.language
      )[0]
      if (elm) {
        return { url: elm.url, lang: i18n.language.split('_')[0] }
      } else {
        return { url: false }
      }
    } else {
      return { url: false }
    }
  }, [i18n.language, doc])

  return (
    <React.Fragment>
      <div className={styles.VideoContainer}>
        <div className={styles.PlayerWrapper}>
          {videoUrl && (
            <Video url={videoUrl} width="auto" height="auto" sub={sub} />
          )}
        </div>
      </div>
      <DocumentInfoBox doc={doc} />
    </React.Fragment>
  )
}
