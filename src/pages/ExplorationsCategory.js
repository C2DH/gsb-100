import React, { useMemo } from 'react'
import Menu from '../components/Menu'
import { useParams } from 'react-router-dom'
import { useCacheDocuments } from '../miller'
import { ArrowLeft } from 'react-feather'
import groupBy from 'lodash/groupBy'
import LangLink from '../components/LangLink'

const DocsTypedGallery = ({ type, docs }) => {
  return (
    <div className="border-bottom pl-5">
      <div className="text-primary pt-2 text-capitalize">{type}</div>
      <div className="d-flex py-2 overflow-auto">
        {docs.map((doc) => {
          const url = doc.data.resolutions?.medium.url
          if (!url) {
            return null
          }
          return (
            <div key={doc.id}>
              <img
                className='mr-2'
                height={200}
                alt={doc.data.title}
                src={url}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function ExplorationsCategory() {
  const { category } = useParams()

  const [{ documents }] = useCacheDocuments({
    filters: {
      data__category: category,
    },
    limit: 500,
  })

  const typesWithDocs = useMemo(() => {
    const docsByType = groupBy(documents, (d) => d.data.type)
    const sortedTypes = Object.keys(docsByType).sort()

    return sortedTypes.map((type) => ({
      type,
      docs: docsByType[type],
    }))
  }, [documents])

  console.log('O.o', typesWithDocs)

  return (
    <div>
      <Menu />
      <h1>
        <LangLink className="text-white" to="/explorations">
          <ArrowLeft size={50} />
        </LangLink>
        <span className="text-capitalize ml-2">{category}</span>
      </h1>
      <div className="border-top my-4">
        {typesWithDocs.map((typeWithDocs) => (
          <DocsTypedGallery
            key={typeWithDocs.type}
            type={typeWithDocs.type}
            docs={typeWithDocs.docs}
          />
        ))}
      </div>
    </div>
  )
}
