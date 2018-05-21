import Member from '../models/Member'

export default ({ body, params: { id } }) => Member.findByIdAndUpdate(id, { $set: body }).exec()
