const restful = require('node-restful');
const mongoose = restful.mongoose;

const Usuario = new mongoose.Schema({
    nome: String,
    pwd: {type : String, select : false},
    email: String
});

module.exports = restful.model('usuario', Usuario);