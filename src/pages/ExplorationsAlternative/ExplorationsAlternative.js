import React from 'react'
import Media from 'react-media'
import LangLink from '../../components/LangLink'
import { BREAKPOINTS } from '../../utils'
import { ArrowLeft } from 'react-feather'
import MenuResponsive from '../../components/MenuResponsive'
import { useCacheStory, useCacheDocuments } from '../../miller'
import styles from './ExplorationsAlternative.module.scss'

export default function ExplorationsAlternative() {
  const [explorationsStory] = useCacheStory('explorations')
  const [{ documents }] = useCacheDocuments({
    filters: {
      data__category: 'alternative sources',
    },
    limit: 500,
  })

  console.log(documents)
  return (
    <div className={styles.AlternativePage}>
      <MenuResponsive
        level={'03'}
        title={explorationsStory.data.title}
      ></MenuResponsive>
      <div className={`${styles.titleCont} bg-secondary`}>
        <div className={`container`}>
          <div className="row">
            <div className="col-12 col-lg-7">
              <h1 className="d-flex align-items-center my-4">
                <LangLink className="text-white" to="/explorations">
                  <Media queries={BREAKPOINTS}>
                    {(matches) =>
                      matches.md ? (
                        <ArrowLeft size={25} />
                      ) : (
                        <ArrowLeft size={40} />
                      )
                    }
                  </Media>
                </LangLink>
                <span className="text-capitalize ml-2">
                  {'Alternative sources'}
                </span>
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        {documents.map((doc) => {
          return (
            <div className="row my-5">
              <div className="col-12 col-lg-7"></div>
              <div className="col-12 col-lg-5">
                <h3>{doc.data.title}</h3>
                <p>{doc.data.description}</p>
                <a
                  className="btn btn-dark text-primary"
                  href={doc.data.provenance}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  link
                </a>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
