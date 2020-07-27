import React, { useMemo } from 'react'
import Menu from '../components/Menu'
import { useCacheStory, useCacheDocuments } from '../miller'
import LangLink from '../components/LangLink'
import groupBy from 'lodash/groupBy'
import shuffle from 'lodash/shuffle'

const NUMBER_OF_IMAGES_PER_CATEGORY = 5

const MultiOverlappedDocsLink = React.memo(({ category, docs }) => (
  <div className="bg-info" style={{ width: 200, height: 200 }}>
    <div>{category}</div>
    <div style={{ position: 'relative' }}>
      {docs.map((doc, i) => (
        <img
          style={{
            position: 'absolute',
            left: Math.floor(Math.random() * 10),
            top: Math.floor(Math.random() * 10),
          }}
          width={100}
          alt={doc.data.title}
          key={doc.id}
          src={doc.data.resolutions.medium.url}
        />
      ))}
    </div>
  </div>
))

export default function Explorations() {
  const [explorationsStory] = useCacheStory('explorations')
  console.log('ExplorationsStory', explorationsStory)

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
      // Comment this line to avoid having random images every time....
      docs = shuffle(docs)
      docs = docs.slice(0, NUMBER_OF_IMAGES_PER_CATEGORY)
      return {
        category,
        docs,
      }
    })
  }, [documents])
  console.log('D', documents, categoriesWithImages)

  return (
    <div>
      <Menu />
      <h1>Explorations</h1>

      <div className='d-flex'>
        {categoriesWithImages.map((catWithImages) => (
          <MultiOverlappedDocsLink
            key={catWithImages.category}
            category={catWithImages.category}
            docs={catWithImages.docs}
          />
        ))}
      </div>

      <div>
        {/* <p>
          <LangLink to="/explorations/gender">GENDER</LangLink>
        </p>
        <p>
          <LangLink to="/explorations/the-idea-of-borders">
            THE IDEA OF BORDERS
          </LangLink>
        </p> */}

        <p>
          <LangLink to="/explorations/all">ALL</LangLink>
        </p>
        <p>
          <LangLink to="/explorations/alternative">ALTERNATIVE</LangLink>
        </p>
      </div>
    </div>
  )
}
