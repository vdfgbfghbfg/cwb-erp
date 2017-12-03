var express = require('express');
var expressSanitized = require("express-sanitized");
var bodyParser = require("body-parser");
var fs = require("fs-extra");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var path = require("path");
var ejs = require('ejs-html');
var Cliente = require('./models/cliente.model');
var Produto = require('./models/produto.model');
var Categoria = require('./models/categoria.model');
var Segmento = require('./models/segmento.model');
var Pedido = require('./models/pedido.model');
var multer = require('multer');
var upload = multer({ dest: './public/uploads/'});
var autoIncrement = require('mongoose-auto-increment');
var clientesRoutes = require('./routes/clientes.routes');
var indexRoutes = require('./routes/index.routes');
var pedidosRoutes = require('./routes/pedidos.routes');
var categoriasRoutes = require('./routes/categorias.routes');
var produtosRoutes = require('./routes/produtos.routes');
var segmentosRoutes = require('./routes/segmentos.routes');
var app = express();

app.use(clientesRoutes);
app.use(indexRoutes);
app.use(pedidosRoutes);
app.use(categoriasRoutes);
app.use(produtosRoutes);
app.use(segmentosRoutes);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(expressSanitized());
var connection =  mongoose.connect("mongodb://dog:dog123@ds121456.mlab.com:21456/heroku_s2674vqf", {useMongoClient: true}, function(){
	console.log("and MongoDB is ok!")
});
autoIncrement.initialize(connection);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride("_method"));

app.get('/dog',(req,res)=>{



})

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('DEO online em localhost:', port)
});
/*Categoria.create({
	nome: "Notebooks",
	descricao: "Os melhores notebooks do Brasil"
},(error,categoria)=>{
	Produto.findOne({sku: "note2"}, (error,produto)=>{
		produto.categorias.push(categoria);
		produto.save();
	})
})*/