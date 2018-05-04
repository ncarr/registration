import { Router } from 'express'

import users from './users'
import signin from './signin'

const router = Router()

// Add USERS Routes
router.use(users)
router.use(signin)

export default router
