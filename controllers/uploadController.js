const Image = require('../model/Image')
const db = require('../db')

exports.uploadPage = function (req, res) {
    res.render('imageUpload')
}
exports.save = function(req, res){
    let image = new Image(req.body)
    image.saveImage()
    res.send("Thanks")
}