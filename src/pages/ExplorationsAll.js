import React from 'react'
import { Waypoint } from 'react-waypoint'
import Menu from '../components/Menu'
import { useDocuments } from '../miller'
import DocumentsGrid from '../components/DocumentsGrid'

const DATA_TYPES = ['image']

export default function ExplorationsAll() {
  const [{ documents, loading }, { fetchMore }] = useDocuments({
    limit: 150,
    filters: {
      data__type__in: DATA_TYPES,
    },
  })

  function handleLoadMore() {
    if (!loading) {
      fetchMore()
    }
  }

  return (
    <div>
      <Menu />
      <h1>Explorations All</h1>
      <DocumentsGrid documents={documents} />
      <Waypoint onEnter={handleLoadMore} />
    </div>
  )
}
