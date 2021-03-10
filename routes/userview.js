const express = require('express');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const db = require('../util/database');
const router = express.Router();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

router.get('/osr/userview', authenticateToken, (req, res) => {
    res.render('userview', { message: "Userview Page" });
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function (req, file, cb) {
        file.originalname = Math.random().toString(36).toUpperCase().substring(7) + file.originalname;
        cb(null, file.originalname);
        // console.log(file.originalname + '-' + path.extname(file.originalname));
        // console.log(file.originalname);
        // req.body = {
        //     file_name: file.originalname
        // }
    }
});

router.post('/osr/resources', authenticateToken , (req, res) => {
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
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();

        db.execute('INSERT INTO resources(user_id, link, content, date, description) values(?, ?, ?, ?, ?)',
        [7, req.body.url, req.file.originalname, datetime, req.body.description])
        .then((result) => {
            if (res) {
                res.send('You have successfully add the resources');
            }
        })
        .catch(err => console.log(err));
        // res.send(`You have uploaded this image: <hr/><img src="../uploads/${req.file.originalname}" width="500"><hr /><a href="./">Upload another image</a>`);
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