import React from 'react'
import Menu from '../../components/Menu'
import { useParams } from 'react-router-dom'
import { useCacheStory } from '../../miller'
import styles from './PerspectiveDetail.module.scss'
import PerspectiveChapter from '../../components/PerspectiveChapter'

export default function PerspectiveDetail() {
  const { slug } = useParams()
  const [theme] = useCacheStory(slug, {
    withChapters: true,
  })

  const { chapters } = theme.data

  console.log(theme, chapters)

  return (
    <div>
      <Menu />
      <h1>{theme.data.title}</h1>
      <p>{theme.data.abstract}</p>

      <div className={styles.Chapters}>
        {chapters.map(chapter => (
          <div key={chapter.id} className={styles.Chapter}>
            <PerspectiveChapter chapter={chapter} />
          </div>
        ))}
      </div>
    </div>
  )
}