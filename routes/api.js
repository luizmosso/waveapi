var express = require('express');
var router = express.Router();
var crypt = require('../crypt');

var Familia = require('../models/familia');
var Usuario = require('../models/usuario');


Familia.methods(['get', 'post', 'put', 'delete']);
Usuario.methods(['get', 'post', 'put', 'delete']);

Usuario.route('login.post', (req, res) => {

    const email = req.body.email;
    const hashPwd = crypt.crypt(req.body.pwd);

    Usuario.find({ email: email , pwd : hashPwd })
        .exec()
        .then(usuario => {
            delete usuario.pwd;
            console.log(usuario);
            res.send(usuario);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
})

Familia.register(router, '/familia');
Usuario.register(router, '/usuario');


module.exports = router;
