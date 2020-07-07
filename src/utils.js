// Time Str 02:30 -> 150 seconds
export function convertStrToSeconds(str) {
  const [mins, secs] = str.split(':')
  return parseInt(mins) * 60 + parseInt(secs)
}