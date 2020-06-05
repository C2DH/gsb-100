import React from 'react'
import i18n from 'i18next'
import { initReactI18next, useTranslation } from 'react-i18next'
import { Miller } from './miller'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Outline from './pages/Outline'

const LANGS = ['fr_FR', 'de_DE', 'en_EN']

const resources = {
  fr_FR: {
    translation: {
      hello: 'Bonjour',
    },
  },
  en_EN: {
    translation: {
      hello: 'Hello',
    },
  },
  de_DE: {
    translation: {
      hello: 'Hallo',
    },
  },
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en_EN',

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
    </Switch>
  )
}

export default function App() {
  const { i18n } = useTranslation()
  return (
    <Miller lang={i18n.language} langs={LANGS} apiUrl={'/api'} cache suspense>
      <Router>
        <AppRoutes />
      </Router>
    </Miller>
  )
}
