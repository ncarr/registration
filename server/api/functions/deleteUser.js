import Member from '../models/Member'

export default (body, me, params) => Member.deleteOne({ _id: params.id }).exec()
