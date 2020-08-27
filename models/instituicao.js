const restful = require('node-restful');
const mongoose = restful.mongoose;

const Instituicao = new mongoose.Schema({
  id: Number,
  nome: String,
  endereco: String,
  bairro: String,
  cidade: String,
  telefone: Number,
  responsavel: String,
  observacao: String,
  dataCadastro: { type: Date, default: Date.now },
});

module.exports = restful.model('instituicao', Instituicao);
