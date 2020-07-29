import React from 'react'
import { Waypoint } from 'react-waypoint'
import Menu from '../components/Menu'
import { useDocuments, useDocumentsSuggest } from '../miller'
import DocumentsGrid from '../components/DocumentsGrid'
import capitalize from 'lodash/capitalize'
import { useQueryString } from '../hooks'
import Autocomplete from '../components/Autocomplete'

export default function ExplorationsAll() {
  const [queryString, setQueryString] = useQueryString()

  const [{ documents, loading, allFacets }, { fetchMore }] = useDocuments({
    limit: 100,
    q: queryString.q || undefined,
    filters: {
      data__type: queryString.type || undefined,
    },
    crossFacets: {
      allFacets: {
        facets: ['data__type'],
      },
    },
  })
  const [suggestions, { search, clearSearch }] = useDocumentsSuggest()

  function handleLoadMore() {
    if (!loading) {
      fetchMore()
    }
  }

  return (
    <div>
      <Menu />
      <h1>Explorations All</h1>
      <div>{loading && 'Loading.....'}</div>
      <div className="d-flex">
        <Autocomplete
          initialSearch={queryString.q}
          onSelected={(q) =>
            setQueryString({
              q,
              type: queryString.type,
            })
          }
          placeholder="Search"
          suggestions={suggestions}
          loadSuggestions={search}
          clearSuggestions={clearSearch}
        />

        <select
          value={queryString.type ?? ''}
          onChange={(e) => {
            setQueryString({
              type: e.target.value,
              q: queryString.q,
            })
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
