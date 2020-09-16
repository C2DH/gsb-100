import React from 'react'
import ReactMarkdown from 'react-markdown'
import { useTranslation } from 'react-i18next'
import Helmet from 'react-helmet'
import MenuResponsive from '../../components/MenuResponsive'
import { useCacheStory } from '../../miller'
import c2dh from './c2dh.jpg'
import unilu from './unilu.jpg'
import jahre from './100Jahre.png'
import sonuma from './sonuma.png'
import zog from './zog.jpg'
import ostbelgien from './ostbelgien.png'
import styles from './About.module.scss'

const logos = [
  { src: c2dh, alt: 'c2dh', href: 'https://www.c2dh.uni.lu/' },
  { src: unilu, alt: 'unilu', href: 'https://uni.lu' },
  { src: jahre, alt: '100jahre', href: '' },
  { src: ostbelgien, alt: 'ostbelgien', href: 'https://www.ostbelgien.eu/en' },
  { src: zog, alt: 'zog', href: 'https://www.geschichte.be/' },
  { src: sonuma, alt: 'sonuma', href: 'https://www.sonuma.be' },
]

export default function About() {
  const [aboutStory] = useCacheStory('about')
  const { t, i18n } = useTranslation()

  return (
    <React.Fragment>
      <Helmet>
        <html lang={i18n.language.split('_')[0]} />
        <title itemProp="name">{aboutStory.data.title}</title>
      </Helmet>
      <div className={styles.aboutContainer}>
        <MenuResponsive title={aboutStory.data.title}></MenuResponsive>
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
            <div className="col-12 col-lg-7 order-1 order-lg-0">
              <div className={styles.pageContent}>
                <ReactMarkdown
                  linkTarget="_blank"
                  source={aboutStory.data.abstract}
                />
              </div>
            </div>
            <div className="col-12 col-lg-5 order-0 order-lg-1">
              <div className={styles.pageContent}>
                <h6 className="text-capitalize">{t('partners')}</h6>
                <div className="d-flex flex-wrap align-items-center">
                  {logos.map((logo, i) => (
                    <div className="col-4 my-2" key={i}>
                      <a
                        href={logo.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.logoLink}
                      >
                        <img
                          className="img-fluid"
                          src={logo.src}
                          alt={logo.alt}
                        />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}
