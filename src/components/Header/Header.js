import React from 'react'
import { useTranslation } from 'react-i18next'
import Helmet from 'react-helmet'
import { useCacheStory } from '../../miller'

function Header({ title, description, image }) {
  const { i18n } = useTranslation()
  const fbImgUrl = window.location.origin + '/ob.png'
  const [homeStory] = useCacheStory('home')
  return (
    <Helmet>
      <html lang={i18n.language.split('_')[0]} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={window.location.href} />
      <meta
        name="description"
        content={description ? description : homeStory.data.abstract}
      />
      <title itemProp="name">{title ? title : homeStory.data.title}</title>}
      <meta
        property="og:title"
        content={title ? title : homeStory.data.title}
      />
      }
      <meta
        property="og:description"
        content={description ? description : homeStory.data.abstract}
      />
      }
      <meta
        property="og:image"
        content={image ? window.location.origin + image : fbImgUrl}
      />
    </Helmet>
  )
}

export default Header
