import React from 'react'
import ReactMarkdown from 'react-markdown'
import MenuResponsive from '../../components/MenuResponsive'
import Header from '../../components/Header'
import { useCacheStory } from '../../miller'
import styles from './TermsOfUse.module.scss'

export default function About() {
  const [touStory] = useCacheStory('terms-of-use')

  return (
    <React.Fragment>
      <Header title={touStory.data.title}></Header>
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
