var Usuario = require('../models/usuario');
var crypt = require('../crypt');

async function updateUsuario(_id, usuario) {
  try {
    if (usuario.pwd) {
      usuario.pwd = crypt.crypt(usuario.pwd);
    }
    const result = await Usuario.findOneAndUpdate({ _id }, usuario, {
      upsert: true,
      setDefaultsOnInsert: true,
    });
    if (!result) {
      throw {
        customError: true,
        error: true,
        status: 204,
        message: 'Usuário não encontrado',
      };
    }
    return result;
  } catch (error) {
    if (!error.customError) {
      return { error: true, status: 500, message: 'Erro Interno' };
    }
    return error;
  }
}

module.exports = {
  updateUsuario,
};
