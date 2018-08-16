const restful = require('node-restful');
const mongoose = restful.mongoose;

const Usuario = new mongoose.Schema({
    nome: String,
    pwd: {type : String, select : false},
    email: String,
    token: {type: String, default: ''}
});

module.exports = restful.model('usuario', Usuario);