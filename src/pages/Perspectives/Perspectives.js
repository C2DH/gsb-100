import React from 'react'
import classNames from 'classnames'
import { useCacheStory, useCacheStories, usePrefetchStory } from '../../miller'
import Menu from '../../components/Menu'
import MenuMobile from '../../components/MenuMobile'
import styles from './Perspectives.module.scss'
import LangLink from '../../components/LangLink'

const themesParams = {
  limit: 50,
  orderby: 'priority',
  filters: { tags__slug: 'theme' },
  exclude: { slug: 'outline-1' },
}

function ThemeListItem({ theme, ...props }) {
  const prefetchStory = usePrefetchStory()
  return (
    <div {...props}>
      <LangLink
        onClick={() => {
          prefetchStory(theme.slug)
        }}
        to={`/perspectives/${theme.slug}`}
      >
        <div
          className={styles.infoCont}
          style={{
            backgroundImage: `url(${theme.covers?.[0]?.data?.resolutions?.preview?.url})`,
          }}
        >
          <h2>{theme.data.title}</h2>
          <img
            className="d-none d-lg-block"
            alt={theme.data.title}
            src={theme.covers?.[0]?.data?.resolutions?.preview?.url}
          />
        </div>
      </LangLink>
    </div>
  )
}

export default function Perspectives() {
  const [perspectivesStory] = useCacheStory('perspectives')
  const [{ stories: themes }] = useCacheStories(themesParams)

  return (
    <div className="h-100 d-flex flex-column">
      <div className="d-none d-lg-block">
        <Menu />
      </div>
      <div className="d-block d-lg-none">
        <MenuMobile title={perspectivesStory.data.title} />
      </div>
      <div className={styles.ThemeListContainer}>
        <div className="container">
          <div className="row">
            {themes.map((theme, i) => {
              return (
                <ThemeListItem
                  key={theme.id}
                  theme={theme}
                  className={classNames(
                    'col-12 col-lg-6',
                    styles.ThemeListItem,
                    {
                      [styles.shifted]: i % 2 === 1,
                    }
                  )}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
