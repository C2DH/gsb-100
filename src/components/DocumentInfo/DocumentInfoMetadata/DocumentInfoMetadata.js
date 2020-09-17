import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import * as d3TimeFormat from 'd3-time-format'
import { LocaleList } from '../../../utils'
import styles from './DocumentInfoMetadata.module.scss'

const METATADA_KEYS = ['date', 'creator', 'provenance', 'copyright']
const DATE_FORMAT = '%d %B %Y'

const getDate = (data, formatter) => {
  if (data.date) {
    return data.date
  } else if (data.start_date && !data.end_date) {
    return formatter(new Date(data.start_date))
  } else if (data.year) {
    return data.year
  } else if (data.start_date && data.end_date) {
    if (data.start_date === data.end_date) {
      return formatter(new Date(data.start_date))
    } else {
      return `${formatter(new Date(data.start_date))} - ${formatter(
        new Date(data.end_date)
      )}`
    }
  } else {
    return null
  }
}

export default function DocumentInfoMetadata({ data }) {
  const { t, i18n } = useTranslation()

  const metadata = useMemo(() => {
    d3TimeFormat.timeFormatDefaultLocale(LocaleList[i18n.language])
    return METATADA_KEYS.map((m) => {
      let value

      if (m === 'date') {
        value = getDate(data, d3TimeFormat.timeFormat(DATE_FORMAT))
      } else {
        value = data[m] ? data[m] : null
      }
      return { label: m, value: value ? value.toString() : '' }
    }).filter((d) => d.value)
  }, [data, i18n.language])

  return (
    <table className={`${styles.tableBorders} table mb-0 mb-lg-auto`}>
      <tbody>
        {metadata.map((d) => {
          return (
            <tr key={d.label}>
              <th
                scope="row"
                className="text-primary text-capitalize font-weight-normal"
              >
                {t(d.label)}
              </th>
              <td>{t(d.value)}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
