import { useMemo, useContext, useRef, useEffect, useCallback } from 'react'
import { shallowEqualObjects } from 'shallow-equal'
import { shouldRunDeps, getRunValuesFromDeps } from 'rocketjump-core'
import { useRj } from 'react-rocketjump'
import {
  useRunRjCache,
  useRjCacheState,
  usePrefetchRj,
} from 'react-rocketjump/plugins/cache'
import { MillerContext } from './internal'
import {
  useMemoCompareWithDeps,
  useMemoCompare,
  compareDocumentsParams,
  compareMillerParams,
} from './compare'
import { useTranslator } from './translate'
import {
  StoriesState,
  StoryState,
  DocumentsState,
  DocumentState,
  DocumentsSuggestState,
} from './state'

// TODO: MOVE IN CONTEXT
const DEFAULT_LIMIT = 4

/**
 * @typedef UseRunRjConfig
 * @type {object}
 * @property {boolean} [cleanOnNewEffect] should clean data on new effect?
 * @property {boolean} [cache] should use cache?
 * @property {boolean} [suspense] should use suspense?
 * @property {boolean} [suspendOnNewEffect] should suspend on new effect?
 */

/**
 * @typedef UseRunRjActions
 *
 * @property {function} run run side effect
 * @property {function} clear clear current state
 * @property {function} cancel cancel side effect
 * @property {function} updateData update current data
 * @property {function} prefetch prefetch current resource
 * @property {function} clearError clear error and re-try last failed side effect
 */

/**
 * @description useRunRjCache with miller context defaults for cache and suspense
 *
 * @param {object} rjObject Rocketjump Object
 * @param {Array} params list of params
 * @param {UseRunRjConfig} [config]
 * @returns {[object, UseRunRjActions]}
 */
function useMillerRunRj(rjObject, params, config = {}) {
  const { cache, suspense } = useContext(MillerContext)
  return useRunRjCache(rjObject, params, {
    cache,
    suspense,
    ...config,
  })
}

/**
 * @typedef UseRjCacheStateConfig
 *
 * @property {boolean} [suspense] should use suspense?
 */

/**
 * @typedef UseRjCacheStateActions
 *
 * @property {function} prefetch prefetch current resource
 * @property {function} clearError clear error and re-try last failed side effect
 */

/**
 * @description useRjCacheState with miller context defaults for suspense
 *
 * @param {object} rjObject Rocketjump Object
 * @param {Array} params list of params
 * @param {UseRjCacheStateConfig} [config]
 * @returns {[object, UseRjCacheStateActions]}
 */
function useMillerRjCacheState(rjObject, params, config = {}) {
  const { cache, suspense } = useContext(MillerContext)
  if (cache === false && process.env.NODE_ENV !== 'production') {
    console.warn(
      'Miller React Hooks // You are using cache state while ' +
        'cache options in your <Miller /> Provider is false.'
    )
  }
  return useRjCacheState(rjObject, params, {
    suspense,
    ...config,
  })
}

/**
 * @callback PrefetchDocumentCallback
 * @param {number|string} id Document ID
 * @param {object} [queryParams] Additional query string params
 * @returns {Promise}
 */

/**
 * @description Prefetch a document
 *
 * @returns {PrefetchDocumentCallback}
 */
export function usePrefetchDocument() {
  const prefetch = usePrefetchRj(DocumentState)
  return useCallback((id, params) => prefetch([+id, params]), [prefetch])
}

/**
 * @typedef PartialStateAndRunRjActions
 *
 * @property {object} error current error
 * @property {loading} loading is loading
 * @property {function} run run side effect
 * @property {function} clear clear current state
 * @property {function} cancel cancel side effect
 * @property {function} updateData update current data
 * @property {function} prefetch prefetch current resource
 * @property {function} clearError clear error and re-try last failed side effect
 */

/**
 * @description Grab a document by id from Miller API handle an internal state
 *
 * @param {Number|String} id Document ID
 * @param {object} [params] Additional query string params
 * @param {UseRunRjConfig} [config] Hook configuration
 * @returns {[object, PartialStateAndRunRjActions]}
 */
export function useDocument(id, params, config = {}) {
  const memoParams = useMemoCompareWithDeps(params, shallowEqualObjects)
  const documentID = typeof id === 'string' ? +id : id
  const [{ doc, ...otherState }, actions] = useMillerRunRj(
    DocumentState,
    [documentID, memoParams],
    {
      suspendOnNewEffect: true,
      ...config,
    }
  )
  const translate = useTranslator()
  const translatedDoc = useMemo(() => translate(doc), [doc, translate])
  return [translatedDoc, { ...otherState, ...actions }]
}

