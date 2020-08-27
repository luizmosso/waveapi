var moment = require('moment');
var { getFamilias } = require('../controllers/familia');

async function DisableFamiliesByEndOfAttendance() {
  console.log('disabled'); // Get familias
  const familias = await getFamilias();
  const ativas = familias.filter(({ ativo }) => ativo);
  ativas.forEach(({ dataCadastro, tempoAtendimento }) => {
    const cadastro = moment(dataCadastro);
    const final = moment();

    console.log(
      tempoAtendimento,
      final.diff(cadastro, 'months', true) >= parseInt(tempoAtendimento)
    );
  });
}

module.exports = {
  DisableFamiliesByEndOfAttendance,
};
