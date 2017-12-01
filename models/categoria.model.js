var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.connect("mongodb://dog:dog123@ds121456.mlab.com:21456/heroku_s2674vqf", {useMongoClient: true}, function(){
	
});;
autoIncrement.initialize(connection);

var categoriaSchema = new mongoose.Schema({
	url: String,
	categoriaId: Number,
	nome: String,
	descricao: String,
	img: Object,
	produtos: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Produto"
		}
	]
});

categoriaSchema.plugin(autoIncrement.plugin, { model: 'Categoria', field: 'categoriaId' });
module.exports = mongoose.model('Categoria', categoriaSchema);