/**
 * @typedef PartialStateAndRjCacheStateActions
 *
 * @property {object} error current error
 * @property {function} prefetch prefetch current resource
 * @property {function} clearError clear error and re-try last failed side effect
 */

/**
 * @description Grab a document by id from Miller API don't handle
 * a local state is only a pointer to current cached element
 *
 * @param {Number|String} id Document ID
 * @param {object} [params] Additional query string params
 * @param {UseRjCacheStateConfig} [config] Hook configuration
 * @returns {[object, PartialStateAndRjCacheStateActions]}
 */
export function useCacheDocument(id, params, config = {}) {
  const memoParams = useMemoCompare(params, shallowEqualObjects)
  const documentID = typeof id === 'string' ? +id : id
  const [{ doc, error }, actions] = useMillerRjCacheState(
    DocumentState,
    [documentID, memoParams],
    config
  )
  const translate = useTranslator()
  const translatedDoc = useMemo(() => translate(doc), [doc, translate])
  return [translatedDoc, { error, ...actions }]
}

function useCrossFacetsParams(params, crossFacets) {
  const crossFacetsRef = useRef(crossFacets)
  const crossFacetsParamsRef = useRef()

  const crossFacetsParams = useMemo(() => {
    const actualCrossFacets = crossFacetsRef.current
    if (!actualCrossFacets) {
      return null
    }
    const keys = Object.keys(actualCrossFacets)
    const obj = {}
    keys.forEach((key) => {
      if (typeof actualCrossFacets[key] === 'function') {
        obj[key] = actualCrossFacets[key](params)
      } else {
        obj[key] = actualCrossFacets[key]
      }
    })
    return obj
  }, [params])

  useEffect(() => {
    crossFacetsRef.current = crossFacets
    crossFacetsParamsRef.current = crossFacetsParams
  })

  // Kepp only the key with params changes
  return useMemo(() => {
    if (!crossFacetsParams) {
      return null
    }
    const prevCrossFacetsParams = crossFacetsParamsRef.current ?? {}
    const keys = Object.keys(crossFacetsParams)
    const obj = {}
    let changed = false
    keys.forEach((key) => {
      if (
        !compareDocumentsParams(
          crossFacetsParams[key],
          prevCrossFacetsParams[key]
        )
      ) {
        obj[key] = crossFacetsParams[key]
        changed = true
      }
    })
    if (!changed) {
      return null
    }
    return obj
  }, [crossFacetsParams])
}

export function useDocuments(rawParams, config = {}) {
  const [rawCrossFacets, rawDocsParams, shouldRun] = useMemo(() => {
    const myDeps = [rawParams]
    // CAN'T RUN MA MEN!
    if (!shouldRunDeps(myDeps)) {
      return [null, null, false]
    }
    const [squashedRawParams] = getRunValuesFromDeps(myDeps)
    const { crossFacets: rawCrossFacets, ...rawDocsParams } = squashedRawParams
    return [rawCrossFacets, rawDocsParams, true]
  }, [rawParams])

  const params = useMemoCompare(rawDocsParams, compareDocumentsParams)
  const crossFacetsParams = useCrossFacetsParams(params, rawCrossFacets)

  const runRjArgs = shouldRun ? [params, crossFacetsParams] : [rawParams, null]

  const limit = params?.limit ?? DEFAULT_LIMIT
  const selectState = useCallback(
    (state, selectors, computedState) => ({
      ...computedState,
      pagination: selectors.getPagination(state, limit),
    }),
    [limit]
  )

  const [
    { documents, crossFacets, pagination, ...state },
    actions,
  ] = useMillerRunRj(DocumentsState, runRjArgs, {
    ...config,
    selectState,
  })

  const { run } = actions
  const { next } = pagination
  const fetchMore = useCallback(() => {
    if (next !== null) {
      run.withMeta({ append: true }).run(
        {
          ...params,
          ...next,
        },
        null
      )
    }
  }, [params, run, next])

  const translate = useTranslator()
  const translatedDocuments = useMemo(() => translate(documents), [
    documents,
    translate,
  ])

  return [
    { documents: translatedDocuments, pagination, ...crossFacets, ...state },
    { ...actions, fetchMore },
  ]
}

export function useCacheDocuments(params, config = {}) {
  const { crossFacets: rawCrossFacets, ...rawDocsParams } = params

  const memoParams = useMemoCompare(rawDocsParams, compareDocumentsParams)
  const crossFacetsMemoParams = useCrossFacetsParams(params, rawCrossFacets)

  const [
    { documents, crossFacets, loading, ...state },
    actions,
  ] = useMillerRjCacheState(
    DocumentsState,
    [memoParams, crossFacetsMemoParams],
    config
  )

  const translate = useTranslator()
  const translatedDocuments = useMemo(() => translate(documents), [
    documents,
    translate,
  ])
  return [{ documents: translatedDocuments, ...crossFacets, ...state }, actions]
}

