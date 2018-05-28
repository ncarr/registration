import Action from '../models/Action'

export default () => Action.find().populate('user', 'name').exec()
