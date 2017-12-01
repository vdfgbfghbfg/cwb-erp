var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.connect("mongodb://dog:dog123@ds121456.mlab.com:21456/heroku_s2674vqf", {useMongoClient: true}, function(){
	console.log("and MongoDB is ok!")
});;
autoIncrement.initialize(connection);

var produtoSchema = new mongoose.Schema({
	produtoId: Number,
	nomeProduto: String,
	sku: {type: String, unique: true},
	peso: String,
	quantidade: Number,
	precoVenda: String,
	precoCusto: String,
	img: Object,
	categoria: String
});

produtoSchema.plugin(autoIncrement.plugin, { model: 'Produto', field: 'produtoId' });
module.exports = mongoose.model('Produto', produtoSchema);