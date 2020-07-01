import React, { Component } from 'react'
import NotFound from '../NotFound'

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
        return (
          <h1 className='text-danger'>
            API Error, status {error.status}
          </h1>
        )
      }
      // You can render any custom fallback UI
      return (
        <h1 className='text-danger'>Something went wrong.</h1>
      )
    }

    return this.props.children
  }
}
