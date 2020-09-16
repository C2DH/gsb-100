import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { ArrowLeft } from 'react-feather'
import Helmet from 'react-helmet'
import groupBy from 'lodash/groupBy'
import { Trail } from 'react-spring/renderprops'
import { useTranslation } from 'react-i18next'
import Media from 'react-media'
import { useCacheStory, useCacheDocuments } from '../../miller'
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
  const { t, i18n } = useTranslation()
  const { category } = useParams()
  const [explorationsStory] = useCacheStory('explorations')
  const [categoryStory] = useCacheStory(category)

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
    <React.Fragment>
      <Helmet>
        <html lang={i18n.language.split('_')[0]} />
        <title itemProp="name">
          {explorationsStory.data.title} - {t(category)}
        </title>
      </Helmet>
      <div className={styles.categoryPage}>
        <MenuResponsive
          level={'03'}
          title={explorationsStory.data.title}
        ></MenuResponsive>
        <div className={`${styles.catCont} bg-secondary`}>
          <div className={`container`}>
            <div className="row">
              <div className="col-12 col-lg-7">
                <h1 className="d-flex align-items-center mt-4 mb-2">
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
                  <span className="text-capitalize ml-2">{t(category)}</span>
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className={`container`}>
          <div className="row">
            <div className="offset-1 col-11 col-md-10 col-lg-8">
              <p className={styles.description}>
                {categoryStory.data.abstract}
              </p>
            </div>
          </div>
        </div>

        <div className="w-100">
          <Trail
            items={typesWithDocs}
            keys={(item) => item.type}
            from={{ opacity: 0 }}
            to={{ opacity: 1 }}
          >
            {(item) => (props) => (
              <DocsTypedGallery
                key={item.type}
                type={t(item.type)}
                docs={item.docs}
                style={props}
              />
            )}
          </Trail>
        </div>
      </div>
    </React.Fragment>
  )
}
