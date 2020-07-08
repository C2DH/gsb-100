import React, { Suspense, useRef, useEffect } from 'react'
import i18n from 'i18next'
import { initReactI18next, useTranslation } from 'react-i18next'
import { Miller } from './miller'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useLocation,
  Redirect,
  matchPath,
  useParams,
  useRouteMatch,
} from 'react-router-dom'
import find from 'lodash/find'
import Home from './pages/Home'
import About from './pages/About'
import Outline from './pages/Outline'
import resources from './translations'
import PageLoader from './components/PageLoader'
import PageError from './components/PageError'
import Perspectives from './pages/Perspectives'
import Explorations from './pages/Explorations'
import ExplorationsAll from './pages/ExplorationsAll'
import ExplorationsAlternative from './pages/ExplorationsAlternative'
import ExplorationsCategory from './pages/ExplorationsCategory'
import DocumentDetail from './pages/DocumentDetail'
import DocumentDetailModal from './pages/DocumentDetailModal'
import NotFound from './components/NotFound'
import PerspectiveDetail from './pages/PerspectiveDetail'

const LANGS = ['de_DE', 'en_US', 'fr_FR', 'nl_BE']
const DEFAULT_LANG = 'de_DE'

const DEFAULT_LANG_SHORT = DEFAULT_LANG.split('_')[0]
const LANG_PATH = `/:lang(${LANGS.map((l) => l.split('_')[0]).join('|')})`
const DEFAULT_LANG_PATH = `/${DEFAULT_LANG_SHORT}`

const langMatch = matchPath(window.location.pathname, {
  path: LANG_PATH,
  exact: false,
  strict: false,
})
const startLangShort = langMatch?.params?.lang ?? DEFAULT_LANG_SHORT
const startLang = find(LANGS, (l) => l.indexOf(startLangShort) === 0)

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: startLang,

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  })

// NOTE: This is only need for keep the lang in sync
// when user go back / forwoard in the history manually
function SyncLang() {
  const { i18n } = useTranslation()
  const { lang } = useParams()

  useEffect(() => {
    const memoryLang = i18n.language.split('_')[0]
    if (memoryLang !== lang) {
      const nextLang = find(LANGS, (l) => l.indexOf(lang) === 0)
      i18n.changeLanguage(nextLang)
    }
  }, [lang, i18n])

  return null
}

function LangRoutes() {
  const { path } = useRouteMatch()
  const location = useLocation()
  const prevLocation = useRef(null)

  let background
  if (
    location.state &&
    location.state.background &&
    prevLocation.current !== null
  ) {
    background = location.state.background
  }

  const previewDocument = location.state?.modalDocument

  useEffect(() => {
    prevLocation.current = location
  }, [location])

  return (
    <>
      <Switch location={background || location}>
        <Route exact path={`${path}`}>
          <Suspense fallback={<PageLoader />}>
            <Home />
          </Suspense>
        </Route>
        <Route exact path={`${path}/about`}>
          <About />
        </Route>
        <Route exact path={`${path}/outline`}>
          <Outline />
        </Route>
        <Route exact path={`${path}/perspectives`}>
          <Perspectives />
        </Route>
        <Route exact path={`${path}/perspectives/:slug`}>
          <PerspectiveDetail />
        </Route>
        <Route exact path={`${path}/explorations`}>
          <Explorations />
        </Route>
        <Route exact path={`${path}/explorations/all`}>
          <ExplorationsAll />
        </Route>
        <Route exact path={`${path}/explorations/alternative`}>
          <ExplorationsAlternative />
        </Route>
        <Route exact path={`${path}/explorations/:category`}>
          <ExplorationsCategory />
        </Route>
        <Route exact path={`${path}/documents/:id`}>
          <DocumentDetail />
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
      <Route path={path}>
        <SyncLang />
      </Route>
      {/* MODAL DOC */}
      {background && (
        <Route exact path={`${LANG_PATH}/documents/:id`}>
          <DocumentDetailModal previewDocument={previewDocument} />
        </Route>
      )}
    </>
  )
}

function AppRoutes() {
  return (
    <Switch>
      <Redirect from="/" exact to={DEFAULT_LANG_PATH} />
      <Route path={LANG_PATH}>
        <Suspense fallback={<PageLoader menu />}>
          <LangRoutes />
        </Suspense>
      </Route>
      <Route path="*">
        <NotFound />
      </Route>
    </Switch>
  )
}

// KILL MILLER CACHE IN DEV
let hashParams
let headers

if (process.env.NODE_ENV !== 'production') {
  hashParams = (params) => ({
    ...params,
    nocache: 1,
  })
  headers = () => ({
    'Cache-Control': 'no-cache',
  })
}

export default function App() {
  const { i18n } = useTranslation()
  return (
    <Miller
      hashParams={hashParams}
      headers={headers}
      lang={i18n.language}
      langs={LANGS}
      apiUrl={'/api'}
      cache
      suspense
    >
      <Router>
        <PageError>
          <Suspense fallback={<PageLoader />}>
            <AppRoutes />
          </Suspense>
        </PageError>
      </Router>
    </Miller>
  )
}
