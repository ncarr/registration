import Member from '../models/Member'

export default ({ body }) => Member.create(body)
