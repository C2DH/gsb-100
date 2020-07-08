import React from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { Info } from 'react-feather'
import { useLocation } from 'react-router-dom'
import { usePrefetchDocument } from '../../../miller'
import LangLink from '../../LangLink'
import styles from './Gallery.module.scss'

const GalleryItem = React.memo(({ document }) => {
  const location = useLocation()
  const prefetchDocument = usePrefetchDocument()
  return (
    <div key={document.id} className={styles.GalleryItem}>
      <img
        src={document.data.resolutions.preview.url}
        alt={document.data.title}
      />
      <LangLink
        onClick={() => {
          prefetchDocument(document.document_id)
        }}
        to={{
          pathname: `/documents/${document.document_id}`,
          state: { background: location, modalDocument: document },
        }}
      >
        <Info />
      </LangLink>
    </div>
  )
})

export default function Gallery({ objects, caption }) {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  }
  return (
    <div>
      <Slider className={styles.Gallery} {...settings}>
        {objects.map((o) => (
          <GalleryItem key={o.document.id} document={o.document} />
        ))}
      </Slider>
      {caption && <p className='text-primary'>{caption}</p>}
    </div>
  )
}
