import React, { useState } from 'react'
import styles from './Autocomplete.module.scss'

export default function Autocomplete({
  suggestions,
  loadSuggestions,
  clearSuggestions,
}) {
  const [searchText, setSearchText] = useState('')

  return (
    <div className={styles.autocomplete}>
      <input
        type="text"
        value={searchText}
        onChange={(e) => {
          const text = e.target.value
          setSearchText(text)
          if (text.trim() !== '') {
            loadSuggestions(text)
          } else {
            clearSuggestions()
          }
        }}
      />
      <div className={styles.suggestions}>
        {suggestions &&
          suggestions.map((suggestion) => (
            <div key={suggestion} className={styles.suggestion}>
              {suggestion}
            </div>
          ))}
      </div>
    </div>
  )
}
