//los metodos de autenticacion van aqui
const passport = require('passport');//importamos el modulo passport
const LocalStrategy = require('passport-local').Strategy;//importamos el modulo passport-local

//importamos la base de datos
const pool = require('../database');

passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true //función que se ejecuta despues de LocalStrategy
}, async (req, username, password, done) => {
    //obtenemos el fullname desde el request body
    const { fullname } = req.body.fullname;
    //registramos a los usuarios
    const newUser = {
        username,
        password,
        fullname
    };

    //insertamos nuestro usuario en la tabla users
    await pool.query('INSERT INTO users SET ?', [newUser]);
}));

/*
passport.serializeUser((usr,done) => {

});
*/