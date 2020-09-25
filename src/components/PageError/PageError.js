import React, { Component } from 'react'
import { useTranslation } from 'react-i18next'
import NotFound from '../NotFound'
import MenuResponsive from '../MenuResponsive'
import styles from './PageError.module.scss'
import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useRef } from 'react'

function Error({ message, menu }) {
  const { t } = useTranslation()
  return (
    <div className="d-flex flex-column h-100">
      {menu && <MenuResponsive></MenuResponsive>}
      <div className={styles.notFound}>
        <h1 className="text-danger">{t(message)}</h1>
      </div>
    </div>
  )
}

function ClearErrorWhenNavigateAway({ clearError }) {
  const location = useLocation()
  const didMount = useRef(false)

  useEffect(() => {
    if (didMount.current) {
      clearError()
    } else {
      didMount.current = true
    }
  }, [location, clearError])

  return null
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

  clearError = () => this.setState({ error: null })

  render() {
    const { menu } = this.props
    const { error } = this.state
    if (error) {
      // API Error
      if (error.name === 'AjaxError') {
        if (error.status === 404) {
          return (
            <>
              {menu && (
                <ClearErrorWhenNavigateAway clearError={this.clearError} />
              )}
              <NotFound />
            </>
          )
        }
        return (
          <>
            {menu && (
              <ClearErrorWhenNavigateAway clearError={this.clearError} />
            )}
            <Error
              menu={menu}
              message={`API error`}
              status={error.status}
            ></Error>
          </>
        )
      }
      // You can render any custom fallback UI
      return (
        <>
          {menu && <ClearErrorWhenNavigateAway clearError={this.clearError} />}
          <Error menu={menu} message={`something went wrong`} />
        </>
      )
    }

    return this.props.children
  }
}

PageError.defaultProps = {
  menu: true,
}
