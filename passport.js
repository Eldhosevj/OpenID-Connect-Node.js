const express = require('express');
const router = express.Router();
const passport = require('passport');
var OpenIDConnectStrategy = require('passport-openidconnect');

const { Strategy, discoverAndCreateClient } = require('passport-curity');

// Part 2, configure authentication endpoints
router.get('/login', passport.authenticate('openidconnect'));
router.get('/callback', passport.authenticate('openidconnect', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/user');
});

// Part 3, configuration of Passport
const getConfiguredPassport = async () => {
    passport.use(new OpenIDConnectStrategy({
        issuer: 'https://sts-lle.atsol.com',
        authorizationURL: 'https://sts-lle.atsol.com',
        tokenURL: 'https://sts-lle.atsol.com',
        userInfoURL: '',
        clientID:"fstnr.tps",
        clientSecret: "secret",
        callbackURL: 'http"//localhost:3000/callback'
      },()=>{

      }
     
    ));

    return passport;
};


// Part 4, export objects
exports = module.exports;
exports.getConfiguredPassport = getConfiguredPassport;
exports.passportController = router;
