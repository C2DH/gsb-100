import React from 'react'
import ReactDOM from 'react-dom'
import './styles/index.scss'
import App from './App'
import * as serviceWorker from './serviceWorker'
import {
  hydrateInMemoryStoreState,
  getInMemoryStoreState,
} from 'react-rocketjump/plugins/cache'

const preloadedState = window.__PRELOADED_STATE__

// Allow the passed state to be garbage-collected
delete window.__PRELOADED_STATE__

if (preloadedState) {
  hydrateInMemoryStoreState(preloadedState)
}

const rootElement = document.getElementById('root')
if (rootElement.hasChildNodes()) {
  ReactDOM.hydrate(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    rootElement
  )
} else {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    rootElement
  )
}

window.snapSaveState = () => ({
  __PRELOADED_STATE__: getInMemoryStoreState(),
})

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()

// printout current version and link to current github
console.info(
  'v', process.env.REACT_APP_GIT_TAG, process.env.REACT_APP_GIT_BRANCH,
  `\nhttps://github.com/C2DH/gsb-100/commit/${process.env.REACT_APP_GIT_REVISION}`
)
