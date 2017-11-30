var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.connect("mongodb://dog:dog123@ds121456.mlab.com:21456/heroku_s2674vqf", {useMongoClient: true}, function(){
	console.log("and MongoDB is ok!")
});;
autoIncrement.initialize(connection);

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

clienteSchema.plugin(autoIncrement.plugin, 'Cliente');
module.exports = connection.model('Cliente', clienteSchema);