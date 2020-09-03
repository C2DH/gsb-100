import React, { useMemo } from 'react'
import * as d3TimeFormat from 'd3-time-format'
import { useTranslation } from 'react-i18next'
import { LocaleList } from '../../utils'
import styles from './TimelineMobile.module.scss'

const DATE_FORMAT = '%d %B %Y'

function TimelineMobile({ documents, ...rest }) {
  const { i18n } = useTranslation()

  const formatter = useMemo(() => {
    d3TimeFormat.timeFormatDefaultLocale(LocaleList[i18n.language])
    return d3TimeFormat.timeFormat(DATE_FORMAT)
  }, [i18n.language])

  return (
    <div className="d-flex overflow-auto" {...rest}>
      {documents.map((doc) => {
        return (
          <div key={doc.id} className={styles.docContainer}>
            <span className={`text-primary ${styles.date}`}>
              {formatter(new Date(doc.data.start_date))}
            </span>
            <h3 className={styles.title}>{doc.data.title}</h3>
            <p className={styles.description}>{doc.data.description}</p>
          </div>
        )
      })}
    </div>
  )
}

export default TimelineMobile
