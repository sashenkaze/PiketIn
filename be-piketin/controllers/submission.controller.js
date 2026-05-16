const Validator = require("fastest-validator");
const v = new Validator();
const { User, Submission, JenisPekerjaan, SubmissionPekerjaan, sequelize} = require('../models');
const { response } = require('../helpers/response.formatter')
const { Op } = require("sequelize");

module.exports = {
    createSubmission: async (req, res) => {
        //! transaction dimulai sebelum try, karena kalau gagal di tengah harus rollback
        //! sequelize.transaction() : membuat "sesi" query. semua query di dalamnya harus sukses semua atau batal semua
        const t = await sequelize.transaction();
        try {
            const { status_piket, kondisi, catatan, pekerjaan_ids } = req.body;

            //! cek file upload.fields(). berbeda dari req.file (upload.single)
            //! req.files['nama_field'][0] : ambil file pertama dari field tersebut
            if (!req.files || !req.files['foto_sebelum'] || !req.files['foto_sesudah']) {
                await t.rollback(); //! batal semua query di transaction
                return res.status(400).json(response(400, "Validasi Error", "Foto sebelum dan sesudah wajib diupload" ));
            }

            const schema = {
                status_piket: { type: "enum", values: ["Piket", "Tidak Piket"] },
                kondisi: { type: "enum", values: ["Bersih dan Rapi", "Bersih", "Kurang"] },
            }
            const data = {
                status_piket: status_piket,
                kondisi: kondisi,
            }
            const validate = v.validate(data, schema);
            if (validate.length > 0) {
                await t.rollback();
                return res.status(400).json(response(400, "Validasi Error", validate));
            }

            //! ambil data user dari jwt payload yg disimpan checktoken di req.user
            //! req.user.userId -> di set waktu jwt.sign() di logincontroller
            const user = await User.findByPk(req.user.userId);
            if (!user) {
                await t.rollback();
                return res.status(400).json(response(400, "User not found"));
            }

            //! getDay() return angka: 0=Minggu, 1=Senin, 2=Selasa, 3=Rabu, 4=Kamis, 5=Jumat, 6=Sabtu
            const namaHari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
            const hariIni = namaHari[new Date().getDay()];
            if (user.jadwal_piket !== hariIni) {
                await t.rollback();
                return res.status(400).json(response(400, `Bukan jadwal piket kamu. Jadwal kamu: ${user.jadwal_piket}`));
            }

            //! BARU: cek 1 submission per hari — kalau sudah ada yg Pending/Accepted hari ini, tolak
            //! toISOString().split('T')[0] : ambil bagian tanggal saja dari datetime → format YYYY-MM-DD
            const tanggalHariIni = new Date().toISOString().split('T')[0];
            const existingSubmission = await Submission.findOne({
                where: {
                    user_id: req.user.userId,
                    tanggal_piket: tanggalHariIni,
                    status: { [Op.ne]: 'Declined' } // Op.ne : not equal — kalau Declined boleh submit baru
                }
            });
            if (existingSubmission) {
                await t.rollback();
                return res.status(400).json(response(400, "Kamu sudah submit absen hari ini"));
            }

            const fotoSebelum = req.files['foto_sebelum'][0].filename;
            const fotoSesudah = req.files['foto_sesudah'][0].filename;

            //! BARU: { transaction: t } — query ini masuk dalam sesi transaction
            //! kalau query berikutnya gagal, ini ikut di-rollback
            const submission = await Submission.create({
                user_id: req.user.userId,
                tanggal_piket: tanggalHariIni,
                status_piket: data.status_piket,
                kondisi: data.kondisi,
                catatan: catatan || null,
                foto_sebelum: fotoSebelum,
                foto_sesudah: fotoSesudah,
                status: 'Pending'
            }, { transaction: t });

            //! BARU: pekerjaan_ids bisa array (kalau pilih banyak) atau string (kalau pilih 1)
            //! Array.isArray() : cek apakah sudah berbentuk array atau belum
            const ids = Array.isArray(pekerjaan_ids) ? pekerjaan_ids : [pekerjaan_ids];

            //! BARU: map() — ubah array ids jadi array object siap insert
            const spData = ids.map(id => ({
                submission_id: submission.id,
                pekerjaan_id: Number(id),
                createdAt: new Date(),
                updatedAt: new Date()
            }));

            //! BARU: bulkCreate — insert banyak baris sekaligus (kebalikan dari create yg hanya 1 baris)
            //! ini bagian kedua dari transaction — kalau ini gagal, submission di atas ikut di-rollback
            await SubmissionPekerjaan.bulkCreate(spData, { transaction: t });

            //! BARU: commit — tandai transaction selesai dan semua perubahan disimpan permanen
            await t.commit();

            // ambil hasil lengkap dengan relasi
            const result = await Submission.findByPk(submission.id, {
                include: [
                    { model: User, attributes: { exclude: ['password'] } },
                    { model: JenisPekerjaan }
                ]
            });
            return res.status(201).json(response(201, "created", result));
        } catch(error) {
            return res.status(500).json(response(500, "Server Error", error.message));
        }
    },
    getAllSubmissions: async (req, res) => {
        try {
            const { page, limit, status } = req.query;
            const offset = (Number(page) - 1) * Number(limit);

            const { count, rows } = await Submission.findAndCountAll({
                where: status ? { status } : {},
                offset: Number(offset),
                limit: Number(limit),
                //! include dengan object, bisa tambah opsi seperti attributes
                include: [
                    { model: User, attributes: { exclude: ['password'] } },
                    { model: JenisPekerjaan }
                ],
                order: [['createdAt', 'DESC']]
            });

            const formatPagination = {
                data: rows,
                limit: limit,
                rows: (Number(offset) + 1) + "-" + (Number(offset) + rows.length),
                total: count,
                page: page,
            };
            return res.status(200).json(response(200, "success", formatPagination));
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message));
        }
    },
    getMySubmission: async (req, res) => {
        try {

        } catch {
            return res.status(500).json(response(500, "Server Error", error.message));
        }
    }
}