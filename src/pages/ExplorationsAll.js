import React, { useState } from 'react'
import { Waypoint } from 'react-waypoint'
import Menu from '../components/Menu'
import { useDocuments, useDocumentsSuggest } from '../miller'
import DocumentsGrid from '../components/DocumentsGrid'
import capitalize from 'lodash/capitalize'
import { useQueryString } from '../hooks'
import Autocomplete from '../components/Autocomplete'

const DATA_TYPES = ['image']

export default function ExplorationsAll() {
  const [queryString, setQueryString] = useQueryString()

  const [{ documents, loading, allFacets }, { fetchMore }] = useDocuments({
    limit: 100,
    filters: {
      data__type: queryString.type,
    },
    crossFacets: {
      allFacets: {
        facets: ['data__type'],
      },
    },
  })
  console.log('u.u', allFacets)

  const [searchText, setSearchText] = useState('')
  const [suggestions, { search, clearSearch }] = useDocumentsSuggest()

  console.log('~', suggestions, search)

  function handleLoadMore() {
    if (!loading) {
      fetchMore()
    }
  }

  return (
    <div>
      <Menu />
      <h1>Explorations All</h1>
      <div>
        <Autocomplete
          suggstions={suggestions}
          loadSuggestions={search}
          clearSuggestions={clearSearch}
        />

        <select
          value={queryString.type ?? ''}
          onChange={(e) => {
            setQueryString({ type: e.target.value })
          }}
        >
          <option value="">All types</option>
          {allFacets.data__type.map((facet) => (
            <option value={facet.data__type} key={facet.data__type}>
              {capitalize(facet.data__type)}
            </option>
          ))}
        </select>
      </div>
      <DocumentsGrid documents={documents} />
      <Waypoint onEnter={handleLoadMore} />
    </div>
  )
}
