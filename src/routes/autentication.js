const express = require('express');
const router = express.Router();

//importamos la constante passport desde nuestro lib
const passport = require('passport');
//importamos el metodos isLoggedIn para validar la sesion
const { isLoggedIn } = require('../lib/auth');

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

//ruta get para el profile
router.get('/profile', isLoggedIn, (req, res) => {//isLoggedIn protege la ruta profile y cualquier ruta que necesitemos
    res.render('profiles');//renderizamos la vista profiles
});

//ruta get para cerrar sesión
router.get('/logout', (req, res) => {
    //borramos la sesion del usuario
    req.logOut();
    //redireccionamos al usuario a signin
    res.redirect('/signin');
});

module.exports = router;