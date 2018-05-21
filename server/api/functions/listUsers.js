import Member from '../models/Member'

// TODO: pagination
export default ({ query: { filter } }) => {
  let filters = {}
  if (filter) {
    if (!Array.isArray(filter)) {
      filter = [filter]
    }
    for (const f of filter) {
      filters.status = { $in: [] }
      if (f === 'applicants') {
        filters.status.$in.push(1)
      } else if (f === 'going') {
        filters.status.$in.push(5)
      }
    }
  }
  return Member.find(filters).exec()
}
