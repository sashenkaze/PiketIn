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
            return res.status(201).json(response(201, "created", userData));
        } catch(error) {
            // penanganan error kode di try
            // res : parameter func func untuk untuk memberikan response (hasil)
            // response : method dari helpers formatter untuk format hasil outputnya, output dalam bentuk json
            return res.status(500).json(response(500, "Server Error", error.message));
        }
    },
    
}