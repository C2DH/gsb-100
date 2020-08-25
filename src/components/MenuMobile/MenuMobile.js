import React, { useState } from 'react'
import classNames from 'classnames'
import { Menu, X } from 'react-feather'
import { useCacheStories, useCacheStory, usePrefetchStory } from '../../miller'
import SwitchLanguageMobile from '../SwitchLanguageMobile'
import styles from './MenuMobile.module.scss'
import LangLink from '../LangLink'
import LangNavLink from '../LangNavLink'

const pagesId = ['outline', 'perspectives', 'explorations', 'about']
const params = {
  limit: pagesId.length,
  orderby: 'priority',
  filters: { slug__in: pagesId },
}

function MenuMobile({ title }) {
  const [open, setOpen] = useState(false)
  const [{ stories }] = useCacheStories(params)
  const [homeStory] = useCacheStory('home')
  const prefetchStory = usePrefetchStory()

  return (
    <React.Fragment>
      <div
        id={styles.menuTop}
        className="bg-secondary d-flex py-2 px-3 align-items-center justify-content-between"
      >
        <h5 className="m-0 text-primary">{`01. ${title}`}</h5>
        <div
          className="btn btn-secondary"
          onClick={() => {
            setOpen(true)
          }}
        >
          <Menu></Menu>
        </div>
      </div>
      <div
        id={styles.menuSlide}
        className={classNames('bg-secondary d-flex flex-column', {
          [styles.open]: open,
        })}
      >
        <div
          id={styles.slideTop}
          className="d-flex align-items-center justify-content-between px-3"
        >
          <LangLink id={styles.navbarBrand} to="/">
            {[
              homeStory.data.title.replace(/\s.*/, ''),
              homeStory.data.title.replace(/\S+\s/, ''),
            ].map((d, i) => (
              <h3 key={i} className="m-0">
                {d}
              </h3>
            ))}
          </LangLink>
          <div
            className="btn btn-secondary"
            onClick={() => {
              setOpen(false)
            }}
          >
            <X></X>
          </div>
        </div>

        <div className="flex-grow-1 d-flex flex-column">
          {stories.map((d, i) => {
            return (
              <div
                key={d.slug}
                className={classNames('flex-grow-1', `${styles.navLinkCont}`)}
              >
                <LangNavLink
                  to={d.slug}
                  onMouseOver={() => prefetchStory(d.slug)}
                  activeClassName={styles.active}
                  className={`${styles.navLink} nav-item nav-link text-center d-flex align-items-center h-100 justify-content-center`}
                >
                  {d.slug !== 'about' &&
                    (i + 1).toString().padStart(2, '0') + '. '}
                  {d.data.title}
                </LangNavLink>
              </div>
            )
          })}
        </div>
        <SwitchLanguageMobile />
      </div>
    </React.Fragment>
  )
}

export default React.memo(MenuMobile)
