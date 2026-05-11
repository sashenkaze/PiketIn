const Validator = require("fastest-validator");
const v = new Validator();
const { User } = require('../models')
const { response } = require('../helpers/response.formatter')
const { Op } = require("sequelize");
const passwordHash = require('password-hash')

module.exports = {
    createUser: async (req, res) => {
        try{
            // ambil input payload (req.body)
            const { name, nis, email, password, jadwal_piket } = req.body;

            // validasi
            const schema = {
                name: {type: "string"},
                nis: {type: "string"},
                email: {type: "string"},
                password: {type: "string"},
                role: {type: "string"},
                jadwal_piket: {type: "enum", values: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat']}
            }
            // menyiapkan data yg akan divalidasi
            const data = {
                name: name, // fieldDatabase : namaDariReq
                nis: nis,
                email: email,
                password: password,
                role: 'murid',
                jadwal_piket: jadwal_piket
            }
            const validate = v.validate(data, schema);
            if (validate.length > 0) {
                // jika hasil validate ada error...
                return res.status(400).json(response(400, "Validasi Error", validate));
            }

            // proses menyimpan data melalui ORM sequelize
            const user = await User.create({
                name: data.name,
                nis: data.nis,
                email: data.email,
                password: passwordHash.generate(data.password),
                role: 'murid',
                jadwal_piket: data.jadwal_piket
            });
            const { password: _, ...userData } = user.toJSON();
            //! password dipisah (direname jadi _ lalu diabaikan)
            //! sisanya dikumpulkan ke userData
            //! hasilnya userData berisi semua field KECUALI password
            return res.status(201).json(response(201, "created", userData));
        } catch(error) {
            // penanganan error kode di try
            // res : parameter func func untuk untuk memberikan response (hasil)
            // response : method dari helpers formatter untuk format hasil outputnya, output dalam bentuk json
            return res.status(500).json(response(500, "Server Error", error.message));
        }
    },
    getAllUsers: async (req, res) => {
        try {
            const { name, sortBy, order, page, limit } = req.query;

            const offset = (Number(page)-1) * Number(limit);

            const { count, rows } = await User.findAndCountAll({
                attributes: {
                    exclude: ['password'] //! sembunyikan password dri output
                },
                // cari berdasarkan field name di db dari name req.query
                where: name ? {
                    name: {
                        [Op.like]: `%${name}%` // mencari yg mirip
                    } 
                } : {}, // cari berdasarkan field name di db dari name req.query
                // kl di params postman ada sortBy dan order, jalanin pengurutan, kl gk ada pake default, misal sortBy 'stock' order 'DESC'
                order: sortBy && order ? [
                    [sortBy, order] 
                ] : [],
                offset: Number(offset),
                limit: Number(limit),
            });

            const formatPagination = {
                data: rows,
                limit: limit,
                rows: (Number(offset)+1) + "-" + (Number(offset)+rows.length),
                total: count,
                page: page, // sedang di halaman ke berapa
            }
            return res.status(200).json(response(200, "success", formatPagination));
        } catch(error) {
            return res.status(500).json(response(500, "Server Error", error.message));
        }
    },
    getUserById: async (req, res) => {
        try {
            // req.params : ambil path dinamis, /users/2. ambil angka 2 (id)
            const { id } = req.params;
            // fingByPk : mencari berdasarkan primary key (id)
            const user = await User.findByPk(id, {
                attributes: {
                    exclude: ['password'] //! sembunyikan password dri output
                }
            });
            // jika data yg dicari tidak ada di db (artinya angka id nya salah)
            if (!user) {
                return res.status(400).json(response(400, "Data [id] not found"));
            }
            return res.status(200).json(response(200, "success", user));
        } catch(error) {
            return res.status(500).json(response(500, "Server Error", error.message));
        }
    },
        
}