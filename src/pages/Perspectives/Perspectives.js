import React from 'react'
import classNames from 'classnames'
import { useCacheStory, useCacheStories, usePrefetchStory } from '../../miller'
import Menu from '../../components/Menu'
import styles from './Perspectives.module.scss'
import LangLink from '../../components/LangLink'

const themesParams = {
  limit: 50,
  orderby: 'priority',
  filters: { tags__slug: 'theme' },
  exclude: { slug: 'outline-1' },
}

function ThemeListItem({ theme, ...props }) {
  const prefetchTheme = usePrefetchStory()
  return (
    <div {...props}>
      <LangLink
        onClick={() => {
          prefetchTheme(theme.slug, {
            withChapters: true,
          })
        }}
        to={`/perspectives/${theme.slug}`}
      >
        <h3>{theme.data.title}</h3>
        <img
          alt={theme.data.title}
          src={theme.covers?.[0]?.data?.resolutions?.preview?.url}
        />
      </LangLink>
    </div>
  )
}

export default function Perspectives() {
  const [perspectivesStory] = useCacheStory('perspectives')
  const [{ stories: themes }] = useCacheStories(themesParams)

  return (
    <div>
      <Menu />
      <div className={styles.ThemeListContainer}>
        {themes.map((theme, i) => {
          return (
            <ThemeListItem
              key={theme.id}
              theme={theme}
              className={classNames(styles.ThemeListItem, {
                [styles.shifted]: i % 2 === 1,
              })}
            />
          )
        })}
      </div>
    </div>
  )
}
