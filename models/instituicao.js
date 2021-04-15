import { Schema, model } from 'mongoose';

const Instituicao = new Schema({
  id: Number,
  nome: String,
  endereco: String,
  bairro: String,
  cidade: String,
  telefone: Number,
  responsavel: String,
  observacao: String,
  image: String,
  dataCadastro: { type: Date, default: Date.now },
});

export default model('instituicao', Instituicao);
