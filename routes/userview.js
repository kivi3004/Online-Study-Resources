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

router.post('/osr/fetchdetails', authenticateToken, (req, res) => {
    const res_id = req.body.res_id;
    db.execute("SELECT * FROM RESOURCES WHERE res_id = ?", [res_id])
        .then(rs => {
            var result = rs[0];
            console.log(result);
            res.send({ data: result });
        })
        .catch(err => console.log(err))
});

router.post('/osr/update', authenticateToken, (req, res) => {
    const res_id = req.body.res_id;
    const description = req.body.description;
    const currentdate = new Date();
    var datetime = currentdate.getDate() + "/"
        + (currentdate.getMonth() + 1) + "/"
        + currentdate.getFullYear() + " @ "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();
    db.execute("UPDATE resources SET description = ?, date = ?  WHERE res_id = ?", [description, datetime, res_id])
        .then(rs => {
            console.log(rs);
            res.redirect('/osr/activities');
        })
        .catch(err => console.log(err))
});

router.post('/osr/delete', authenticateToken, (req, res) => {
    const res_id = req.body.res_id;
    db.execute("DELETE FROM ratings WHERE res_id = ?", [res_id])
        .then(rs => {
            db.execute("DELETE FROM resources WHERE res_id = ?", [res_id])
                .then(res1 => {
                    res.redirect('/osr/activities');
                })
        })
        .catch(err => console.log(err))
});

router.get('/osr/userview', authenticateToken, (req, res) => {
    res.render("index", { message: "Home Page", flag: true })
})
router.get('/osr/addResources', authenticateToken, (req, res) => {
    res.render("addResources", { message: "Add Resources", flag: true });
})
router.post('/osr/dashboard', authenticateToken, (req, res) => {
    const id = req.user.id;
    db.execute("SELECT r.res_id, r.user_id, r.title, r.link, r.content, r.date, r.description, r.likes, r.unlikes, IFNULL(rating.rate, -2) as rate, IFNULL(rating.rating_id, 0) as rating_id  from resources as r LEFT JOIN ratings as rating on r.res_id=rating.res_id where approval=?", ['approve'])
        .then((rs) => {
            let result = rs[0];
            res.render("home", { data: result, id, message: "User Account", flag: true, filter: "Recently Added" })
        })

        .catch(err => console.log(err))
})
router.post('/osr/search', authenticateToken, (req, res) => {
    const id = req.user.id;
    var action = req.body.action;
    console.log(req.body.action)
    if (req.body.Search) {

        const search = req.body.Search;
        //console.log(search)
        db.execute("SELECT r.res_id, r.user_id, r.title, r.link, r.content, r.date, r.description, r.likes, r.unlikes, r.Comments, IFNULL(rating.rate, -2) as rate, IFNULL(rating.rating_id, 0) as rating_id  from resources as r LEFT JOIN ratings as rating on r.res_id=rating.res_id where approval=? and (description LIKE ? or title LIKE ?) ORDER BY date DESC", ['approve', '%' + search + '%', '%' + search + '%'])
            .then((rs) => {
                let result = rs[0];
                // console.log(result)
                res.render("home", { data: result, id, message: "User Account", flag: true, filter: action, search })
            })

            .catch(err => console.log(err))
    }
    else {
        const search = action.substr(action.lastIndexOf('_') + 1, action.length)
        action = action.substr(0, action.lastIndexOf('_'))
        if (action === "Recently Added") {
            //console.log(search)
            db.execute("SELECT r.res_id, r.user_id, r.title, r.link, r.content, r.date, r.description, r.likes, r.unlikes, r.Comments, IFNULL(rating.rate, -2) as rate, IFNULL(rating.rating_id, 0) as rating_id  from resources as r LEFT JOIN ratings as rating on r.res_id=rating.res_id where approval=? and (description LIKE ? or title LIKE ?) ORDER BY date DESC", ['approve', '%' + search + '%', '%' + search + '%'])
                .then((rs) => {
                    let result = rs[0];
                    console.log(result)
                    res.render("home", { data: result, id, message: "User Account", flag: true, filter: action, search })
                })

                .catch(err => console.log(err))
        }
        else if (action == "Most Voted") {
            db.execute("SELECT r.res_id, r.user_id, r.title, r.link, r.content, r.date, r.description, r.likes, r.unlikes, r.Comments, IFNULL(rating.rate, -2) as rate, IFNULL(rating.rating_id, 0) as rating_id  from resources as r LEFT JOIN ratings as rating on r.res_id=rating.res_id where approval=? and (description LIKE ? or title LIKE ?) ORDER BY likes DESC", ['approve', '%' + search + '%', '%' + search + '%'])
                .then((rs) => {
                    let result = rs[0];
                    // console.log(result)
                    res.render("home", { data: result, id, message: "User Account", flag: true, filter: action, search })
                })

                .catch(err => console.log(err))
        }
        else{
            db.execute("SELECT r.res_id, r.user_id, r.title, r.link, r.content, r.date, r.description, r.likes, r.unlikes, r.Comments, IFNULL(rating.rate, -2) as rate, IFNULL(rating.rating_id, 0) as rating_id  from resources as r LEFT JOIN ratings as rating on r.res_id=rating.res_id where approval=? and (description LIKE ? or title LIKE ?) ORDER BY comments DESC", ['approve', '%' + search + '%', '%' + search + '%'])
                .then((rs) => {
                    let result = rs[0];
                    // console.log(action)
                    res.render("home", { data: result, id, message: "User Account", flag: true, filter: action, search })
                })

                .catch(err => console.log(err))

        }
    }
})


