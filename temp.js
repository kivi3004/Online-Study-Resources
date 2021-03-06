const express = require('express');
const router = express.Router();
const multer = require("multer");
const fs = require('fs');
var path = require('path');
const connection = require('../../../../db/db');

//idhr se shuru hai 

router.get('/havetodelete', (req, res) => {
    res.render('updateanddeletepapers'); 
});
router.post('/updelpapers', (req, res) => {
    res.redirect('/havetodelete'); 
});


router.get("/uploadsuccesspaper", async (req, res) => {
    const allUsers = await new Promise((resolve, reject)=> {
        //console.log(this);
        var pre = 2;
        const query = `SELECT * FROM mcapapers where presence=?`;
        
        connection.query(query,pre,(err, result)=>{
            if (err) reject(new Error('Something failed (Record Insertion) :' + err));
            resolve (result);
        });
    });
     res.render('updateanddeletepapers', {users: allUsers});
  });

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploading/mcapapers");
  },
  filename: function (req, file, cb) {
    cb(null,file.originalname + path.extname(file.originalname));
  },
});


//const maxSize = 1 * 1024 * 1024; // for 1MB

var upload = multer({
  storage: storage,
//   fileFilter: (req, file, cb) => {
//     if (
//       file.mimetype == "image/png" ||
//       file.mimetype == "image/jpg" ||
//       file.mimetype == "image/jpeg"
//     ) {
//       cb(null, true);
//     } else {
//       cb(null, false);
//       return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
//     }
//   },
//   limits: { fileSize: maxSize },
}).single('file');

router.post("/uploadfilepapers", (req, res) => {
    console.log(req.body);
    let user;
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      res.send(err)
    } else if (err) {
      // An unknown error occurred when uploading.
        res.send(err);
    } else
    {
     // res.redirect('/buysuccess');
    }
     // console.log(req.file);
      var pre = 2;
       user = { 
       name: req.file.originalname,
       place: req.file.path,
       id:req.body.paperid,
       type: req.file.mimetype,
       size:req.file.size,
       presence:pre
       
     };
     console.log(user);
      
      //database work-> store the user
       new Promise((resolve, reject)=> {
            //console.log(this);
            const query = `INSERT INTO mcapapers SET ?`;
               connection.query(query, user, (err, result)=> {
                   if (err) reject(new Error('Something failed (Record Insertion) :' + err));
                    resolve (result);
                   });
               }); 
  })
       
    res.render('updateanddeletepapers');
});


router.post('/watchpapers', async (req, res) => {
    console.log('chlo');
    console.log(req.body);
    var pre = 2;
    const user = {
        id: req.body.Ipaper,
        presence:pre
    }
    const data = [[user.id],[user.presence]];
    const allUsers = await new Promise((resolve, reject)=> {
        //console.log(this);
        const query = `SELECT * FROM mcapapers where id=? AND presence=?`;
        
        connection.query(query,data,(err, result)=>{
            if (err) reject(new Error('Something failed (Record Insertion) :' + err));
            resolve (result);
        });
    });
    console.log(allUsers);
    res.render('updateanddeletepapers', {users: allUsers});
});



router.post('/deletethispp', async(req, res) => {
    console.log(req.body);
    var pre = 2;
    const user = {
        name: req.body.delpaper,
        id: req.body.delid,
        presence:pre
    }

    var filePath = 'G:/collegespace/public/uploading/mcapapers/'+user.name+'.pdf'; 
    fs.unlinkSync(filePath);

    const data = [[user.name],[user.id],[user.presence]];
    new Promise((resolve, reject) => {
        const query = `DELETE FROM mcapapers WHERE name=? AND id=? AND presence=?`;
        connection.query(query,data, (err, result) => {
            if (err) reject(new Error('something failed:'+err));
                resolve(result);
        });
    });
    res.redirect('/uploadsuccesspaper');
});


module.exports = router;