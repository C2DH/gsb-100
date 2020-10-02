import React, { Suspense, useCallback } from 'react'
import { Collapse, CardBody, Card } from 'reactstrap'
import Media from 'react-media'
import { ChevronDown } from 'react-feather'
import PerspectiveModule from '../PerspectiveModule'
import { useCacheStory } from '../../miller'
import { BREAKPOINTS } from '../../utils'
import styles from './PerspectiveChapter.module.scss'

function PerspectiveChapterContent({ chapterId, isOpen, setOpenChapter }) {
  const [chapter] = useCacheStory(chapterId)
  const { modules } = chapter.contents
  const toggle = useCallback(
    () => setOpenChapter((openId) => (openId === chapterId ? null : chapterId)),
    [setOpenChapter, chapterId]
  )

  return (
    <Media queries={BREAKPOINTS}>
      {(matches) =>
        matches.sm ? (
          <React.Fragment>
            <div
              className={`${styles.mobileTitle} d-flex align-items-center`}
              onClick={toggle}
            >
              <h3 className="m-0">{chapter.data.title}</h3>
              <div className="ml-auto">
                <ChevronDown
                  className={`${styles.chevron} text-primary`}
                  style={{
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                ></ChevronDown>
              </div>
            </div>
            <Collapse isOpen={isOpen}>
              <Card className="border-0 bg-gray">
                <CardBody className="p-0">
                  {modules.map((module, index) => (
                    <div key={index}>
                      <PerspectiveModule module={module} />
                    </div>
                  ))}
                </CardBody>
              </Card>
            </Collapse>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <h3 className={`${styles.title} m-0 py-4`}>{chapter.data.title}</h3>
            {modules.map((module, index) => (
              <div key={index}>
                <PerspectiveModule module={module} />
              </div>
            ))}
          </React.Fragment>
        )
      }
    </Media>
  )
}

function PerspectiveChapter({ chapterId, ...props }) {
  return (
    <div
      className={`${styles.chapter} text-secondary px-md-4 pb-md-4 pt-md-0 pb-2 px-3 pt-2  position-relative`}
    >
      <Suspense
        fallback={<h3 className="text-secondary">Loading chapter....</h3>}
      >
        <PerspectiveChapterContent chapterId={chapterId} {...props} />
      </Suspense>
    </div>
  )
}

export default React.memo(PerspectiveChapter)
