import React, { Component } from 'react'

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
    if (this.state.error) {
      // API Error
      if (this.state.error.name === 'AjaxError') {
        return (
          <h1 className='text-danger'>
            API Error, status {this.state.error.status}
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
