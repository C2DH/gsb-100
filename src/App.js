import React, { Suspense } from 'react'
import i18n from 'i18next'
import { initReactI18next, useTranslation } from 'react-i18next'
import { Miller } from './miller'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Outline from './pages/Outline'
import resources from './translations'
import PageLoader from './components/PageLoader'
import PageError from './components/PageError'
import Perspectives from './pages/Perspectives'
import Explorations from './pages/Explorations'

const LANGS = ['fr_FR', 'de_DE', 'en_US', 'nl_BE']

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'de_DE',

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  })

function AppRoutes() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
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
    </Switch>
  )
}

export default function App() {
  const { i18n } = useTranslation()
  return (
    <Miller lang={i18n.language} langs={LANGS} apiUrl={'/api'} cache suspense>
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
