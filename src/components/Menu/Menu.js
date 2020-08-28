import React from 'react'
import classNames from 'classnames'
import { useCacheStories, useCacheStory, usePrefetchStory } from '../../miller'
import SwitchLanguage from '../SwitchLanguage'
import styles from './Menu.module.scss'
import LangLink from '../LangLink'
import LangNavLink from '../LangNavLink'

const pagesId = ['outline', 'perspectives', 'explorations', 'about']
const params = {
  limit: pagesId.length,
  orderby: 'priority',
  filters: { slug__in: pagesId },
}

function Menu() {
  const [{ stories }] = useCacheStories(params)
  const [homeStory] = useCacheStory('home')
  const prefetchStory = usePrefetchStory()

  return (
    <nav
      id={styles.navbar}
      className="nav px-2 justify-content-start align-items-center navbar-dark bg-secondary d-none d-lg-flex"
    >
      <LangLink id={styles.navbarBrand} className="navbar-brand" to="/">
        {[
          homeStory.data.title.replace(/\s.*/, ''),
          homeStory.data.title.replace(/\S+\s/, ''),
        ].map((d, i) => (
          <h3 key={i} className="m-0">
            {d}
          </h3>
        ))}
      </LangLink>
      <div className="d-flex flex-grow-1 align-self-stretch">
        <div className="d-flex flex-grow-1 h-100 align-items-center">
          {stories.map((d, i) => {
            return (
              <div
                key={d.slug}
                className={classNames(`${styles.navLinkCont}`, {
                  'flex-fill': d.slug !== 'about',
                })}
              >
                <LangNavLink
                  to={d.slug}
                  onMouseOver={() => prefetchStory(d.slug)}
                  activeClassName={styles.active}
                  className={`${styles.navLink} nav-item nav-link text-center`}
                >
                  {d.slug !== 'about' &&
                    (i + 1).toString().padStart(2, '0') + '. '}
                  {d.data.title}
                </LangNavLink>
              </div>
            )
          })}
        </div>
        <SwitchLanguage />
      </div>
    </nav>
  )
}

export default React.memo(Menu)
