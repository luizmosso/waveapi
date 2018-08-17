var express = require('express');
var router = express.Router();
var crypt = require('../crypt');

var Familia = require('../models/familia');
var Usuario = require('../models/usuario');


Familia.methods(['post', 'put', 'delete']);


Familia.route('get', (req, res, next) =>{

    let params = {};
    if (req.params.id)
        params = { _id: req.params.id };

    Familia.find(params)
        .sort({id: 1})
        .exec()
        .then(familias => {
            if (familias === null || familias.length === 0) {
                throw { customError: true, status: 204, message: "Familias não encontradas" };
            }

            res.send(familias);
        })
        .catch(err => {
            if (!err.customError)
                res.status(500).json({ error: "Erro interno" });
            else {
                res.statusMessage = err.message
                res.status(204).end();
            }
        });        
});

Usuario.methods(['get', 'post', 'put', 'delete']);

Usuario.route('login.post', (req, res) => {

    const email = req.body.email;
    const hashPwd = crypt.crypt(req.body.pwd);

    Usuario.findOne({ email: email, pwd: hashPwd })
        .exec()
        .then(usuario => {
            if (usuario === null || usuario.length === 0) {
                throw { customError: true, status: 204, message: "Usuário não encontrado" };
            }

            let newUser = usuario.toObject();
            newUser.token = crypt.createToken(newUser._id);
            res.send(newUser);
        })
        .catch(err => {
            if (!err.customError)
                res.status(500).json({ error: "Erro interno" });
            else {
                res.statusMessage = err.message
                res.status(204).end();
            }
        });
})

Familia.register(router, '/familia');
Usuario.register(router, '/usuario');


module.exports = router;