router.get('/osr/activities', authenticateToken, (req, res) => {
    const id = req.user.id;
    db.execute("SELECT r.res_id, r.user_id, r.title, r.link, r.content, r.date, r.description, r.likes, r.unlikes, r.Comments , IFNULL(rating.rate, -2) as rate, IFNULL(rating.rating_id, 0) as rating_id  from resources as r LEFT JOIN ratings as rating on r.res_id=rating.res_id where r.user_id=? and approval=?", [id, 'approve'])
        .then((rs) => {
            let result = rs[0];
            res.render("dashboard", { data: result, id, message: "User Account", flag: true })
        })

        .catch(err => console.log(err))

})
router.get('/osr/request', authenticateToken, (req, res) => {
    var id = req.user.id
    db.execute('select * from resources where approval = ? and user_id = ?', ['pending', id])
        .then(res1 => {
            console.log(res1[0])
            res.render("pendingRequest", { flag: true, data: res1[0], filter: "pending" })
        })
        .catch(err => {
            console.log("err");
        })
})

router.post('/osr/request', authenticateToken, (req, res) => {
    var id = req.user.id
    db.execute('select * from resources where approval = ? and user_id = ?', [req.body.action, id])
        .then(res1 => {
            console.log(res1[0])
            res.render("pendingRequest", { flag: true, data: res1[0], filter: req.body.action })
        })
        .catch(err => {
            console.log("err");
        })
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
        const currentdate = new Date();
        var datetime = currentdate.getDate() + "/"
            + (currentdate.getMonth() + 1) + "/"
            + currentdate.getFullYear() + " @ "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();

        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            db.execute('INSERT INTO resources(user_id, title, link, content, date, description) values(?, ?, ?, ?, ?, ?)',
                [req.user.id, req.body.title, req.body.url, "NO FILE CHOOSEN", datetime, req.body.description])
                .then((resources) => {
                    if (resources) {
                        const result = resources[0];
                        console.log(result.insertId);
                        res.redirect("/osr/activities");
                        const res_id = result.insertId;
                        // db.execute('INSERT INTO ratings(res_id, user_id, rate) values(?, ?, ?)', [res_id, req.user.id, 0])
                        //     .then(res1 => {
                        //         res.redirect("/osr/activities");
                        //     })
                        //     .catch(err => console.log(err));
                    }
                })
                .catch(err => console.log(err));
            console.log("NO file")
            // res.send('Please select an file to upload');
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }
        else {
            db.execute('INSERT INTO resources(user_id, title, link, content, date, description) values(?, ?, ?, ?, ?, ?)',
                [req.user.id, req.body.title, req.body.url, req.file.originalname, datetime, req.body.description])
                .then((resources) => {
                    if (resources) {
                        const result = resources[0];
                        console.log(result.insertId);
                        res.redirect("/osr/activities");
                        const res_id = result.insertId;
                        // db.execute('INSERT INTO ratings(res_id, user_id, rate) values(?, ?, ?)', [res_id, req.user.id, 0])
                        //     .then(res1 => {
                        //         res.redirect("/osr/activities");
                        //     })
                        //     .catch(err => console.log(err));
                    }
                })
                .catch(err => console.log(err));
        }

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