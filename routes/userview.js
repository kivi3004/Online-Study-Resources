const express = require('express');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const db = require('../util/database');
const router = express.Router();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const randomString = require('randomstring');
dotenv.config();

//add some urls
router.get('/osr/userview', authenticateToken, (req, res) => {
    res.render("index", { message: "Home Page", flag : true })
})
router.get('/osr/addResources', authenticateToken, (req, res) => {
    res.render("addResources");
})
router.post('/osr/dashboard', authenticateToken, (req, res) => {
    const id = req.user.id
    db.execute("SELECT * FROM RESOURCES")
    .then(rs => {
        var result = rs[0];
        console.log(result)
        
        res.render("dashboard", {data : result})
    })
    .catch(err => console.log(err))
})
 
router.get('/osr/activities', authenticateToken, (req, res) => {
    const id = req.user.id;

    db.execute("SELECT * FROM RESOURCES WHERE USER_ID = ?", [id])
        .then(rs => {
            var result = rs[0];
            console.log(result)
            var ext = path.extname(result[0].content)
            res.render("dashboard", {data : result})
        })
        
        .catch(err => console.log(err))

})


// I had added above routes url


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function (req, file, cb) {
        // file.originalname = Math.random().toString(36).toUpperCase().substring(7) + file.originalname;
        file.originalname = randomString.generate({
            length: 12,
            charset: 'alphanumeric',
            capitalization: 'lowercase'
        }) + path.extname(file.originalname);
        cb(null, file.originalname);
        // console.log(file.originalname + '-' + path.extname(file.originalname));
        // console.log(file.originalname);
        // req.body = {
        //     file_name: file.originalname
        // }
    }
});

router.post('/osr/resources', authenticateToken, (req, res) => {
    // 'file' is the name of our file input field in the HTML form
    let upload = multer({ storage: storage }).single('file');
    // console.log(req);
    upload(req, res, function (err) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any

        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send('Please select an file to upload');
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }
        const currentdate = new Date();
        var datetime = currentdate.getDate() + "/"
            + (currentdate.getMonth() + 1) + "/"
            + currentdate.getFullYear() + " @ "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();

        db.execute('INSERT INTO resources(user_id, title, link, content, date, description) values(?, ?, ?, ?, ?, ?)',
            [req.user.id, req.body.title, req.body.url, req.file.originalname, datetime, req.body.description])
            .then((result) => {
                if (res) {
                    console.log('You have successfully add the resources');
                    res.redirect("/osr/activities");
                }
            })
            .catch(err => console.log(err));
    });
});

function authenticateToken(req, res, next) {
    const token = req.cookies.jwt;
    if (token) {
        const token = req.cookies.jwt;
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            // const id = payload.id;
            const user = {
                id: payload.id,
                email: payload.email
            }
            req.user = user;
            next();
        });
    }
    else {
        res.redirect('/osr');
    }
}

module.exports = router;