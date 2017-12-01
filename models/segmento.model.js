var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.connect("mongodb://dog:dog123@ds121456.mlab.com:21456/heroku_s2674vqf", {useMongoClient: true}, function(){
	
});;
autoIncrement.initialize(connection);

var segmentoSchema = new mongoose.Schema({
	nome: String,
	clientes: Array,
	clientesQtde: Number
});

segmentoSchema.plugin(autoIncrement.plugin, { model: 'Segmento', field: 'segmentoId' });
module.exports = mongoose.model('Segmento', segmentoSchema);