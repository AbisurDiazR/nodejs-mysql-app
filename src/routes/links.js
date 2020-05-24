const express = require('express');
const router = express.Router();

const pool = require('../database');//importamos el archivo database.js
//importamos el metodo isLoggedIn desde el archivi auth
const { isLoggedIn } = require('../lib/auth');

//creamos una ruta para una peticion get
router.get('/add',isLoggedIn,(req, res) => {
    res.render('links/add');
});

router.post('/add',isLoggedIn,async (req, res) => {
    const { title, url, description } = req.body;
    //Creamos un objeto de nuevo link
    const newLink = {
        title,
        url,
        description,
        user_id: req.user.id //guardamos el id del usuario logeado
    };
    //Hacemos una insersion en la base de datos usando una funcion asyncrona
    await pool.query('INSERT INTO links set ?',[newLink]);

    //llamamos flahs para poder enviar mensajes
    req.flash('success','Imagen guardada');

    //redireccionamos a la ruta principal cada vez que agregemos un enlace
    res.redirect('/links');
});

router.get('/',isLoggedIn,async (req, res) => {
    const links = await pool.query('SELECT * FROM links WHERE user_id = ?',[req.user.id]);//esta consulta la pasaremos al render de abajo
    res.render('links/list', {links});//renderisamos el archivo list en la carpeta links
});

router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params; //obtenemos el id de los parametros del request
    await pool.query('DELETE FROM links WHERE id = ?',[id]); //pasamos el id al query
    req.flash('success','Imagen borrada');
    res.redirect('/links');
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM links WHERE id=?',[id]);//hacemos una consulta query con el id obenido de req.params
    console.log(links[0]);
    //el objeto links lo enviaremos al render de la siguiente linea
    res.render('links/edit', {link: links[0]});//renderisamos la vista edit en la carpeta links
});

//ruta post para actualizar el link
router.post('/edit/:id',isLoggedIn,async (req, res) => {
    const { id } = req.params;
    const { title, description, url } = req.body; //datos nuevos del formulario
    const newLink = { //guardamos los datos nuevos en un objeto
        title,
        description,
        url
    };

    pool.query('UPDATE links SET ? WHERE id = ?',[newLink, id]);
    req.flash('success','Imagen actualizada');
    res.redirect('/links');
});

module.exports = router;