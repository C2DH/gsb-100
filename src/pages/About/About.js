import React from 'react'
import ReactMarkdown from 'react-markdown'
import { useTranslation } from 'react-i18next'
import { useCacheStory } from '../../miller'
import Menu from '../../components/Menu'
import c2dh from './c2dh.jpg'
import unilu from './unilu.jpg'
import styles from './About.module.scss'

export default function About() {
  const [aboutStory] = useCacheStory('about')
  const { t } = useTranslation()

  return (
    <React.Fragment>
      <Menu />
      <div className={styles.titleContainer}>
        <div className="container">
          <div className="row">
            <div className="col">
              <h1 className="my-3 my-md-4 text-center">
                {aboutStory.data.title}
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div className="container my-md-4">
        <div className="row">
          <div className="col-12 col-md-7 col-xl-6 order-1 order-lg-0">
            <div className={styles.pageContent}>
              <ReactMarkdown
                linkTarget="_blank"
                source={aboutStory.data.abstract}
              />
            </div>
          </div>
          <div className="col-12 col-md-5 col-xl-6 order-0 order-lg-1">
            <div className={styles.pageContent}>
              <h6 className="text-capitalize">{t('partners')}</h6>
              <div className="d-flex flex-wrap align-items-center">
                <div className="col-4">
                  <a
                    href="https://uni.lu"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img className="img-fluid" src={unilu} alt="logo UniLu" />
                  </a>
                </div>
                <div className="col-4">
                  <a
                    href="https://www.c2dh.uni.lu/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img className="img-fluid" src={c2dh} alt="logo C2DH" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}
