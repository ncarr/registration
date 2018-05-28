import Action from '../models/Action'

export default ({ params: { id } }) => Action.findById(id).populate('user', ['name', 'email'])
