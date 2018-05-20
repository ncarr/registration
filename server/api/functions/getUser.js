import Member from '../models/Member'

export default (body, me, params) => Member.findById(params.id).exec()
