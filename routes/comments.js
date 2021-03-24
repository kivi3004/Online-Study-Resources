const express = require('express');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const db = require('../util/database');
const router = express.Router();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

router.post('/osr/postReply', authenticateToken, (req, res) => {
    const commentId = req.body.comment_id;
    const commentReply = req.body.commentReply;
    const id = req.user.id;
    db.execute('INSERT INTO comment_reply(comment_id, user_id, comment) values(?, ?, ?)', [commentId, id, commentReply])
        .then(res1 => {
            res.redirect('/osr/activities');
        })
        .catch(err => console.log(err));
})

router.post('/osr/addComment', authenticateToken, (req, res) => {
    const res_id = req.body.res_id;
    const id = req.user.id;
    const comment = req.body.comment;
    console.log(res_id, id, comment);
    db.execute('INSERT INTO COMMENTS(res_id, user_id, comment) VALUES(?, ?, ?)', [res_id, id, comment])
        .then(result => {
            res.redirect('/osr/activities');
        })
        .catch(err => console.log(err));
})

router.post('/osr/comment', authenticateToken, (req, res) =>{
    console.log(req.body.res_id);
    var res_id = req.body.res_id
    db.execute('SELECT u.username, u.user_id, c.res_id, c.comment, c.comment_id  FROM comments as c INNER JOIN user as u ON c.user_id = u.user_id where res_id = ?', [res_id])
    .then(res1 =>{
        res.send({message:"true", data:res1[0]})
    })
    .catch(err => console.log("err"))

})
router.post('/osr/commentReply', authenticateToken, (req, res) =>{
    const comment_id = req.body.comment_id
    console.log(comment_id);
    db.query('SELECT u.username, c.comment from comment_reply as c INNER JOIN user as u ON c.user_id = u.user_id where comment_id = ?',[comment_id])
    .then(res1 =>{
        //console.log(res1);
        console.log(res1[0]);
        res.send({message:"true", data:res1[0]})
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