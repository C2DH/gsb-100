import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { ArrowLeft } from 'react-feather'
import groupBy from 'lodash/groupBy'
import { Trail } from 'react-spring/renderprops'
import { useCacheStory, useCacheDocuments } from '../../miller'
import Media from 'react-media'
import { BREAKPOINTS } from '../../utils'
import MenuResponsive from '../../components/MenuResponsive'
import LangLink from '../../components/LangLink'
import ExplorationsCategoryImage from './ExplorationsCategoryImage'
import styles from './ExplorationsCategory.module.scss'

const DocsTypedGallery = ({ type, docs, style }) => {
  return (
    <div className={`${styles.rowContainer} py-3`} style={style}>
      <p
        className={`${styles.rowPadding} ${styles.label} text-primary text-capitalize`}
      >
        {type}
      </p>
      <div
        className={`${styles.rowPadding} d-flex align-items-end py-2 overflow-auto`}
      >
        {docs.map((doc) => (
          <ExplorationsCategoryImage
            doc={doc}
            key={doc.id}
          ></ExplorationsCategoryImage>
        ))}
      </div>
    </div>
  )
}

export default function ExplorationsCategory() {
  const { category } = useParams()
  const [explorationsStory] = useCacheStory('explorations')

  const [{ documents }] = useCacheDocuments({
    filters: {
      data__category: category,
    },
    limit: 500,
  })

  const typesWithDocs = useMemo(() => {
    const docsByType = groupBy(documents, (d) => d.data.type)
    const sortedTypes = Object.keys(docsByType).sort()

    return sortedTypes.map((type) => ({
      type,
      docs: docsByType[type],
    }))
  }, [documents])

  return (
    <div className={styles.categoryPage}>
      <MenuResponsive
        level={'03'}
        title={explorationsStory.data.title}
      ></MenuResponsive>
      <div className={`${styles.catCont} container bg-secondary`}>
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
              <span className="text-capitalize ml-2">{category}</span>
            </h1>
          </div>
        </div>
      </div>

      <div className={`${styles.categoriesContainer}`}>
        <Trail
          items={typesWithDocs}
          keys={(item) => item.type}
          from={{ opacity: 0 }}
          to={{ opacity: 1 }}
        >
          {(item) => (props) => (
            <DocsTypedGallery
              key={item.type}
              type={item.type}
              docs={item.docs}
              style={props}
            />
          )}
        </Trail>
      </div>
    </div>
  )
}