export function useDocumentsSuggest(config = {}) {
  const { cache: gloablUseCache } = useContext(MillerContext)
  const [{ data, ...otherState }, { run, clean, ...actions }] = useRj(
    DocumentsSuggestState
  )
  const cache =
    typeof config.cache === 'boolean' ? config.cache : gloablUseCache

  const search = useCallback(
    (q) => {
      run.withMeta({ debounced: true, cache }).run(q)
    },
    [run, cache]
  )

  return [
    data,
    { ...otherState, ...actions, run, clean, clearSearch: clean, search },
  ]
}

export function usePrefetchStory() {
  const prefetch = usePrefetchRj(StoryState)
  return useCallback((id, params) => prefetch([String(id), params]), [prefetch])
}

/**
 * @description Grab a story by id from Miller API handle an internal state
 *
 * @param {Number|String} id Story ID
 * @param {object} [params] Additional query string params
 * @param {UseRunRjConfig} [config] Hook configuration
 * @returns {[object, PartialStateAndRunRjActions]}
 */
export function useStory(id, params, config = {}) {
  const memoParams = useMemoCompareWithDeps(params, shallowEqualObjects)
  const storyID = typeof id === 'number' ? String(id) : id
  const [{ story, ...otherState }, actions] = useMillerRunRj(
    StoryState,
    [storyID, memoParams],
    {
      suspendOnNewEffect: true,
      ...config,
    }
  )

  const translate = useTranslator()
  const translatedStory = useMemo(() => translate(story), [story, translate])

  return [translatedStory, { ...otherState, ...actions }]
}

/**
 * @description Grab a story by/slug id from Miller API don't handle
 * a local state is only a pointer to current cached element
 *
 * @param {Number|String} id Story ID or Slug
 * @param {object} [params] Additional query string params
 * @param {UseRjCacheStateConfig} [config] Hook configuration
 * @returns {[object, PartialStateAndRjCacheStateActions]}
 */
export function useCacheStory(id, params, config = {}) {
  const memoParams = useMemoCompare(params, shallowEqualObjects)
  const storyID = typeof id === 'number' ? String(id) : id
  const [{ story, error }, actions] = useMillerRjCacheState(
    StoryState,
    [storyID, memoParams],
    config
  )

  const translate = useTranslator()
  const translatedStory = useMemo(() => translate(story), [story, translate])

  return [translatedStory, { error, ...actions }]
}

export function usePrefetchStories() {
  const prefetch = usePrefetchRj(StoriesState)
  return useCallback((params) => prefetch([params]), [prefetch])
}

/**
 * @typedef MillerListParams
 * @type {object}
 * @property {object} [filters] Miller API filters will be encoded as JSON
 * @property {object} [exclude] Miller API exclude will be encoded as JSON
 */

export function useStories(rawParams, config = {}) {
  const params = useMemoCompareWithDeps(rawParams, compareMillerParams)

  const limit = params?.limit ?? DEFAULT_LIMIT
  const selectState = useCallback(
    (state, selectors, computedState) => ({
      ...computedState,
      pagination: selectors.getPagination(state, limit),
    }),
    [limit]
  )
  const [{ stories, ...state }, actions] = useMillerRunRj(
    StoriesState,
    [params],
    {
      ...config,
      selectState,
    }
  )
  const translate = useTranslator()
  const translatedStories = useMemo(() => translate(stories), [
    stories,
    translate,
  ])
  return [{ stories: translatedStories, ...state }, actions]
}

export function useCacheStories(rawParams, config = {}) {
  const params = useMemoCompare(rawParams, compareMillerParams)

  const limit = params?.limit ?? DEFAULT_LIMIT
  const selectState = useCallback(
    (state, selectors, computedState) => ({
      ...computedState,
      pagination: selectors.getPagination(state, limit),
    }),
    [limit]
  )
  const [{ stories, pagination, ...state }, actions] = useMillerRjCacheState(
    StoriesState,
    [params],
    {
      ...config,
      selectState,
    }
  )

  const { run } = actions
  const { next } = pagination
  const fetchMore = useCallback(() => {
    if (next !== null) {
      run.withMeta({ append: true }).run(
        {
          ...params,
          ...next,
        },
        null
      )
    }
  }, [params, run, next])

  const translate = useTranslator()
  const translatedStories = useMemo(() => translate(stories), [
    stories,
    translate,
  ])
  return [
    { stories: translatedStories, pagination, ...state },
    { ...actions, fetchMore },
  ]
}

export function useLang() {
  const { lang, setLang } = useContext(MillerContext)
  return [lang, setLang]
}

export function useMiller() {
  return useContext(MillerContext)
}
