const express = require('express')
const app = express()
const fileUpload = require('express-fileupload')
const router = require('./router');
const bodyParser=require('body-parser');

app.use(fileUpload())
app.use(bodyParser());
app.use(express.urlencoded({ extended: false }))
app.use(express.json())


app.use(express.static('public'))
app.set('views', 'views')
app.set('view engine', 'ejs')
app.use('/', router)
module.exports = app