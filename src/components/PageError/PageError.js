import React, { Component } from 'react'
import NotFound from '../NotFound'
import MenuResponsive from '../MenuResponsive'
import styles from './PageError.module.scss'

function Error({ message }) {
  return (
    <div className="d-flex flex-column h-100">
      <MenuResponsive></MenuResponsive>
      <div className={styles.notFound}>
        <h1 className="text-danger">{message}</h1>
      </div>
    </div>
  )
}
// Rendered when an error occured both "runtime" and "api" errors
export default class PageError extends Component {
  state = {
    error: null,
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { error }
  }

  render() {
    const { error } = this.state
    if (error) {
      // API Error
      if (error.name === 'AjaxError') {
        if (error.status === 404) {
          return <NotFound />
        }
        return <Error message={`API error: ${error.status}`}></Error>
      }
      // You can render any custom fallback UI
      return <Error message={`Something went wrong`}></Error>
    }

    return this.props.children
  }
}
