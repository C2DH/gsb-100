import React, { useEffect, useRef, useReducer, useState } from 'react'
import classNames from 'classnames'
import styles from './Autocomplete.module.scss'
import { Search, X } from 'react-feather'

const initialState = {
  searchText: '',
  highlighted: null,
  showSuggestions: false,
}
function initAutocompleteReducer(initialSearch) {
  return {
    ...initialState,
    searchText: initialSearch,
  }
}

function autocompleteReducer(state, action) {
  if (action.type === 'SELECT') {
    return {
      ...state,
      highlighted: null,
      showSuggestions: false,
      searchText: action.suggestion,
    }
  } else if (action.type === 'HIGHLIGHT') {
    return {
      ...state,
      highlighted: action.index,
    }
  } else if (action.type === 'SEARCH_INPUT') {
    return {
      ...state,
      highlighted: null,
      searchText: action.text,
    }
  } else if (action.type === 'ARROW_UP') {
    const { lastSuggestions } = action
    if (lastSuggestions === null) {
      return state
    }

    let nextHighlighted
    if (state.highlighted === null) {
      nextHighlighted = 0
    } else if (state.highlighted === 0) {
      nextHighlighted = lastSuggestions.length - 1
    } else {
      nextHighlighted = state.highlighted - 1
    }
    const nextSearchText = lastSuggestions[nextHighlighted]
    return {
      ...state,
      highlighted: nextHighlighted,
      searchText: nextSearchText,
    }
  } else if (action.type === 'ARROW_DOWN') {
    const { lastSuggestions } = action
    if (lastSuggestions === null) {
      return state
    }

    let nextHighlighted
    if (state.highlighted === null) {
      nextHighlighted = 0
    } else if (state.highlighted === lastSuggestions.length - 1) {
      nextHighlighted = 0
    } else {
      nextHighlighted = state.highlighted + 1
    }
    const nextSearchText = lastSuggestions[nextHighlighted]

    return {
      ...state,
      highlighted: nextHighlighted,
      searchText: nextSearchText,
    }
  } else if (action.type === 'SHOW_SUGGESTIONS') {
    return {
      ...state,
      showSuggestions: true,
    }
  } else if (action.type === 'HIDE_SUGGESTIONS') {
    return {
      ...state,
      showSuggestions: false,
    }
  }
  throw new Error('Bad action')
}

export default function Autocomplete({
  initialSearch = '',
  suggestions,
  loadSuggestions,
  clearSuggestions,
  placeholder,
  onSelected,
}) {
  const [{ searchText, highlighted, showSuggestions }, dispatch] = useReducer(
    autocompleteReducer,
    initialSearch,
    initAutocompleteReducer
  )
  const lastSuggestionsRef = useRef(null)
  const inputRef = useRef(null)
  const [searchIcon, setSeachIcon] = useState(true)

  useEffect(() => {
    function handleKeyDown(e) {
      const lastSuggestions = lastSuggestionsRef.current
      if (e.code === 'ArrowUp') {
        dispatch({
          type: 'ARROW_UP',
          lastSuggestions,
        })
      } else if (e.code === 'ArrowDown') {
        dispatch({
          type: 'ARROW_DOWN',
          lastSuggestions,
        })
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(() => {
    lastSuggestionsRef.current = suggestions
  }, [suggestions])

  function selectSuggestion(index) {
    const lastSuggestions = lastSuggestionsRef.current
    if (lastSuggestions !== null && lastSuggestions[index] !== undefined) {
      const suggestion = lastSuggestions[index]
      inputRef.current.blur()
      dispatch({ type: 'SELECT', suggestion })
      onSelected(lastSuggestions[index])
      if (suggestion !== searchText) {
        loadSuggestions(suggestion)
      }
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (searchText === '') {
      onSelected('') // Clear is requested!
    } else if (highlighted !== null) {
      selectSuggestion(highlighted)
    } else {
      inputRef.current.blur()
      dispatch({ type: 'SELECT', suggestion: searchText })
      onSelected(searchText)
    }
    setSeachIcon(false)
  }

  function reset(e) {
    e.preventDefault()
    onSelected('')
    dispatch({
      type: 'SEARCH_INPUT',
      text: '',
    })
    setSeachIcon(true)
  }

  function handleOnFocus() {
    dispatch({ type: 'SHOW_SUGGESTIONS' })
  }

  function handleOnBlur(e) {
    dispatch({ type: 'HIDE_SUGGESTIONS' })
  }

  return (
    <form onSubmit={handleSubmit} className={`${styles.autocomplete}`}>
      <div className="form-group mb-0 d-flex">
        <div className="input-group-prepend">
          {searchIcon ? (
            <button className="btn btn-secondary" type="submit">
              <Search></Search>
            </button>
          ) : (
            <button className="btn btn-secondary" onClick={reset}>
              <X></X>
            </button>
          )}
        </div>
        <input
          className="form-control"
          ref={inputRef}
          onBlur={handleOnBlur}
          onFocus={handleOnFocus}
          placeholder={placeholder}
          type="text"
          value={searchText}
          onChange={(e) => {
            const text = e.target.value
            dispatch({
              type: 'SEARCH_INPUT',
              text,
            })
            if (text.trim() !== '') {
              loadSuggestions(text)
            } else {
              clearSuggestions()
            }
            setSeachIcon(true)
          }}
        />
      </div>
      {showSuggestions && (
        <div className={styles.suggestions}>
          {suggestions &&
            suggestions.map((suggestion, i) => (
              <div
                onMouseOver={() =>
                  dispatch({
                    type: 'HIGHLIGHT',
                    index: i,
                  })
                }
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectSuggestion(i)}
                key={suggestion}
                className={classNames(styles.suggestion, {
                  [styles.highlighted]: i === highlighted,
                })}
              >
                {suggestion}
              </div>
            ))}
        </div>
      )}
    </form>
  )
}
