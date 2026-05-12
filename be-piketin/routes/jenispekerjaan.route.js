const express = require('express')
const router = express.Router()

const { checkToken, checkRole } = require('../middlewares/auth')
const jenispekerjaanController = require('../controllers/jenispekerjaan.controller')
const upload = require('../middlewares/upload')

router.post('/', checkToken, checkRole('admin'), upload.none(), jenispekerjaanController.createJp)
router.get('/', checkToken, checkRole('admin'), jenispekerjaanController.getAllJp)
router.get('/:id', checkToken, checkRole('admin'), jenispekerjaanController.getJpById)
router.put('/:id', checkToken, checkRole('admin'), upload.none(), jenispekerjaanController.updateJp)
router.delete('/:id', checkToken, checkRole('admin'), jenispekerjaanController.deleteJp)

module.exports = router
