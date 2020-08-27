var express = require('express');
var router = express.Router();

var Instituicao = require('../models/instituicao');
var Familia = require('../models/familia');
var Usuario = require('../models/usuario');
var crypt = require('../crypt');
const { getFamilias } = require('../controllers/familia');
const { restart } = require('nodemon');

Familia.methods(['post', 'put', 'delete']);
Familia.route('get', (req, res) => {
  const get = async () => {
    console.log(req, req.params);
    const id = req.params.id || null;
    const familias = await getFamilias(id);
    if (familias.error) {
      if (familias.status === 500)
        res.status(500).json({ error: familias.message });
      if (familias.status === 204) {
        res.statusMessage = familias.message;
        res.status(familias.status).end();
      }
    }
    res.send(familias);
  };
  get();
});

Familia.register(router, '/familia');

Usuario.methods(['get', 'put', 'delete']);
Usuario.route('post', (req, res) => {
  const nome = req.body.nome;
  const email = req.body.email;
  const pwd = crypt.crypt(req.body.pwd);

  if (nome !== null && email !== null && pwd !== null) {
    let usuario = new Usuario({ nome, email, pwd });

    usuario
      .save()
      .then((u) => {
        let newUser = u.toObject();
        delete newUser.pwd;
        res.send(newUser);
      })
      .catch((err) => {
        if (!err.customError) res.status(500).json({ error: 'Erro interno' });
        else {
          res.statusMessage = err.message;
          res.status(204).end();
        }
      });
  } else {
    res.statusMessage = 'Os campos obrigatórios devem ser preenchidos';
    res.status(204).end();
  }
});

Usuario.route('login.post', (req, res) => {
  const email = req.body.email;
  const hashPwd = crypt.crypt(req.body.pwd);

  Usuario.findOne({ email: email, pwd: hashPwd })
    .exec()
    .then((usuario) => {
      if (usuario === null || usuario.length === 0) {
        throw {
          customError: true,
          status: 204,
          message: 'Usuário não encontrado',
        };
      }

      let newUser = usuario.toObject();
      newUser.token = crypt.createToken(newUser._id);
      res.send(newUser);
    })
    .catch((err) => {
      if (!err.customError) res.status(500).json({ error: 'Erro interno' });
      else {
        res.statusMessage = err.message;
        res.status(204).end();
      }
    });
});
Usuario.register(router, '/usuario');

Instituicao.methods(['get', 'post', 'put', 'delete']);
Instituicao.register(router, '/instituicao');

module.exports = router;
