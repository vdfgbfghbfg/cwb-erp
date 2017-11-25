var mongoose = require('mongoose');

var clienteSchema = new mongoose.Schema({
	nome: {type: String},
	email: {type: String, unique: true}
});

module.exports = mongoose.model('Cliente', clienteSchema);