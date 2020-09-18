import React from 'react'
import classNames from 'classnames'
import Media from 'react-media'
import Header from '../../components/Header'
import { BREAKPOINTS } from '../../utils'
import { useCacheStory, useCacheStories, usePrefetchStory } from '../../miller'
import MenuResponsive from '../../components/MenuResponsive'
import LangLink from '../../components/LangLink'
import PerspectivesGrid from '../../components/PerspectivesGrid'
import styles from './Perspectives.module.scss'

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
            backgroundImage:
              'url(' + theme.covers?.[0]?.data?.resolutions?.preview?.url + ')',
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
    <React.Fragment>
      <Header
        title={perspectivesStory.data.title}
        description={perspectivesStory.data.abstract}
      ></Header>
      <div className="h-100 d-flex flex-column">
        <MenuResponsive
          level={'02'}
          title={perspectivesStory.data.title}
        ></MenuResponsive>
        <div className={`${styles.ThemeListContainer} my-0 my-lg-4`}>
          <Media queries={BREAKPOINTS}>
            {(matches) =>
              matches.md ? (
                <div className="container">
                  <div className="row">
                    <div className="col-12">
                      <p className="mt-2">{perspectivesStory.data.abstract}</p>
                    </div>
                    {themes.map((theme, i) => {
                      return (
                        <ThemeListItem
                          key={theme.id}
                          theme={theme}
                          className={classNames(
                            'col-12 col-lg-6',
                            styles.ThemeListItem
                          )}
                        />
                      )
                    })}
                  </div>
                </div>
              ) : (
                <PerspectivesGrid
                  themes={themes}
                  description={perspectivesStory.data.abstract}
                ></PerspectivesGrid>
              )
            }
          </Media>
        </div>
      </div>
    </React.Fragment>
  )
}
