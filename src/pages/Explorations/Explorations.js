import React, { useMemo } from 'react'
import groupBy from 'lodash/groupBy'
import { shuffle } from 'seed-shuffle'
import { Trail } from 'react-spring/renderprops'
import MenuResponsive from '../../components/MenuResponsive'
import { useCacheStory, useCacheDocuments } from '../../miller'
import ImagesStack from '../../components/ImagesStack'
import styles from './Explorations.module.scss'

const NUMBER_OF_IMAGES_PER_CATEGORY = 5

// Mantain the same "random" for the entire user session
// NOTE: Place a literal Es:. 5 to have ALWAYS the same random factor
const RANDOM_SEED = 1 + Math.floor(Math.random() * 1000)

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
    <div className={styles.explorationPage}>
      <MenuResponsive
        level={'03'}
        title={explorationsStory.data.title}
      ></MenuResponsive>
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-9 col-lg-7">
            <p className={`${styles.desc} mt-2 mt-md-5`}>
              {explorationsStory.data.abstract}
            </p>
          </div>
        </div>
      </div>
      <div
        className={`${styles.stacks} flex-grow-1 d-flex flex-md-row flex-column position-relative align-items-center`}
      >
        <Trail
          items={categoriesWithImages.concat([
            { category: 'all' },
            { category: 'alternative' },
          ])}
          keys={(item) => item.category}
          from={{ opacity: 0 }}
          to={{ opacity: 1 }}
        >
          {(item) => (props) => (
            <ImagesStack
              category={item.category}
              docs={item.docs}
              style={props}
              empty={item.docs ? false : true}
            />
          )}
        </Trail>
        {/*{categoriesWithImages.map((catWithImages) => (
          <ImagesStack
            key={catWithImages.category}
            category={catWithImages.category}
            docs={catWithImages.docs}
          />
        ))}*/}
        {/*<ImagesStack category={'all'} empty></ImagesStack>
        <ImagesStack category={'alternative'} empty></ImagesStack>*/}
        <div style={{ flex: '0 0 1px', width: 1, height: 1 }}></div>
      </div>
    </div>
  )
}
