const express = require('express')
const router = express.Router()
const fileUpload = require('express-fileupload')
const uploadController = require('./controllers/uploadController')
const Image = require('./model/Image')
const db = require('./db')
const path = require('path');
let ObjectId=require('mongodb').ObjectID

//Main page
router.get('/', function (req, res) {
    db.collection('images').find({}).sort({rank:1}).limit(2).toArray((err, images) =>{
        res.render('home-guest', {images})
    })
})
router.get('/imageUpload', uploadController.uploadPage)

//Ranks

//Upload girls images
router.post('/girlUpload', async (req,res) =>{
    let uploadedImage
    let uploadPath

    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).send('No files were uploaded.');
        return;
    }

    //console.log('req.files >>>', req.files); // eslint-disable-line

    uploadedImage = req.files.uploadedImage;

    uploadPath = __dirname + '/public/uploads/girls/' + uploadedImage.name;

    uploadedImage.mv(uploadPath, function (err) {
        if (err) {
            return res.status(500).send(err);
        }

        res.send('File uploaded to ' + uploadPath + " <br /><a href='/'>Home</a>");

    });

    let imageData={
        name:uploadedImage.name,
        rank:1
    }
    let image = new Image(imageData)
    image.saveGirlsImage()
})
// "/animals"
router.post('/animalUpload', async (req, res) => {
    let uploadedImage
    let uploadPath

    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).send('No files were uploaded.');
        return;
    }

    //console.log('req.files >>>', req.files); // eslint-disable-line

    uploadedImage = req.files.uploadedImage;

    uploadPath = __dirname + '/public/uploads/animals/' + uploadedImage.name;

    uploadedImage.mv(uploadPath, function (err) {
        if (err) {
            return res.status(500).send(err);
        }

        res.send('File uploaded to ' + uploadPath + " <br /><a href='/'>Home</a>");

    });

    let imageData = {
        name: uploadedImage.name,
        rank: 1
    }
    let image = new Image(imageData)
    image.saveAnimalsImage()
})

//// Celebrity image upload

router.post('/celebrityUpload', async (req, res) => {
    let uploadedImage
    let uploadPath

    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).send('No files were uploaded.');
        return;
    }

    //console.log('req.files >>>', req.files); // eslint-disable-line

    uploadedImage = req.files.uploadedImage;

    uploadPath = __dirname + '/public/uploads/celebrities/' + uploadedImage.name;

    uploadedImage.mv(uploadPath, function (err) {
        if (err) {
            return res.status(500).send(err);
        }

        res.send('File uploaded to ' + uploadPath + " <br /><a href='/'>Home</a>");

    });

    let imageData = {
        name: uploadedImage.name,
        rank: 1
    }
    let image = new Image(imageData)
    image.saveCelebritiesImage()
})


//vote 
router.post('/vote',(req, res, next)=>{
    let b=req.body;
    console.log(b);
    db.collection('images').findOne({_id:ObjectId(b.loser)},(err, loserImage)=>{
        if(loserImage){
            //update rank of winner image
            db.collection('images').findOneAndUpdate({
                _id:ObjectId(b.winner)
            },{
                $inc:{rank:loserImage.rank}
            },(err, updatedWinnerImage)=>{
                if(err) return next(err);
                updatedWinnerImage = updatedWinnerImage.value;
                console.log('updated');
                console.log(updatedWinnerImage);

                // send new image data
                // getting lower ranked images
                db.collection('images').find({
                    $query:{
                        _id: {
                            $nin: [ObjectId(b.winner), ObjectId(b.loser)]
                        },
                        rank: { $lte:updatedWinnerImage.rank}
                    },
                    $orderby:{rank:-1}
                }).limit(50).toArray((err, lowerRankedImages) => {
                    let lowerRankedImage=lowerRankedImages[Math.floor(Math.random()*lowerRankedImages.length)];

                    // getting higherRankedImages
                    db.collection('images').find({
                        $query: {
                            _id: {
                                $nin: [ObjectId(b.winner), ObjectId(b.loser)]
                            },
                            rank: { $gte: updatedWinnerImage.rank}
                        },
                        $orderby: { rank: 1 }
                    }).limit(50).toArray((err, higherRankedImages) => {
                        let higherRankedImage = higherRankedImages[Math.floor(Math.random() * higherRankedImages.length)];
                        if((updatedWinnerImage.rank - lowerRankedImage.rank) > (higherRankedImage.rank - updatedWinnerImage.rank)){
                            var image=higherRankedImage;
                        }else{
                            image=lowerRankedImage;
                        }

                        // sending image
                        if (image) {
                            res.json({
                                name: image.name,
                                id: image._id,
                                result: 'success'
                            });
                        } else {
                            res.json({
                                result: 'error',
                                message: 'image not found'
                            })
                        }
                    });
                });
            });
        }else{
            res.json({
                result:'error',
                message:'loser image notfound for id: '+b.loser
            })
        }
        
    });
    
})
//Error page
router.get('*', function (req, res) { res.render('404'); });
module.exports = router 