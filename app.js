const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
// const jwt = require('jsonwebtoken');
// const indexRouter = require('./routes/indexPage');
const userRouter = require('./routes/user');
const userviewRouter = require('./routes/userview');
const ratingsRouter = require('./routes/ratings');
// const viewAllRouter = require('./routes/userView');
// const settingsRouter = require('./routes/settings');
// const tokenRouter = require('./routes/twofa');
const cookieParser = require('cookie-parser');
const db = require('./util/database');

const app = express();

app.use(bodyparser.urlencoded({extended:false}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// db.execute('SELECT * FROM user')
// .then(result => {
//     const rs = result[0];
//     console.log(rs);
// })
// .catch(err => console.log("Failed to laod from the database"))

app.set('view engine', 'ejs');
app.set('views', 'views'); 

app.get('/osr', (req, res) => {
    res.render('index', { message: "Index Page", flag: false });
});
app.use(userRouter);
app.use(userviewRouter);
app.use(ratingsRouter);

app.listen(3000);