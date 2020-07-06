import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import * as d3TimeFormat from 'd3-time-format'
import LocaleList from './LocaleList'
import styles from './DocumentInfoMetadata.module.scss'

const METATADA_KEYS = ['date', 'creator', 'provenance', 'copyright']

const getDate = (data, formatter) => {
  if (data.date) {
    return data.date
  } else if (data.start_date && !data.end_date) {
    return formatter.timeFormat('%d %B %Y')(new Date(data.start_date))
  } else if (data.year) {
    return data.year
  } else if (data.start_date && data.end_date) {
    if (data.start_date === data.end_date) {
      return formatter.timeFormat('%d %B %Y')(new Date(data.start_date))
    } else {
      return `${formatter.timeFormat('%d %B %Y')(
        new Date(data.start_date)
      )} - ${formatter.timeFormat('%d %B %Y')(new Date(data.end_date))}`
    }
  } else {
    return '-'
  }
}

export default function DocumentInfoMetadata({ data }) {
  const { t, i18n } = useTranslation()

  const metadata = useMemo(() => {
    d3TimeFormat.timeFormatDefaultLocale(LocaleList[i18n.language])
    return METATADA_KEYS.map((m) => {
      let value

      if (m === 'date') {
        value = getDate(data, d3TimeFormat)
      } else {
        value = data[m] ? data[m] : '-'
      }
      return { label: m, value: value }
    }).filter((d) => d.value !== '-')
  }, [data, i18n])

  return (
    <table className={`${styles.tableBorders} table`}>
      <tbody>
        {metadata.map((d) => {
          return (
            <tr key={d.label}>
              <th scope="row" className="text-primary text-capitalize">
                {t(d.label)}
              </th>
              <td>{d.value}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
