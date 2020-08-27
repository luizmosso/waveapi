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
      cadastro.format('DD/MM/YYYY'),
      final.format('DD/MM/YYYY'),
      tempoAtendimento,
      final.diff(cadastro, 'months', true)
    );
  });
}

module.exports = {
  DisableFamiliesByEndOfAttendance,
};
