var Instituicao = require('../models/instituicao');
var Usuario = require('../models/usuario');

async function getInstituicoesByUser(userId) {
  const params = { _id: userId };
  try {
    const users = await Usuario.find(params).sort({ id: 1 }).exec();
    const instIDs = users[0].instituicoes.map((inst) => inst.id);
    const instParams = { _id: { $in: instIDs } };
    const instituicoes = await Instituicao.find(instParams)
      .sort({ id: 1 })
      .exec();

    if (!instituicoes || instituicoes.length === 0) {
      throw {
        customError: true,
        error: true,
        status: 204,
        message: 'Instituições não encontradas',
      };
    }
    return instituicoes;
  } catch (error) {
    if (!error.customError) {
      return { error: true, status: 500, message: 'Erro Interno' };
    }
    return error;
  }
}

module.exports = {
  getInstituicoesByUser,
};
