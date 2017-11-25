var mongoose = require('mongoose');

var produtoSchema = new mongoose.Schema({
	nome: {type: String},
	sku: {type: String, unique: true},
	peso: {type: Number},
	quantidade: {type: Number},
	preco: {type: Number},
	img: {type: String}
});

module.exports = mongoose.model('Produto', produtoSchema);