var mongoose = require('mongoose');

var pedidoSchema = new mongoose.Schema({
	dataPedido: String,
	cliente: {
		_id: String,
		nome: String,
		sobrenome: String,
		telefone: String,
		celular: String,
		cpfcnpj: String,
		email: String,
		grupoCliente: String,
		cep:String,
		rua:String,
		numero:String,
		complemento:String,
		bairro:String,
		cidade:String,
		estado:String
	},
	produtos: {type: Array, default: []}
});

module.exports = mongoose.model('Pedido', pedidoSchema);