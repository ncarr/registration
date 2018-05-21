import Member from '../models/Member'

export default ({ params: { id } }) => Member.deleteOne({ _id: id }).exec()
