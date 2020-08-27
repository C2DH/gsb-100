import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { ArrowLeft } from 'react-feather'
import groupBy from 'lodash/groupBy'
import { useCacheDocuments } from '../../miller'
import Menu from '../../components/Menu'
import LangLink from '../../components/LangLink'
import ExplorationsCategoryImage from './ExplorationsCategoryImage'
import styles from './ExplorationsCategory.module.scss'

const DocsTypedGallery = ({ type, docs }) => {
  return (
    <div className={`${styles.rowContainer} py-3`}>
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
      <Menu />
      <div className="container">
        <div className="row">
          <div className="col-7">
            <h1 className="d-flex align-items-center my-4">
              <LangLink className="text-white" to="/explorations">
                <ArrowLeft size={40} />
              </LangLink>
              <span className="text-capitalize ml-2">{category}</span>
            </h1>
          </div>
        </div>
      </div>

      <div className={`${styles.categoriesContainer}`}>
        {typesWithDocs.map((typeWithDocs) => (
          <DocsTypedGallery
            key={typeWithDocs.type}
            type={typeWithDocs.type}
            docs={typeWithDocs.docs}
          />
        ))}
      </div>
    </div>
  )
}
