const express = require('express');
const router = express.Router();
const passport = require('passport');
const { Strategy, discoverAndCreateClient } = require('passport-curity');

// Part 2, configure authentication endpoints
router.get('/login', passport.authenticate('curity'));
router.get('/callback', passport.authenticate('curity', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/user');
});

// Part 3, configuration of Passport
const getConfiguredPassport = async () => {

    // Part 3a, discover Curity Server metadata and configure the OIDC client
    const client = await discoverAndCreateClient({
        issuerUrl: 'https://sts-lle.atsol.com',
        clientID: "fstnr.tps",
        clientSecret: "secret",
        redirectUris: ["http://localhost:3000/callback"],
        responseTypes: ["token"]
    });

    // Part 3b, configure the passport strategy
    const strategy = new Strategy({
        client,
        params: {
            scope: "openid profile email api offline_access"
        }
    }, function(accessToken, refreshToken, profile, cb) {
        return cb(null, { profile });
    });

    // Part 3c, tell passport to use the strategy
    passport.use(strategy);

    // Part 3d, tell passport how to serialize and deserialize user data
    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });

    return passport;
};

// Part 4, export objects
exports = module.exports;
exports.getConfiguredPassport = getConfiguredPassport;
exports.passportController = router;
