const express = require('express');
const router = express.Router();

//ruta get para el signup
router.get('/signup',(req, res) => {
    res.render('auth/signup');
});

//ruta post para el signup
router.post('/signup',(req,res) => {
    console.log(req.body);
    res.send('received');
});

module.exports = router;