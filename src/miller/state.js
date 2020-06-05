import qs from 'query-string'
import { forkJoin } from 'rxjs'
import { ajax } from 'rxjs/ajax'
import { mergeMap, map } from 'rxjs/operators'
import { rj, SUCCESS, HYDRATE } from 'react-rocketjump'
import rjList, {
  limitOffsetPaginationAdapter,
} from 'react-rocketjump/plugins/list'
import rjCache from 'react-rocketjump/plugins/cache'
import rjDebounce from 'react-rocketjump/plugins/debounce'

function encodeMillerParamas(params = {}, hashParams) {
  let filters = params.filters
  if (typeof filters === 'object' && filters !== null) {
    filters = JSON.stringify(filters)
  }
  let exclude = params.exclude
  if (typeof exclude === 'object' && exclude !== null) {
    exclude = JSON.stringify(exclude)
  }
  const apiParams = { ...params, filters, exclude }
  if (hashParams && typeof hashParams === 'function') {
    return hashParams(apiParams)
  }
  return apiParams
}

export const DocumentState = rj(
  rjCache({
    ns: 'millerDoc',
    size: 100,
  }),
  {
    name: 'MillerDocument',
    effectCaller: rj.configured(),
    effect: ({ apiUrl, hashParams }, id, params = {}) => {
      return ajax.getJSON(
        `${apiUrl}/document/${id}?${qs.stringify(
          encodeMillerParamas(params, hashParams)
        )}`
      )
    },
    computed: {
      doc: 'getData',
      error: 'getError',
      loading: 'isPending',
    },
  }
)

function keyByFacet(arr, keyIndex) {
  const obj = {}
  arr.forEach((value) => {
    obj[value[keyIndex]] = value.count
  })
  return obj
}

function keyByFacets(facets, applyList) {
  if (!applyList) {
    return facets
  }
  const keys = Object.keys(facets)
  const obj = {}
  keys.forEach((key) => {
    if (applyList === true || applyList.indexOf(key) !== -1) {
      obj[key] = keyByFacet(facets[key], key)
    } else {
      obj[key] = facets[key]
    }
  })
  return obj
}

function mapDocs(facetsByKey) {
  return (data) => {
    if (facetsByKey && data.facets) {
      return {
        ...data,
        facets: keyByFacets(data.facets, facetsByKey),
      }
    }
    return data
  }
}

function documentsApi({ apiUrl, hashParams }, params = {}) {
  return ajax.getJSON(
    `${apiUrl}/document/?${qs.stringify(
      encodeMillerParamas(params, hashParams)
    )}`
  )
}

export const DocumentsState = rj(
  rjCache({
    ns: 'millerDocs',
    size: 30,
  }),
  rjList({
    pagination: limitOffsetPaginationAdapter,
  }),
  {
    name: 'MillerDocuments',
    effectCaller: rj.configured(),
    effect: (millerEffectConfig, allParams, crossFacets) => {
      const { facetsByKey, ...params } = allParams
      if (crossFacets === null) {
        return documentsApi(millerEffectConfig, params).pipe(
          map(mapDocs(facetsByKey))
        )
      }
      const apiCalls = {}
      Object.keys(crossFacets).forEach((key) => {
        const { facetsByKey, ...params } = crossFacets[key]
        apiCalls[key] = documentsApi(millerEffectConfig, {
          ...params,
          limit: 1,
          facets_only: 1,
        }).pipe(
          map((data) => {
            const { facets, count } = data
            return {
              count,
              ...keyByFacets(facets, facetsByKey),
            }
          })
        )
      })
      // SPECIAL KEY FOR DOCS TODO: CHECK FOR THIS KEY IN DEV
      apiCalls.__docs = documentsApi(millerEffectConfig, params).pipe(
        map(mapDocs(facetsByKey))
      )
      return forkJoin(apiCalls).pipe(
        map((all) => {
          const { __docs: docs, ...crossFacets } = all
          return {
            ...docs,
            crossFacets,
          }
        })
      )
    },
    selectors: ({ getData }) => ({
      getFacets: (state) => getData(state)?.facets ?? null,
      getCrossFacets: (state) => getData(state)?.crossFacets ?? {},
    }),
    reducer: (oldReducer) => (state, action) => {
      if (action.type === SUCCESS || action.type === HYDRATE) {
        const nextState = oldReducer(state, action)
        return {
          ...nextState,
          data: {
            ...nextState.data,
            crossFacets: {
              ...(state.data?.crossFacets ?? {}),
              ...(action.payload.data?.crossFacets ?? {}),
            },
            facets: action.payload.data.facets,
          },
        }
      }
      return oldReducer(state, action)
    },
    computed: {
      count: 'getCount',
      documents: 'getList',
      facets: 'getFacets',
      crossFacets: 'getCrossFacets',
    },
  }
)

export const DocumentsSuggestState = rj(
  rjDebounce(),
  rjCache({
    ns: 'millerDocsSuggest',
    size: 50,
  }),
  {
    name: 'MillerSuggestDocument',
    effectCaller: rj.configured(),
    effect: (apiUrl, q = '') => {
      return ajax
        .getJSON(
          `${apiUrl}/document/suggest/?${qs.stringify(
            encodeMillerParamas({ q })
          )}`
        )
        .pipe(map((r) => r.results))
    },
  }
)

function storyApi({ apiUrl, hashParams }, id, params = {}) {
  return ajax.getJSON(
    `${apiUrl}/story/${id}?${qs.stringify(
      encodeMillerParamas(params, hashParams)
    )}`
  )
}

export const StoryState = rj(
  rjCache({
    ns: 'millerStory',
    size: 100,
  }),
  {
    name: 'MillerStory',
    effectCaller: rj.configured(),
    effect: (millerEffectConfig, id, rawParams = {}) => {
      const { withChapters, ...params } = rawParams
      const ajaxObservable = storyApi(millerEffectConfig, id, params)
      if (withChapters) {
        return ajaxObservable.pipe(
          mergeMap((response) => {
            const chapters = response?.data?.chapters
            if (chapters) {
              return forkJoin(
                chapters.map((id) => storyApi(millerEffectConfig, id))
              ).pipe(
                map((chaptersData) => {
                  return {
                    ...response,
                    data: {
                      ...response.data,
                      chapters: chaptersData,
                    },
                  }
                })
              )
            }
          })
        )
      } else {
        return ajaxObservable
      }
    },
    computed: {
      story: 'getData',
      error: 'getError',
      loading: 'isPending',
    },
  }
)

export const StoriesState = rj(
  rjCache({
    ns: 'millerStories',
    size: 50,
  }),
  rjList({
    pagination: limitOffsetPaginationAdapter,
  }),
  {
    name: 'MillerStories',
    effectCaller: rj.configured(),
    effect: ({ apiUrl, hashParams }, params = {}) =>
      ajax.getJSON(
        `${apiUrl}/story/?${qs.stringify(
          encodeMillerParamas(params, hashParams)
        )}`
      ),
    computed: {
      count: 'getCount',
      stories: 'getList',
    },
  }
)
