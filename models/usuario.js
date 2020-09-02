const restful = require('node-restful');
const mongoose = restful.mongoose;

const Usuario = new mongoose.Schema({
  nome: String,
  pwd: { type: String, select: false },
  email: String,
  token: { type: String, default: '' },
  instituicoes: [
    {
      id: String,
      status: String,
      dataCadastro: { type: Date, default: Date.now },
      permissoes: [{ nome: String }],
    },
  ],
});

module.exports = restful.model('usuario', Usuario);
