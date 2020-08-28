import React from 'react'
import { Waypoint } from 'react-waypoint'
import { ArrowLeft } from 'react-feather'
import Media from 'react-media'
import MenuResponsive from '../../components/MenuResponsive'
import { useQueryString } from '../../hooks'
import { useCacheStory, useDocuments, useDocumentsSuggest } from '../../miller'
import DocumentsGrid from '../../components/DocumentsGrid'
import Autocomplete from '../../components/Autocomplete'
import LangLink from '../../components/LangLink'
import { BREAKPOINTS } from '../../utils'
import styles from './ExplorationsAll.module.scss'

export default function ExplorationsAll() {
  const [queryString, setQueryString] = useQueryString()
  const [explorationsStory] = useCacheStory('explorations')

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

  function renderWaypoint() {
    if (!loading) {
      return <Waypoint onEnter={handleLoadMore} />
    }
  }

  return (
    <div className={styles.ExplorationsAllPage}>
      <MenuResponsive
        level={'03'}
        title={explorationsStory.data.title}
      ></MenuResponsive>
      <div className="container">
        <div className="row">
          <div className="col-12 col-lg-7">
            <h1 className="d-flex align-items-center my-4">
              <LangLink className="text-white" to="/explorations">
                <Media queries={BREAKPOINTS}>
                  {(matches) =>
                    matches.md ? (
                      <ArrowLeft size={25} />
                    ) : (
                      <ArrowLeft size={40} />
                    )
                  }
                </Media>
              </LangLink>
              <span className="text-capitalize ml-2">All sources</span>
            </h1>
          </div>
        </div>
        <div className={`${styles.rowSearch} row align-items-center`}>
          <div className={`${styles.colSearch} col-12 col-lg-10`}>
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
          </div>
          <div className="col-12 col-lg-2 pr-4 pr-lg-auto">
            <select
              className={`${styles.selectType} form-control`}
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
                  {facet.data__type}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <DocumentsGrid documents={documents} />
            <div className="mb-4">{renderWaypoint()}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
