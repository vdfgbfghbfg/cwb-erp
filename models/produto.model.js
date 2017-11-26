var mongoose = require('mongoose');

var produtoSchema = new mongoose.Schema({
	nomeProduto: {type: String},
	sku: {type: String, unique: true},
	peso: {type: Number},
	quantidade: {type: Number},
	precoVenda: {type: Number},
	precoCusto: {type: Number},
	img: {type: String},
	categoria: String
});

module.exports = mongoose.model('Produto', produtoSchema);