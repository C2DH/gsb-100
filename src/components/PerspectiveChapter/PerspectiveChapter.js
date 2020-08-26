import React, { Suspense } from 'react'
import { UncontrolledCollapse, CardBody, Card } from 'reactstrap'
import Media from 'react-media'
import { ChevronDown, ChevronUp } from 'react-feather'
import PerspectiveModule from '../PerspectiveModule'
import { useCacheStory } from '../../miller'
import styles from './PerspectiveChapter.module.scss'

const BREAKPOINTS = {
  xs: { maxWidth: 566 },
  sm: { maxWidth: 767 },
  md: { maxWidth: 991 },
  lg: { maxWidth: 1199 },
  xl: { maxWidth: 1399 },
}

function PerspectiveChapterContent({ chapterId }) {
  const [chapter] = useCacheStory(chapterId)
  const { modules } = chapter.contents
  return (
    <Media queries={BREAKPOINTS}>
      {(matches) =>
        matches.sm ? (
          <div>
            <div className="d-flex align-items-center" id={`c_${chapterId}`}>
              <h3 className="m-0">{chapter.data.title}</h3>
              <div className="ml-auto">
                <ChevronDown className="text-primary"></ChevronDown>
              </div>
            </div>
            <UncontrolledCollapse toggler={`#c_${chapterId}`}>
              <Card className="border-0">
                <CardBody className="p-0">
                  {modules.map((module, index) => (
                    <div className="my-4" key={index}>
                      <PerspectiveModule module={module} />
                    </div>
                  ))}
                </CardBody>
              </Card>
            </UncontrolledCollapse>
          </div>
        ) : (
          <React.Fragment>
            <h3 className={`${styles.title} m-0 py-4`}>{chapter.data.title}</h3>
            {modules.map((module, index) => (
              <div className="my-4" key={index}>
                <PerspectiveModule module={module} />
              </div>
            ))}
          </React.Fragment>
        )
      }
    </Media>
  )
}

function PerspectiveChapter({ chapterId }) {
  return (
    <div
      className={`${styles.chapter} text-secondary px-md-4 pb-md-4 pt-md-0 pb-2 px-3 pt-2  position-relative`}
    >
      <Suspense
        fallback={<h3 className="text-secondary">Loading ma chapter....</h3>}
      >
        <PerspectiveChapterContent chapterId={chapterId} />
      </Suspense>
    </div>
  )
}

export default React.memo(PerspectiveChapter)
