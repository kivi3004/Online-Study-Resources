const express = require('express');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const db = require('../util/database');
const router = express.Router();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

router.post('/osr/ratingMinusOneUnlike', authenticateToken, (req, res) => {
    const rating_id = req.body.rating_id;
    console.log(rating_id);
    db.execute('SELECT * FROM ratings WHERE rating_id = ?', [rating_id])
        .then(res1 => {
            const result = res1[0];
            db.execute('UPDATE ratings SET rate = ? WHERE rating_id = ?', [0, rating_id])
                .then(res2 => {
                    console.log(result[0].res_id);
                    // console.log(result);
                    db.execute('UPDATE resources SET unlikes = unlikes - 1 WHERE res_id = ? AND user_id = ?', [result[0].res_id, result[0].user_id])
                        .then(res3 => {
                            console.log(res3);
                            res.send({ message: true });
                        })
                })
        })
        .catch(err => console.log(err));
});

router.post('/osr/ratingMinusOneLike', authenticateToken, (req, res) => {
    const rating_id = req.body.rating_id;
    console.log(rating_id);
    db.execute('SELECT * FROM ratings WHERE rating_id = ?', [rating_id])
        .then(res1 => {
            const result = res1[0];
            db.execute('UPDATE ratings SET rate = ? WHERE rating_id = ?', [1, rating_id])
                .then(res2 => {
                    console.log(result[0].res_id);
                    // console.log(result);
                    db.execute('UPDATE resources SET likes = likes + 1, unlikes = unlikes - 1 WHERE res_id = ? AND user_id = ?', [result[0].res_id, result[0].user_id])
                        .then(res3 => {
                            console.log(res3);
                            res.send({ message: true });
                        })
                })
        })
        .catch(err => console.log(err));
});

router.post('/osr/ratingOneUnlike', authenticateToken, (req, res) => {
    const rating_id = req.body.rating_id;
    console.log(rating_id);
    db.execute('SELECT * FROM ratings WHERE rating_id = ?', [rating_id])
        .then(res1 => {
            const result = res1[0];
            db.execute('UPDATE ratings SET rate = ? WHERE rating_id = ?', [-1, rating_id])
                .then(res2 => {
                    console.log(result[0].res_id);
                    // console.log(result);
                    db.execute('UPDATE resources SET likes = likes - 1, unlikes = unlikes + 1 WHERE res_id = ? AND user_id = ?', [result[0].res_id, result[0].user_id])
                        .then(res3 => {
                            console.log(res3);
                            res.send({ message: true });
                        })
                })
        })
        .catch(err => console.log(err));
});

router.post('/osr/ratingOneLike', authenticateToken, (req, res) => {
    const rating_id = req.body.rating_id;
    console.log(rating_id);
    db.execute('SELECT * FROM ratings WHERE rating_id = ?', [rating_id])
        .then(res1 => {
            const result = res1[0];
            db.execute('UPDATE ratings SET rate = ? WHERE rating_id = ?', [0, rating_id])
                .then(res2 => {
                    console.log(result[0].res_id);
                    // console.log(result);
                    db.execute('UPDATE resources SET likes = likes - 1 WHERE res_id = ? AND user_id = ?', [result[0].res_id, result[0].user_id])
                        .then(res3 => {
                            console.log(res3);
                            res.send({ message: true });
                        })
                })
        })
        .catch(err => console.log(err));
});

router.post('/osr/ratingZeroLike', authenticateToken, (req, res) => {
    const rating_id = req.body.rating_id;
    console.log(rating_id);
    db.execute('SELECT * FROM ratings WHERE rating_id = ?', [rating_id])
        .then(res1 => {
            const result = res1[0];
            db.execute('UPDATE ratings SET rate = ? WHERE rating_id = ?', [1, rating_id])
                .then(res2 => {
                    console.log(result[0].res_id);
                    // console.log(result);
                    db.execute('UPDATE resources SET likes = likes + 1 WHERE res_id = ? AND user_id = ?', [result[0].res_id, result[0].user_id])
                        .then(res3 => {
                            console.log(res3);
                            res.send({ message: true });
                        })
                })
        })
        .catch(err => console.log(err));
});

router.post('/osr/ratingZeroUnlike', authenticateToken, (req, res) => {
    const rating_id = req.body.rating_id;
    db.execute('SELECT * FROM ratings WHERE rating_id = ?', [rating_id])
        .then(res1 => {
            const result = res1[0];
            db.execute('UPDATE ratings SET rate = ? WHERE rating_id = ?', [-1, rating_id])
                .then(res2 => {
                    db.execute('UPDATE resources SET unlikes = unlikes + 1 WHERE res_id = ? AND user_id = ?', [result[0].res_id, result[0].user_id])
                        .then(res3 => {
                            res.send({ message: true });
                        })
                })
        })
        .catch(err => console.log(err));
});


router.post("/osr/FirstLike", authenticateToken, (req, res) => {
    const res_id = req.body.res_id;
    const id = req.user.id;
    console.log(res_id, id);
    db.execute("Insert INTO RATINGS(user_id, res_id, rate) values (?,?,?)", [id, res_id, 1])
        .then(res1 => {
            db.execute('UPDATE resources SET likes = likes + 1 WHERE res_id = ? AND user_id = ?', [res_id, id])
                .then(res3 => {
                    res.send({ message: true });
                })

        })
        .catch(err => console.log(err));
})
router.post("/osr/FirstUnlike", authenticateToken, (req, res) => {
    const res_id = req.body.res_id;
    const id = req.user.id;
    db.execute("Insert INTO RATINGS(user_id, res_id, rate) values (?,?,?)", [id, res_id, -1])
        .then(res1 => {
            console.log("done")
            db.execute('UPDATE resources SET unlikes = unlikes + 1 WHERE res_id = ? AND user_id = ?', [res_id, id])
                .then(res3 => {
                    res.send({ message: true });
                })

        })
        .catch(err => console.log(err));
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