var mongoose = require('mongoose');

var produtoSchema = new mongoose.Schema({
	nomeProduto: String,
	sku: {type: String, unique: true},
	peso: String,
	quantidade: Number,
	precoVenda: String,
	precoCusto: String,
	img: Object,
	categoria: String
});

module.exports = mongoose.model('Produto', produtoSchema);