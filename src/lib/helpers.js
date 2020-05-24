const bcrypt = require('bcryptjs');//importamos el modulo bcrypt

const helpers = {};

//Este metodo se usa para realizar el registro
helpers.encryptpassword = async (password) => {
   const salt = await bcrypt.genSalt(10);//ejecutamos bcrypt
   const hash = await bcrypt.hash(password,salt);//guardamos la contraseña cifrada en la constante hash
   return hash;
};

//Este metodo se usa para realizar el logeo
helpers.matchPassword = async (password, savedPassword) => {
    try {
        //retornamos el resultado de esta consulta
        return await bcrypt.compare(password, savedPassword);
    } catch (error) {
        console.log(error);
    }
};

module.exports = helpers;