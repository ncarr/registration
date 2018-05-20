import { Router } from 'express'

import users from './users'
import signin from './signin'

const router = Router()

// Add USERS Routes
router.use(users)
router.use(signin)
router.use((error, req, res, next) => res.status(error.status || 500).json({ error }))

export default router
