var Familia = require('../models/familia');

async function getFamilias(_id) {
  const params = _id ? { _id } : {};
  try {
    const familias = await Familia.find(params).sort({ id: 1 }).exec();
    if (!familias || familias.length === 0) {
      throw {
        customError: true,
        error: true,
        status: 204,
        message: 'Familias não encontradas',
      };
    }
    return familias;
  } catch (error) {
    if (!error.customError) {
      return { error: true, status: 500, message: 'Erro Interno' };
    }
    return error;
  }
}

async function updateFamilia(familia) {
  try {
    const { _id } = familia;
    const result = await Familia.findOneAndReplace({ _id }, familia);
    if (!result) {
      throw {
        customError: true,
        error: true,
        status: 204,
        message: 'Familia não encontrada',
      };
    }
    return familias;
  } catch (error) {
    if (!error.customError) {
      return { error: true, status: 500, message: 'Erro Interno' };
    }
    return error;
  }
}

module.exports = {
  getFamilias,
  updateFamilia,
};
