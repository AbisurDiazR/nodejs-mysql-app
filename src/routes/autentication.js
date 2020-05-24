const express = require('express');
const router = express.Router();

//importamos la constante passport desde nuestro lib
const passport = require('passport');

//ruta get para el signup
router.get('/signup',(req, res) => {
    res.render('auth/signup');
});

//ruta post para el signup
router.post('/signup', passport.authenticate('local.signup',{
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}));

//ruta get para el signin
router.get('/signin',(req,res) => {
    res.render('auth/signin');
});

//ruta post para el signin
router.post('/signin',(req,res, next) => {
    passport.authenticate('local.signin',{
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next);
});

router.get('/profile', (req, res) => {
    res.send('This profile');
});

module.exports = router;