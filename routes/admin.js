const express = require('express');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const db = require('../util/database');
const router = express.Router();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

router.get('/osr/admin', (req, res) => {
    res.render('admin_login');
})

router.post('/osr/login_post', (req, res) => {
    const email = req.body.email
    const pass = req.body.password
    const maxAge = 2000* 60 * 10;
    db.execute('select * from admin where email = ?', [email])
        .then(result => {
            console.log(result[0])
            if (result[0].length == 0) res.render('admin_login', { message: "Only admins can enter in this section" });
            else {
                var res1 = result[0];
                if (res1[0].password === pass) {
                    const id = res1[0].admin_id
                    console.log(id)
                    const token = jwt.sign({ email, id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: maxAge });
                    res.cookie('jwtAdmin', token, {maxAge: maxAge, httpOnly: true });
                    res.redirect('/osr/admin/request')
                }
                else
                    res.redirect('/osr/admin')
                //res.send()
            }
        })
        .catch(err => console.log("err"))
})

router.get('/osr/admin/request',authenticateToken, (req, res) => {

    db.execute('select * from resources where approval = ?', ['pending'])
        .then(res2 => {
            console.log(res2[0])
            res.render('Admin_approval', { data: res2[0] })
        })
        .catch(err => console.log("err"))



})

router.post('/osr/action', authenticateToken, (req, res) => {
    console.log("ok")
    console.log(req.admin);
    console.log(req.body)
    if (req.body.decline) {
        db.execute("UPDATE `resources` SET `Approval` = 'decline' WHERE `resources`.`res_id` = ?", [req.body.decline])
            .then(rs => console.log("ok"))
            .catch(err => console.log("err"))
    }
    else {
        db.execute("UPDATE `resources` SET `Approval` = 'approve' WHERE `resources`.`res_id` = ?", [req.body.accept])
            .then(rs => console.log("ok"))
            .catch(err => console.log("err"))
    }
    res.redirect("/osr/admin/request")

})

router.get('/osr/admin/logout', authenticateToken, (req, res) => {
    res.clearCookie('jwtAdmin');
    res.redirect('/osr/admin');
});

function authenticateToken(req, res, next) {
    const token = req.cookies.jwtAdmin;
    if (token) {
        const token = req.cookies.jwtAdmin;
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            const user = {
                id: payload.id,
                email: payload.email
            }
            req.admin = user;
            next();
        });
    }
    else {
        res.redirect('/osr/admin');
    }
}

module.exports = router;