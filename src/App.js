import React, { Suspense, useRef, useEffect } from 'react'
import i18n from 'i18next'
import { initReactI18next, useTranslation } from 'react-i18next'
import { Miller } from './miller'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useLocation,
} from 'react-router-dom'
import qs from 'query-string'
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

const LANGS = ['de_DE', 'en_US', 'fr_FR', 'nl_BE']

let queryLang = qs.parse(window.location.search).lang
if (!queryLang || LANGS.indexOf(queryLang) === -1) {
  queryLang = 'de_DE'
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: queryLang,

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  })

function AppRoutes() {
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
        <Route exact path="/">
          <Suspense fallback={<PageLoader />}>
            <Home />
          </Suspense>
        </Route>
        <Route exact path="/about">
          <About />
        </Route>
        <Route exact path="/outline">
          <Outline />
        </Route>
        <Route exact path="/perspectives">
          <Perspectives />
        </Route>
        <Route exact path="/explorations">
          <Explorations />
        </Route>
        <Route exact path="/explorations/all">
          <ExplorationsAll />
        </Route>
        <Route exact path="/explorations/alternative">
          <ExplorationsAlternative />
        </Route>
        <Route exact path="/explorations/:category">
          <ExplorationsCategory />
        </Route>
        <Route exact path="/documents/:id">
          <DocumentDetail />
        </Route>
      </Switch>
      {/* MODAL DOC */}
      {background && (
        <Route exact path="/documents/:id">
          <DocumentDetailModal previewDocument={previewDocument} />
        </Route>
      )}
    </>
  )
}

export default function App() {
  const { i18n } = useTranslation()
  return (
    <Miller lang={i18n.language} langs={LANGS} apiUrl={'/api'} cache suspense>
      <Router>
        <PageError>
          <Suspense fallback={<PageLoader />}>
            <Suspense fallback={<PageLoader menu />}>
              <AppRoutes />
            </Suspense>
          </Suspense>
        </PageError>
      </Router>
    </Miller>
  )
}
