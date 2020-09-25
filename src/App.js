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
import intersection from 'lodash/intersection'
import Home from './pages/Home'
import About from './pages/About'
import TermsOfUse from './pages/TermsOfUse'
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
import Cookie from './components/Cookie'
import {
  UnqueMedia,
  useUniqueMediaStop,
} from './components/PerspectiveModule/UniqueMedia'

const LANGS = ['de_DE', 'en_US', 'fr_FR', 'nl_BE']
const LANGS_SHORTS = LANGS.map((l) => l.split('_')[0])
const DEFAULT_LANG = 'de_DE'

const DEFAULT_LANG_SHORT = DEFAULT_LANG.split('_')[0]
const LANG_PATH = `/:lang(${LANGS_SHORTS.join('|')})`

const getStartLang = () => {
  // try to get language from path if any
  const langMatch = matchPath(window.location.pathname, {
    path: LANG_PATH,
    exact: false,
    strict: false,
  })
  let startLangShort = langMatch?.params?.lang
  if (!startLangShort || !LANGS_SHORTS.includes(startLangShort)) {
    // get default short language from browser
    const browserLangsShort = window.navigator?.languages ?? []
    console.info('browser languages detected:', browserLangsShort)
    const availablesLangsShort = intersection(browserLangsShort, LANGS_SHORTS)
    startLangShort = availablesLangsShort.length > 0
      ? availablesLangsShort[0]
      : DEFAULT_LANG_SHORT
  }
  return {
    startLangShort,
    startLang: find(LANGS, (l) => l.indexOf(startLangShort) === 0)
  }
}

const { startLang, startLangShort } = getStartLang()
console.info('start language:', startLang)
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

function StopMedias({ background }) {
  const { stopMedias, clearStopMedias } = useUniqueMediaStop()
  useEffect(() => {
    if (background) {
      stopMedias()
      return clearStopMedias
    }
  }, [background, clearStopMedias, stopMedias])

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
    <React.Fragment>
      <UnqueMedia>
        <Cookie>
          <Switch location={background || location}>
            <Route exact path={`${path}`}>
              <Suspense fallback={<PageLoader />}>
                <Home />
              </Suspense>
            </Route>
            <Route exact path={`${path}/about`}>
              <About />
            </Route>
            <Route exact path={`${path}/terms-of-use`}>
              <TermsOfUse />
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
            <Route path={`${path}*`}>
              <NotFound />
            </Route>
          </Switch>
          <Route path={path}>
            <SyncLang />
          </Route>
          <StopMedias background={background} />
          {/* MODAL DOC */}
          {background && (
            <Route exact path={`${LANG_PATH}/documents/:id`}>
              <DocumentDetailModal previewDocument={previewDocument} />
            </Route>
          )}
        </Cookie>
      </UnqueMedia>
    </React.Fragment>
  )
}

function AppRoutes() {
  return (
    <Switch>
      <Redirect from="/" exact to={startLangShort} />
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

let headers

// Disable miller cache when in DEV or in React SNAP Context
if (
  process.env.NODE_ENV !== 'production' ||
  navigator.userAgent === 'ReactSnap'
) {
  headers = () => ({
    'Cache-Control': 'no-cache',
  })
}

// Use custom proxy api url when in React SNAP Context
const apiUrl =
  navigator.userAgent === 'ReactSnap' ? 'http://localhost:3033/api' : '/api'

export default function App() {
  const { i18n } = useTranslation()
  return (
    // NOTE: Why another <PageError /> ?
    // Cause <PageError /> render menu that need API to be displayed
    // if API 4 menu don't work you see a black screen cause
    // <PageError /> trigger another error...
    // With this top <PageError /> without menu "menu={false}"
    // we can hanlde ALL error and the final user has always a
    // good message and a good user experience....
    <PageError menu={false}>
      <Miller
        headers={headers}
        lang={i18n.language}
        langs={LANGS}
        apiUrl={apiUrl}
        cache
        suspense
      >
        <Router>
          <Suspense fallback={<PageLoader />}>
            <PageError>
              <AppRoutes />
            </PageError>
          </Suspense>
        </Router>
      </Miller>
    </PageError>
  )
}
