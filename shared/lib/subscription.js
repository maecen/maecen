import moment from 'moment'

export const getNextEndDate = (nextStart, startedAt, durationMonths) => {
  startedAt = moment(startedAt)
  nextStart = moment(nextStart)
  // Round to nearest month, as the months between jan 31th and feb 28th isn't a
  // complete month in days which will result in a lower than whole number, but
  // it should be treated as a whole month
  const monthsSinceStartedAt = Math.round(
    nextStart.diff(startedAt, 'months', true)
  )
  const deltaMonths = monthsSinceStartedAt + durationMonths
  // We add an extra day, so it doesn't expire a month after, but the day
  // after the month has ended, as end end date is not included
  const nextEnd = startedAt.clone()
    .add(deltaMonths, 'months').add(1, 'days').toDate()
  return nextEnd
}
