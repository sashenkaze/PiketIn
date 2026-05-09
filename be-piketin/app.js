const express = require('express')
const app = express()
const port = 3000

const db = require('./models')

db.sequelize.authenticate()
    .then(() => console.log("DATABASE TERSAMBUNG SUDAH OKE! DONE! オッケー！ Хорошо!"))
    .catch(err => console.log(err))

const methodOverride = require('method-override')

// kelompok app.use disimpan diatas dari app.get atau listen
// app.use : memasang middleware atau menghubungkan route ke aplikasi
// express.json() : middleware umum, untuk mengakses json body pada payload (postman/input)
app.use(express.json())
app.use(methodOverride('_method'))
// membuat file yg tersimpan di folder uploads, bisa dimunculkan di browser nantinya
app.use('/uploads', express.static('uploads'))


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})