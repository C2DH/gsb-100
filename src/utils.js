import deDE from 'd3-time-format/locale/de-DE.json'
import enUS from 'd3-time-format/locale/en-US.json'
import frFR from 'd3-time-format/locale/fr-FR.json'
import nlNL from 'd3-time-format/locale/nl-NL.json'

export const LocaleList = {
  de_DE: deDE,
  en_US: enUS,
  fr_FR: frFR,
  nl_BE: nlNL,
}
// Time Str 02:30 -> 150 seconds
export function convertStrToSeconds(str) {
  const [mins, secs] = str.split(':')
  return parseInt(mins) * 60 + parseInt(secs)
}

export const BREAKPOINTS = {
  xs: { maxWidth: 566 },
  sm: { maxWidth: 767 },
  md: { maxWidth: 991 },
  lg: { maxWidth: 1199 },
  xl: { maxWidth: 1399 },
}
