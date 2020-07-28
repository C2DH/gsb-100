import React, { useMemo } from 'react'
import Menu from '../components/Menu'
import { useCacheStory, useCacheDocuments } from '../miller'
import LangLink from '../components/LangLink'
import groupBy from 'lodash/groupBy'
import { shuffle } from 'seed-shuffle'

const NUMBER_OF_IMAGES_PER_CATEGORY = 5
const IMAGE_SIZE = 250

// Mantein the same "random" for the entire user session
// NOTE: Place a literal Es:. 5 to have ALWAYS the same random factor
const RANDOM_SEED = 1 + Math.floor(Math.random() * 1000)

const MultiOverlappedDocsLink = React.memo(({ category, docs }) => (
  <LangLink to={`/explorations/${category}`}>
    <div
      className="align-items-center d-flex justify-content-center"
      style={{
        position: 'relative',
        width: IMAGE_SIZE * 1.5,
        height: IMAGE_SIZE * 1.5,
      }}
    >
      {docs.map((doc, i) => (
        <img
          style={{
            position: 'absolute',
            opacity: 0.9 - 0.1 * i - 0.1,
            left: (Math.sin(i) * IMAGE_SIZE) / 4 + (IMAGE_SIZE * 1.5) / 4,
            top: (Math.cos(i) * IMAGE_SIZE) / 4 + (IMAGE_SIZE * 1.5) / 4,
          }}
          width={IMAGE_SIZE / 2}
          alt={doc.data.title}
          key={doc.id}
          src={doc.data.resolutions.medium.url}
        />
      ))}
      <h5 className="text-capitalize m-0 p-0 text-white" style={{ zIndex: 9 }}>
        {category}
      </h5>
    </div>
  </LangLink>
))

const BoxLink = ({ children, to }) => (
  <LangLink to={to}>
    <div
      className="align-items-center d-flex justify-content-center border"
      style={{
        marginTop: (IMAGE_SIZE * 1.5) / 6,
        marginLeft: (IMAGE_SIZE * 1.5) / 6,
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
      }}
    >
      <h5 className="m-0 p-0 text-white text-capitalize">{children}</h5>
    </div>
  </LangLink>
)

export default function Explorations() {
  const [explorationsStory] = useCacheStory('explorations')

  const [{ documents }] = useCacheDocuments({
    filters: {
      data__category__isnull: false,
      data__resolutions__isnull: false,
    },
    limit: 500,
  })

  const categoriesWithImages = useMemo(() => {
    const byCategories = groupBy(documents, (d) => d.data.category)
    const sortedCategories = Object.keys(byCategories)

    return sortedCategories.map((category) => {
      let docs = byCategories[category]
      docs = shuffle(docs, RANDOM_SEED)
      docs = docs.slice(0, NUMBER_OF_IMAGES_PER_CATEGORY)
      return {
        category,
        docs,
      }
    })
  }, [documents])

  return (
    <div>
      <Menu />
      <h1>Explorations</h1>

      <div className="d-flex">
        {categoriesWithImages.map((catWithImages) => (
          <MultiOverlappedDocsLink
            key={catWithImages.category}
            category={catWithImages.category}
            docs={catWithImages.docs}
          />
        ))}
        <BoxLink to='/explorations/all'>all the sources</BoxLink>
        <BoxLink to='/explorations/alternative'>alternative sources</BoxLink>
      </div>
    </div>
  )
}
