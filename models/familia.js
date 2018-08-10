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
    preco: Number,
    beneficios: [{nome : String, valor: Number}],
    membros: [{nome : String, nascimento : Date, escolaridade : String, responsavel : Boolean}],
    observacao : String,
    tempoAtendimento : Number
});

module.exports = restful.model('familia', Familia);