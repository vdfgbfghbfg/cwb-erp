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
	produtos: {
		p0: {quantidade:String, _id:String},
		p1: {quantidade:String, _id:String},
		p2: {quantidade:String, _id:String},
		p3: {quantidade:String, _id:String},
		p4: {quantidade:String, _id:String},
		p5: {quantidade:String, _id:String},
		p6: {quantidade:String, _id:String},
		p7: {quantidade:String, _id:String},
		p8: {quantidade:String, _id:String},
		p9: {quantidade:String, _id:String},
		p10: {quantidade:String, _id:String}
	}
});

module.exports = mongoose.model('Pedido', pedidoSchema);