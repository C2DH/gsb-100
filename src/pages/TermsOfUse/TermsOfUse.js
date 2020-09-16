import React from 'react'
import Helmet from 'react-helmet'
import ReactMarkdown from 'react-markdown'
import { useTranslation } from 'react-i18next'
import MenuResponsive from '../../components/MenuResponsive'
import { useCacheStory } from '../../miller'
import styles from './TermsOfUse.module.scss'

export default function About() {
  const [touStory] = useCacheStory('terms-of-use')
  const { t, i18n } = useTranslation()

  return (
    <React.Fragment>
      <Helmet>
        <html lang={i18n.language.split('_')[0]} />
        <title itemProp="name">{touStory.data.title}</title>
      </Helmet>
      <div className={styles.touCont}>
        <MenuResponsive title={touStory.data.title}></MenuResponsive>
        <div className={`${styles.titleContainer} d-none d-lg-block`}>
          <div className="container">
            <div className="row">
              <div className="col">
                <h1 className="my-3 my-md-4 text-center text-truncate">
                  {touStory.data.title}
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className="container my-md-4">
          <div className="row">
            <div className="col-12 col-lg-8">
              <div className={styles.pageContent}>
                <ReactMarkdown
                  linkTarget="_blank"
                  source={touStory.data.abstract}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}
