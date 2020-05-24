//los metodos de autenticacion van aqui
const passport = require('passport');//importamos el modulo passport
const LocalStrategy = require('passport-local').Strategy;//importamos el modulo passport-local

//importamos la base de datos
const pool = require('../database');
//importamos el helper para encriptar la contraseña
const helpers = require('../lib/helpers');

//metodo de autenticacion
passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    //hacemos la consulta del usuario a la base de datos
    const rows = await pool.query('SELECT * FROM users WHERE username=?',[username]);
    if (rows.length > 0) {
        const user = rows[0];
        //validamos si la contraseña es la correcta
        const validPassword = await helpers.matchPassword(password, user.password);
        //si la contraseña es correcta
        if(validPassword){
            done(null,user,req.flash('success','Bienvenido '+username));
        }else{
            done(null, false, req.flash('message','Contraseña incorrecta'));
        }
    } else{//sino encontro ningun usuario
        return done(null, false, req.flash('message','El usuario no existe'));
    }
}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true //función que se ejecuta despues de LocalStrategy
}, async (req, username, password, done) => {
    //obtenemos el fullname desde el request body
    const { fullname } = req.body;
    //registramos a los usuarios
    const newUser = {
        username,
        password,
        fullname
    };

    //usamos el metodo encryptpassword de nuestro helper
    newUser.password = await helpers.encryptpassword(password);

    //insertamos nuestro usuario en la tabla users
    const result = await pool.query('INSERT INTO users SET ?', [newUser]);
    //agregamos el id de nuestro nuevo user
    newUser.id = result.insertId;
    //retornamos el newUser para almacenar una session
    return done(null, newUser);
}));

//recibe el newUser para guardarlo en la session
passport.serializeUser((user,done) => {
    done(null, user.id);
});

//tomamos el id del usuario para obtener los datos de la base de datos
passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE id = ?',[id]);
    done(null, rows[0]);
});
