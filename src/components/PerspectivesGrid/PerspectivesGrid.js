import React from 'react'
import classNames from 'classnames'
import { shuffle } from 'seed-shuffle'
import { Trail } from 'react-spring/renderprops'
import LangLink from '../../components/LangLink'
import { usePrefetchStory } from '../../miller'
import styles from './PerspectivesGrid.module.scss'

const RANDOM_SEED = 1 + Math.floor(Math.random() * 1000)

function PerspectivesGrid({ themes, description }) {
  const prefetchStory = usePrefetchStory()
  return (
    <div
      className={`${styles.grid} ${
        styles['grid' + (Math.floor(Math.random() * 2) + 1)]
      }`}
    >
      <div className={styles.gridItem}>
        <p className="mb-0">{description}</p>
        <div className={styles.shadow}></div>
      </div>
      <Trail
        items={shuffle(themes, RANDOM_SEED)}
        keys={(theme) => theme.id}
        from={{ opacity: 0 }}
        to={{ opacity: 0.8 }}
      >
        {(theme) => (props) => (
          <LangLink
            onClick={() => {
              prefetchStory(theme.slug)
            }}
            to={`/perspectives/${theme.slug}`}
            className={classNames(styles.gridItem, styles.image)}
            style={{
              backgroundImage:
                'url(' +
                theme.covers?.[0]?.data?.resolutions?.preview?.url +
                ')',
              opacity: props.opacity,
            }}
          >
            <h3>{theme.data.title}</h3>
          </LangLink>
        )}
      </Trail>
    </div>
  )
}

export default PerspectivesGrid
