const mysql = require('mysql'); //en una constante obtenemos mysql
const { promisify } = require('util');//obtenemos el modulo para soportar promesas

const { database } = require('./keys');//obtenemos la propiedad database de nuestro archivo keys


const pool = mysql.createPool(database);//creamos una conexion con mysql

pool.getConnection((err, connection) => {
    //validamos los errores que pueda tener nuestra base de datos
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('DATABASE CONNECTION WAS CLOSED');
        }        
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('DATABASE HAS MANY CONNECTIONS');
        }
        if (err.code === 'ECONNREFUSED') {
            console.log('DATABASE CONNECTION WAS REFUSED');
        }
    }

    //validamos la conexion con la base de datos
    if (connection) connection.release();
    console.log('DB is Connected');
    return;
}); //llamamos al modulo de conexion

//promisify query
pool.query = promisify(pool.query);

module.exports = pool;//exporamos el modulo

