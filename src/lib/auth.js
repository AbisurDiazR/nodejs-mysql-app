//este modulo valida si el usuario esta logeado
module.exports = {    
    isLoggedIn(req, res, next){
        if (req.isAuthenticated()) {//metodo que devuelve true si la session existe
            return next();
        }
        return res.redirect('/signin');
    }
};