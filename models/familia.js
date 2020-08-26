const restful = require('node-restful');
const mongoose = restful.mongoose;

const Familia = new mongoose.Schema({
  id: String,
  ativo: Boolean,
  dataCadastro: { type: Date, default: Date.now },
  dataAtivacao: [Date],
  endereco: String,
  bairro: String,
  telefone: Number,
  documento: String,
  renda: Number,
  despesas: Number,
  preco: Number,
  beneficios: [{ nome: String, valor: Number }],
  membros: [
    {
      nome: String,
      nascimento: Date,
      escolaridade: String,
      responsavel: Boolean,
    },
  ],
  cronograma: [
    {
      number: Number,
      year: Number,
      label: String,
      status: String,
      disabled: Boolean,
    },
  ],
  observacao: String,
  tempoAtendimento: Number,
  itensDoados: String,
  instituicao: { type: mongoose.Schema.Types.ObjectId, ref: 'Instituicao' },
  historicoAtivacao: [
    {
      data: { type: Date, default: Date.now },
      userID: String,
      nome: String,
      ativo: Boolean,
    },
  ],
});

module.exports = restful.model('familia', Familia);
