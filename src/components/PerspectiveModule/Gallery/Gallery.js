import React from 'react'
import Carousel from 'nuka-carousel'
import { useLocation } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'react-feather'
import { usePrefetchDocument } from '../../../miller'
import { Caption } from '../ModuleUtils'
import LangLink from '../../LangLink'
import styles from '../PerspectiveModule.module.scss'
import './Gallery.css'

const GalleryItem = React.memo(({ document }) => {
  const location = useLocation()
  const prefetchDocument = usePrefetchDocument()

  return (
    <img
      src={document.data.resolutions.preview.url}
      alt={document.data.title}
    />
  )
})

export default function Gallery({ objects, caption }) {
  const settings = {
    heightMode: 'max',
    slideWidth: 0.8,
    cellSpacing: 15,
    wrapAround: true,
  }
  return (
    <div className="my-4">
      <Carousel
        {...settings}
        renderCenterLeftControls={({ previousSlide }) => (
          <button
            className="btn btn-icon-round btn-primary ml-2"
            onClick={previousSlide}
          >
            <ArrowLeft></ArrowLeft>
          </button>
        )}
        renderCenterRightControls={({ nextSlide }) => (
          <button
            className="btn btn-icon-round btn-primary mr-2"
            onClick={nextSlide}
          >
            <ArrowRight></ArrowRight>
          </button>
        )}
        renderBottomCenterControls={null}
      >
        {objects.map((o) => (
          <GalleryItem key={o.document.id} document={o.document} />
        ))}
      </Carousel>
      {caption && (
        <div className={styles.docLink}>
          <Caption caption={caption}></Caption>
        </div>
      )}
    </div>
  )
}
