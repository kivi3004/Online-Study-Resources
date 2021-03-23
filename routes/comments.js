const express = require('express');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const db = require('../util/database');
const router = express.Router();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

router.post('/osr/comment', authenticateToken, (req, res) =>{
    console.log(req.body.res_id);
    var id = req.body.res_id
    db.query('SELECT u.username, u.user_id, c.res_id, c.comment, c.comment_id  FROM comments as c NATURAL JOIN user as u WHERE c.res_id=?', [id])
    .then(res1 =>{
        //console.log(res1);
        console.log(res1[0]);
        res.send({message:"true", data:res1[0]})
    })
    .catch(err => console.log("err"))

})
router.post('/osr/commentReply', authenticateToken, (req, res) =>{
    console.log(req.body.c_id);
    var id = req.body.c_id
    db.query('SELECT u.username, c.comment from comment_reply as c Natural Join user as u where c.comment_id = ?',[id])
    .then(res1 =>{
        //console.log(res1);
        console.log(res1[0]);
        res.send({message:"true", reply:res1[0]})
    })
    .catch(err => console.log("err"))

})
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