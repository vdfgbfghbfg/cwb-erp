var mongoose = require('mongoose');

var clienteSchema = new mongoose.Schema({
	nome: {type: String, required: true},
	sobrenome: {type: String},
	telefone: {type: String},
	celular: {type: String},
	cpfcnpj: {type: String},
	email: {type: String, unique: true, required: true},
	grupoCliente: {type: String},
	cep:{type: String},
	rua:{type: String},
	numero:{type: String},
	complemento:{type: String},
	bairro:{type: String},
	cidade:{type: String},
	estado:{type: String}
	});

module.exports = mongoose.model('Cliente', clienteSchema);