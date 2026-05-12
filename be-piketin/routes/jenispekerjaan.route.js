const express = require('express')
const router = express.Router()

const { checkToken, checkRole } = require('../middlewares/auth')
const jenispekerjaanController = require('../controllers/jenispekerjaan.controller')
const upload = require('../middlewares/upload')

router.get('/', checkToken, checkRole('admin'), jenispekerjaanController.getAllJenisPekerjaan)
router.get('/:id', checkToken, checkRole('admin'), jenispekerjaanController.getJenisPekerjaanById)
router.post('/', checkToken, checkRole('admin'), upload.none(), jenispekerjaanController.createJenisPekerjaan)
router.put('/:id', checkToken, checkRole('admin'), upload.none(), jenispekerjaanController.updateJenisPekerjaan)
router.delete('/:id', checkToken, checkRole('admin'), jenispekerjaanController.deleteJenisPekerjaan)

module.exports = router
