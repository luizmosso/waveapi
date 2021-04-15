import Usuario from '../models/usuario';
import crypt from '../crypt';

export async function updateUsuario(_id, usuario) {
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

export async function getUsersByInstitution(instituicaoId) {
  const params = { instituicoes: instituicaoId };
  const users = await Usuario.find(params).sort({ nome: 1 });

  if (!users || users.length === 0) {
    throw {
      customError: true,
      error: true,
      status: 404,
      message: 'Usuários não encontrados',
    };
  }
  return users;
}

export async function getUserByInstitution(baseParam, instituicaoId, withPwd) {
  const params = {
    instituicoes: instituicaoId,
    ...baseParam,
  };
  try {
    const user = await Usuario.findOne(params)
      .select(`${withPwd ? '+pwd' : ''}`)
      .populate('instituicoes');

    if (!user) {
      throw {
        customError: true,
        error: true,
        status: 204,
        message: 'Usuário não encontrado',
      };
    }
    return user;
  } catch (error) {
    if (!error.customError) {
      return { error: true, status: 500, message: 'Erro Interno' };
    }
    return error;
  }
}

export async function createUser({ instituicao, ...user }) {
  if (invalidUser(user)) {
    throw {
      customError: true,
      error: true,
      status: 204,
      message: 'Os campos obrigatórios devem ser preenchidos',
    };
  }

  let usuario = new Usuario({ ...user, instituicoes: [instituicao] });
  const createdUser = await usuario.save();
  if (!createdUser)
    throw {
      customError: true,
      error: true,
      status: 401,
      message: 'Erro ao cadastrar o usuário',
    };
  delete createdUser.pwd;
  return createdUser;
}

const invalidUser = (user) =>
  Object.keys(user).find((prop) => !prop || prop === '');
