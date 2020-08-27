var moment = require('moment');
var { getFamilias } = require('../controllers/familia');

function DisableFamily(family) {
  console.log('UMA', family.id);
}

async function DisableFamiliesByEndOfAttendance() {
  const familias = await getFamilias();
  const ativas = familias.filter(({ ativo }) => ativo);
  ativas.forEach((family) => {
    const { dataCadastro, tempoAtendimento, cronograma } = family;
    const cadastro = moment(dataCadastro);
    const final = moment();

    // Desativa a família caso o tempo de atendimento tenha terminado
    if (final.diff(cadastro, 'months', true) >= parseInt(tempoAtendimento)) {
      DisableFamily(family);
    } else {
      for (let index = 0; index < cronograma.length; index++) {
        const month = cronograma[index];
        if (index > 0) {
          const pastMonth = cronograma[index - 1];
          // Desativa a família caso ela não tenha recolhido a cesta por dois meses seguidos.
          if (month.status === 'error' && pastMonth.status === 'error') {
            DisableFamily(family);
            break;
          }
        }
      }
    }
  });
}

module.exports = {
  DisableFamiliesByEndOfAttendance,
};
