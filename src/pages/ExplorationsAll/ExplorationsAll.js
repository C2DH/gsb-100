import React from 'react'
import { Waypoint } from 'react-waypoint'
import { ArrowLeft } from 'react-feather'
import { useQueryString } from '../../hooks'
import { useDocuments, useDocumentsSuggest } from '../../miller'
import Menu from '../../components/Menu'
import DocumentsGrid from '../../components/DocumentsGrid'
import Autocomplete from '../../components/Autocomplete'
import LangLink from '../../components/LangLink'
import styles from './ExplorationsAll.module.scss'

export default function ExplorationsAll() {
  const [queryString, setQueryString] = useQueryString()

  const [{ documents, loading, allFacets }, { fetchMore }] = useDocuments({
    limit: 150,
    q: queryString.q || undefined,
    filters: {
      data__type: queryString.type || undefined,
    },
    exclude: { type: 'entity' },
    crossFacets: {
      allFacets: {
        facets: ['data__type'],
        exclude: { type: 'entity' },
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
    <div className={styles.ExplorationsAllPage}>
      <Menu />
      <div className="container">
        <div className="row">
          <div className="col-7">
            <h1 className="d-flex align-items-center my-4">
              <LangLink className="text-white" to="/explorations">
                <ArrowLeft size={40} />
              </LangLink>
              <span className="text-capitalize ml-2">All sources</span>
            </h1>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
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
                  <option
                    className="text-capitalize"
                    value={facet.data__type}
                    key={facet.data__type}
                  >
                    {facet.data__type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <DocumentsGrid documents={documents} />
            <Waypoint onEnter={handleLoadMore} />
          </div>
        </div>
      </div>
      <div>{loading && 'Loading.....'}</div>
    </div>
  )
}
