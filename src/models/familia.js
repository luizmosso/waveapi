import { Schema, model } from 'mongoose';

const Familia = new Schema({
  id: String,
  ativo: Boolean,
  dataCadastro: { type: Date, default: Date.now },
  dataUltimaDesativacao: [Date],
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
  instituicao: { type: Schema.Types.ObjectId, ref: 'Instituicao' },
  historicoAtivacao: [
    {
      data: { type: Date, default: Date.now },
      userID: String,
      nome: String,
      ativo: Boolean,
    },
  ],
});

export default model('familia', Familia);
