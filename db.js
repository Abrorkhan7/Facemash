const mongodb = require('mongodb')

const connectionString = 'mongodb+srv://abrorkhamidov:9582675aB@abrorcluster-izppc.mongodb.net/facemash?retryWrites=true&w=majority'
//const connectionString = 'mongodb://localhost:27017/facemash'
mongodb.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client) {
    if(!err && client){
        console.log('connected to db..');
        module.exports = client.db()
        const app = require('./app')
        app.listen(3000)
    }else{
        console.log('error on connecting to db');
    }
}) 