const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars'); //importamos el motor de plantillas
const path = require('path'); //importamos el modulo path
const flash = require('connect-flash');//importamos el modulo flash para las alertas
const session = require('express-session');//importamos el modulo session de express
const MySQLStore = require('express-mysql-session');//guardamos la session de mysql en mysqlstore

//importamos la conexion de nuestra base de datos
const { database } = require('./keys');

//importamos passport
const passport = require('passport');

//inicializaciones 
const app = express();
require('./lib/passport')

//configuraciones
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));//concatenamos nuestra carpeta views
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'), //obtenemos la carpeta layouts
    partialsDir: path.join(app.get('views'), 'partials'), //obtenemos la carpeta partials
    extname: '.hbs', //nombre de los archivos handlebars
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

//midlewares logica de intercambio
app.use(session({
    secret: 'faztmysqlnodesession',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));
app.use(flash()); //Utilizaos la funcion de enviar mensajes alertas
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());


//variables globales
app.use((req, res, next) => {
    next();
});
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.success = req.flash('message');
    next();
});//usamos el flash al que nombramos success

//Routes (rutas)
app.use(require('./routes'));
app.use(require('./routes/autentication'));
app.use('/links',require('./routes/links')); //A todas las rutas le debe preceder el prefijo link

//Public
app.use(express.static(path.join(__dirname, 'public')));//obtenemo el directorio public

//Iniciar el servidor
app.listen(app.get('port'), () =>{
    console.log('Server on port: ', app.get('port'));
});