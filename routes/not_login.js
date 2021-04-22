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

router.post('/osr/not_login/search',  (req, res) => {
    var action = req.body.action;
    var search = "";
    if (req.body.Search) {
        search = req.body.Search;
    }
    else {
        search = action.substr(action.lastIndexOf('_') + 1, action.length)
        action = action.substr(0, action.lastIndexOf('_'))
    }
    console.log(search)
    //res.send()
    let flag = false;
    for (let i = 0; i < search.length; i++) {
        if (search[i] == '+' || search[i] == '-' || search[i] == '*' || search[i] == '<' || search[i] == '>' || search[i] == '(' || search[i] == ')' || search[i] == '~' || search[i] == '*') {
            flag = false;
        }
    }
    if (flag) {
        if (action === "Recently Added") {
            db.execute("SELECT r.res_id, r.user_id, r.title, r.link, r.content, r.date, r.description, r.likes, r.unlikes, r.Comments, IFNULL(rating.rate, -2) as rate, IFNULL(rating.rating_id, 0) as rating_id  from resources as r LEFT JOIN ratings as rating on r.res_id=rating.res_id where approval=? and (description LIKE ? or title LIKE ?) ORDER BY date DESC", ['approve', '%' + search + '%', '%' + search + '%'])
                .then((rs) => {
                    let result = rs[0];
                    res.render("not_login_Search", { data: result, message: "User Account", flag: false, filter: action, search })
                }) 

                .catch(err => console.log(err))
        }
        else if (action == "Most Voted") {
            db.execute("SELECT r.res_id, r.user_id, r.title, r.link, r.content, r.date, r.description, r.likes, r.unlikes, r.Comments, IFNULL(rating.rate, -2) as rate, IFNULL(rating.rating_id, 0) as rating_id  from resources as r LEFT JOIN ratings as rating on r.res_id=rating.res_id where approval=? and (description LIKE ? or title LIKE ?) ORDER BY likes DESC", ['approve', '%' + search + '%', '%' + search + '%'])
                .then((rs) => {
                    let result = rs[0];
                    // console.log(result)
                    res.render("not_login_Search", { data: result, message: "User Account", flag: false, filter: action, search })
                })

                .catch(err => console.log(err))
        }
        else {
            db.execute("SELECT r.res_id, r.user_id, r.title, r.link, r.content, r.date, r.description, r.likes, r.unlikes, r.Comments, IFNULL(rating.rate, -2) as rate, IFNULL(rating.rating_id, 0) as rating_id  from resources as r LEFT JOIN ratings as rating on r.res_id=rating.res_id where approval=? and (description LIKE ? or title LIKE ?) ORDER BY comments DESC", ['approve', '%' + search + '%', '%' + search + '%'])
                .then((rs) => {
                    let result = rs[0];
                    // console.log(action)
                    res.render("not_login_Search", { data: result, message: "User Account", flag: false, filter: action, search })
                })

                .catch(err => console.log(err))

        }
    }
    else {
        if (action === "Recently Added") {
            //console.log(search)
            db.execute("SELECT r.res_id, r.user_id, r.title, r.link, r.content, r.date, r.description, r.likes, r.unlikes, r.Comments, IFNULL(rating.rate, -2) as rate, IFNULL(rating.rating_id, 0) as rating_id  from resources as r LEFT JOIN ratings as rating on r.res_id=rating.res_id where approval=? and MATCH(r.title, r.description) AGAINST(?) ORDER BY date DESC", ['approve', search])
                .then((rs) => {
                    let result = rs[0];
                    //console.log(result)
                    res.render("not_login_Search", { data: result, message: "User Account", flag: false, filter: action, search })
                })

                .catch(err => console.log(err))
        }
        else if (action == "Most Voted") {
            db.execute("SELECT r.res_id, r.user_id, r.title, r.link, r.content, r.date, r.description, r.likes, r.unlikes, r.Comments, IFNULL(rating.rate, -2) as rate, IFNULL(rating.rating_id, 0) as rating_id  from resources as r LEFT JOIN ratings as rating on r.res_id=rating.res_id where approval=? and MATCH(r.title, r.description) AGAINST(?) ORDER BY date DESC", ['approve', search])
                .then((rs) => {
                    let result = rs[0];
                    // console.log(result)
                    res.render("not_login_Search", { data: result, message: "User Account", flag: false, filter: action, search })
                })

                .catch(err => console.log(err))
        }
        else {
            db.execute("SELECT r.res_id, r.user_id, r.title, r.link, r.content, r.date, r.description, r.likes, r.unlikes, r.Comments, IFNULL(rating.rate, -2) as rate, IFNULL(rating.rating_id, 0) as rating_id  from resources as r LEFT JOIN ratings as rating on r.res_id=rating.res_id where approval=? and MATCH(r.title, r.description) AGAINST(?) ORDER BY date DESC", ['approve', search])
                .then((rs) => {
                    let result = rs[0];
                    // console.log(action)
                    res.render("not_login_Search", { data: result, message: "User Account", flag: false, filter: action, search })
                })
                .catch(err => console.log(err))
        }
    }
})

module.exports = router;