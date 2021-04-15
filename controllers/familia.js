import Familia from '../models/familia';

export async function getFamilias(_id) {
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

export async function updateFamily(family) {
  const { _id, __v, ...familyToUpdate } = family;
  const result = await Familia.findOneAndUpdate({ _id }, familyToUpdate, {
    upsert: true,
    setDefaultsOnInsert: true,
  });
  if (!result) {
    throw {
      customError: true,
      error: true,
      status: 204,
      message: 'Familia não encontrada',
    };
  }
  return result;
}

export async function deleteFamilia(familia) {
  try {
    const { _id, __v, ...familiaToUpdate } = familia;
    const result = await Familia.findOneAndDelete({ _id });
    if (!result) {
      throw {
        customError: true,
        error: true,
        status: 204,
        message: 'Familia não encontrada',
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

export async function getFamiliesByInstitution(instituicao) {
  const families = await Familia.find({ instituicao }).sort({ id: 1 });
  if (!families || families.length === 0) {
    throw {
      customError: true,
      error: true,
      status: 404,
      message: 'Familias não encontradas',
    };
  }
  return families;
}

export async function getFamilyByInstitution(baseParam, instituicao) {
  const params = { instituicao, ...baseParam };
  try {
    const family = await Familia.findOne(params);

    if (!family) {
      throw {
        customError: true,
        error: true,
        status: 204,
        message: 'Família não encontrado',
      };
    }
    return family;
  } catch (error) {
    if (!error.customError) {
      return { error: true, status: 500, message: 'Erro Interno' };
    }
    return error;
  }
}

export async function createFamily(family) {
  const newFamily = new Familia(family);
  const createdFamily = await newFamily.save();
  if (!createdFamily)
    throw {
      customError: true,
      error: true,
      status: 401,
      message: 'Erro ao cadastrar a Família',
    };
  return createdFamily;
}
