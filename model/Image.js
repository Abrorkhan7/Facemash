const girlsCollection = require('../db').collection('images')
const animalsCollection = require('../db').collection('animals')
const celebritiesCollection = require('../db').collection('celebrities')
let Image = function (data) {
    this.data = data}
Image.prototype.saveGirlsImage = function(){
    girlsCollection.insertOne(this.data)
   
}
Image.prototype.saveAnimalsImage = function () {
    animalsCollection.insertOne(this.data)

}
Image.prototype.saveCelebritiesImage = function () {
    celebritiesCollection.insertOne(this.data)

}
module.exports = Image