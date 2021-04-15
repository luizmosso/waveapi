import Instituicao from '../models/instituicao';
import Usuario from '../models/usuario';

export async function getInstituicoes() {
  const instituicoes = await Instituicao.find().sort({ id: 1 }).exec();

  if (instituicoes?.length <= 0) {
    throw {
      customError: true,
      error: true,
      status: 204,
      message: 'Instituições não encontradas',
    };
  }
  return instituicoes;
}

export async function getInstituicoesByUser(userId) {
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

export async function updateInstituicao(_id, instituicao) {
  try {
    const result = await Instituicao.findOneAndUpdate({ _id }, instituicao, {
      upsert: true,
      setDefaultsOnInsert: true,
    });
    if (!result) {
      throw {
        customError: true,
        error: true,
        status: 204,
        message: 'Instituição não encontrada',
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

export async function createInstituicao(instituicao) {
  let institution = new Instituicao(instituicao);
  const createdInstitution = await institution.save();
  if (!createdInstitution)
    throw {
      customError: true,
      error: true,
      status: 401,
      message: 'Erro ao cadastrar a instituição',
    };
  return createdInstitution;
}
