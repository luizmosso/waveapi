var moment = require('moment');
var { getFamilias, updateFamilia } = require('../controllers/familia');

function DisableFamily(family) {
  family.observacao = 'desativada agora';
  console.log(family.toObject());
  updateFamilia(family.toObject());
}

async function DisableFamilyByCriteria() {
  const familias = await getFamilias();
  if (!familias || familias.length === 0) return;

  const ativas = familias.filter(({ ativo }) => ativo);
  if (!ativas || ativas.length === 0) return;

  ativas.forEach((family) => {
    const { dataCadastro, tempoAtendimento, cronograma } = family;
    const cadastro = moment(dataCadastro);
    const final = moment();

    if (family.id === 'F888') {
      DisableFamily(family);
    }

    // // Desativa a família caso o tempo de atendimento tenha terminado
    // if (final.diff(cadastro, 'months', true) >= parseInt(tempoAtendimento)) {
    //   DisableFamily(family);
    // } else {
    //   for (let index = 0; index < cronograma.length; index++) {
    //     const month = cronograma[index];
    //     if (index > 0) {
    //       const pastMonth = cronograma[index - 1];
    //       // Desativa a família caso ela não tenha recolhido a cesta por dois meses seguidos.
    //       if (month.status === 'error' && pastMonth.status === 'error') {
    //         DisableFamily(family);
    //         break;
    //       }
    //     }
    //   }
    // }
  });
}

module.exports = {
  DisableFamilyByCriteria,
};
