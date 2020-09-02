var Usuario = require('../models/usuario');

async function updateUsuario(_id, usuario) {
  console.log('chamou');
  try {
    console.log('dentro', usuario);
    if (usuario.pwd) {
      usuario.pwd = crypt.crypt(usuario.pwd);
    }
    console.log(usuario);
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
    console.log(result);
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
