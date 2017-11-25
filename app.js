var express = require('express');
var expressSanitized = require("express-sanitized");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var path = require("path");
var ejs = require('ejs-html');
var Cliente = require('./models/cliente.model');
var Produto = require('./models/produto.model');
var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(expressSanitized());
mongoose.connect("mongodb://dog:dog123@ds121456.mlab.com:21456/heroku_s2674vqf", {useMongoClient: true}, function(){
	console.log("and MongoDB is ok!")
});
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride("_method"));

app.get('/', (req,res) => {
	res.render('home/home');
	
})
app.get('/cliente/new', (req,res) => {
	res.render('novoCliente/novoCliente');
});
app.get('/cliente', (req,res) => {
	var clientes = {};
	Cliente.find((error, cliente)=>{
		if(error){console.log(error)}
		else {
			clientes.clientes = cliente;
			
			res.render('verClientes/verClientes', clientes)
		}
	})
});
app.get('/cliente/:id', (req,res) => {
	Cliente.findById(req.params.id, (error, cliente) => {
		if(error){
			console.log(`Whoopsie. Erro: ${error}`);
		} else {
			console.log(cliente)
			res.render('verCliente/verCliente', {cliente: cliente});
		}
	})
});
//pagina editar cliente
app.get('/cliente/:id/edit', (req,res) => {
	Cliente.findById(req.params.id, (error, cliente) => {
		if(error){console.log(error)}
		else{
			res.render('editarCliente/editarCliente', {cliente: cliente})
		}
	})
})
//post routes
app.post('/cliente/new', (req,res) => {
	var novoCliente = {
		email: req.body.email,
		nome: req.body.nome,
		cpfcnpj: req.body.cpfcnpj,
		sobrenome: req.body.sobrenome,
		grupoCliente: req.body.grupoCliente,
		cep: req.body.cep,
		rua: req.body.rua,
		numero: req.body.numero,
		complemento: req.body.complemento,
		bairro: req.body.bairro,
		cidade: req.body.cidade,
		estado: req.body.estado
	};
	Cliente.create(novoCliente, (error,cliente) => {
		if(error){
			console.log(`Whoopsie. Erro: ${error}`);
			res.render('/novoCliente/novoCliente', error);
		} else {
			console.log(`Cliente '${cliente.nome}' criado com sucesso.`)
			res.redirect('/cliente');
		}
	});
});
//update routes
app.put('/cliente/:id/edit', (req,res) => {
	Cliente.findByIdAndUpdate(req.params.id, req.body.cliente, (error,cliente) => {
		if(error){
			console.log(error);
		} else{
			console.log(cliente);
			res.redirect('/cliente/'+req.params.id);
		}
	})
});

//delete routes
app.delete('/cliente/:id', (req,res) => {
	Cliente.findByIdAndRemove(req.params.id, (error,deleted) => {
		if(error){
			console.log(error)
		}
		else{
			console.log(`${deleted.nome} foi deletado da base.`);
			res.redirect('/cliente');
		}
	});
})
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('Express server listening on port', port)
});