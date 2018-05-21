import Member from '../models/Member'

export default ({ params: { id } }) => Member.findById(id).exec()
