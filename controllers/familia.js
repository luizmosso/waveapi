async function getFamilias(id) {
  const params = id ? { _id: req.params.id } : {};
  try {
    const familias = await Familia.find(params).sort({ id: 1 }).exec();

    if (!familias || familias.length === 0) {
      throw {
        customError: true,
        status: 204,
        message: 'Familias não encontradas',
      };
    }
  } catch (error) {
    if (!err.customError)
      return { error: true, status: 500, message: 'Erro Interno' };
    else {
      return { error: true, status: 204, message: err.message };
    }
  }
}

module.exports = {
  getFamilias,
};
