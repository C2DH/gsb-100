import React from 'react'
import Media from 'react-media'
import Helmet from 'react-helmet'
import LangLink from '../../components/LangLink'
import { useTranslation } from 'react-i18next'
import { BREAKPOINTS } from '../../utils'
import { ArrowLeft, ExternalLink } from 'react-feather'
import MenuResponsive from '../../components/MenuResponsive'
import { useCacheStory, useCacheDocuments } from '../../miller'
import styles from './ExplorationsAlternative.module.scss'

export default function ExplorationsAlternative() {
  const { t, i18n } = useTranslation()
  const [explorationsStory] = useCacheStory('explorations')
  const [{ documents }] = useCacheDocuments({
    filters: {
      data__category: 'alternative-sources',
    },
    limit: 500,
  })

  return (
    <React.Fragment>
      <Helmet>
        <html lang={i18n.language.split('_')[0]} />
        <title itemProp="name">
          {explorationsStory.data.title} - {t('alternative')}
        </title>
      </Helmet>
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
                    {t('alternative')}
                  </span>
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          {documents.map((doc) => {
            return (
              <div className={`${styles.rowBorder} row my-5`} key={doc.id}>
                <div className="col-12 col-lg-7">
                  <div
                    className={`${styles.imgCont} bg-dark p-3 p-lg-4 mb-3 mb-lg-0`}
                  >
                    <img
                      className={`${styles.img} img-fluid`}
                      src={doc.data.resolutions.preview.url}
                      alt={doc.data.title}
                    ></img>
                  </div>
                </div>
                <div className="col-12 col-lg-5">
                  <h3>{doc.data.title}</h3>
                  <p>{doc.data.description}</p>
                  <a
                    className="btn btn-dark text-primary d-inline-flex align-items-center"
                    href={doc.data.provenance}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span className="mr-2">{t('link')}</span>
                    <ExternalLink size={16}></ExternalLink>
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </React.Fragment>
  )
}
