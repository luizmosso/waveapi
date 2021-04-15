import { Schema, model } from 'mongoose';

const Usuario = new Schema({
  nome: String,
  pwd: { type: String, select: false },
  email: String,
  token: { type: String, default: '' },
  refreshToken: { type: String, default: '' },
  status: { type: String, default: 'active' },
  instituicoes: [{ type: Schema.Types.ObjectId, ref: 'instituicao' }],
});

export default model('usuario', Usuario);
