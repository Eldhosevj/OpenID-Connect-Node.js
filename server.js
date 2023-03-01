const base64url = require('base64url');

const express = require('express');
const expressSession = require('express-session');

const path=require("path")
const indexController = require('./index');
const userController = require('./user');

const { getConfiguredPassport, passportController } = require('./passport');


const app = express();

const session = {
    secret: "someSecret",
    cookie: {},
    resave: false,
    saveUninitialized: false
  };

app.use(expressSession(session));
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use('/', indexController);

(async () => {
    const passport = await getConfiguredPassport();
    app.use(passport.initialize());
    app.use(passport.session());
    app.use('/', passportController);

    app.use('/user', userController);

    app.listen(3000, () => {
        console.log('Server started and listening on port 3000');
    });
})();