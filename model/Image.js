const imagesCollection = require('../db').collection('images')
let Image = function (data) {
    this.data = data}
Image.prototype.saveImage = function(){
    imagesCollection.insertOne(this.data)
   
}
module.exports = Image