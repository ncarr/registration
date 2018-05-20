import Member from '../models/Member'

export default (user, me, params) => Member.findByIdAndUpdate(params.id, { $set: user }).exec()
