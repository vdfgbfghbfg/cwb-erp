var mongoose = require('mongoose');

var clienteSchema = new mongoose.Schema({
	nome: {type: String, required: true},
	email: {type: String, unique: true, required: true}
});

module.exports = mongoose.model('Cliente', clienteSchema);