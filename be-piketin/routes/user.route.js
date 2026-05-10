const express = require('express')
const router = express.Router()

const { checkToken, checkRole } = require('../middlewares/auth')
const userController = require('../controllers/user.controller')
const upload = require('../middlewares/upload')

router.get('/', checkToken, checkRole('admin'), userController.getAllUsers)
router.get('/:id', checkToken, checkRole('admin'), userController.getUserById)
router.post('/', checkToken, checkRole('admin'), upload.none(), userController.createUser)
// router.put('/:id', checkToken, checkRole('admin'), userController.updateUser)
// router.delete('/:id', checkToken, checkRole('admin'), userController.deleteUser)

module.exports = router
