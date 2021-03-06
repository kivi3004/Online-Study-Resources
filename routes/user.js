const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../util/database');
const router = express.Router();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

router.get('/osr/login', (req, res) => {
    res.render('login', { message: "Login page" });
});
 
router.post('/osr/loginPost', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const maxAge = 600000 * 60 * 24;
    db.execute('SELECT * FROM user WHERE email = ?', [email])
    .then(result => { 
        const rs = result[0];
        if (rs.length == 0) res.render('login', { message: "Email or Password doesn't match" });
        else {
            bcrypt.compare(password, rs[0].password, (err, copmaredResult) => {
                if (copmaredResult === true) {
                    const id = rs[0].user_id;  
                    const token = jwt.sign({ email, id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: maxAge });
                    res.cookie('jwt', token, {maxAge: maxAge, httpOnly: true });
                    res.redirect('/osr/userview');
                }
                else res.render('login', { message: "Email or Password doesn't match" });
            });
        }
    })
    .catch(err => console.log("Fetching details from users failed"));
});

router.get('/osr/signup', (req, res) => {
    res.render('sign-up', { message: "Sign Up page" });
});

router.post('/osr/signupPost', (req, res) => {
    const saltRounds = 10;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    console.log(req.body);
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) res.redirect('/osr/signup');
        db.execute('SELECT user_id, email, password FROM user WHERE email = ?', [email])
            .then(result => {
                const rs = result[0]; 
                console.log(`Result is ${rs}`);
                if (rs.length > 0) res.render('sign-up', { message: "User already Registered" })
                else {
                    console.log(username, email, hash);
                    db.execute('INSERT INTO user(username, email, password) values (?, ?, ?)',
                    [username, email, hash])
                        .then(() => {
                            console.log('Insert Successful');
                            res.redirect('/osr');
                        })
                        .catch(err => {
                            console.log('Insertion into database failed!!');
                        });
                }
            })
            .catch(err => console.log(err));
    })
});

router.get('/osr/logout', authenticateToken, (req, res) => {
    res.clearCookie('jwt');
    res.redirect('/osr');
});

function authenticateToken(req, res, next) {
    const token = req.cookies.jwt;
    if (token) {
        const token = req.cookies.jwt;
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            const user = {
                id: payload.id,
                email: payload.email
            }
            req.body = user;
            next();
        });
    }
    else {
        res.redirect('/osr');
    }
}

module.exports = router;
