var express = require('express');
var router = express.Router();
var expressSanitized = require("express-sanitized");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var Cliente = require('./../models/cliente.model');

router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());
router.use(expressSanitized());
router.use(methodOverride("_method"));

router.get('/cliente/new', (req,res) => {
	res.render('novoCliente/novoCliente');
});
router.get('/cliente', (req,res) => {
	var clientes = {};
	Cliente.find((error, cliente)=>{
		if(error){console.log(error)}
		else {
			clientes.clientes = cliente;
			res.render('verClientes/verClientes', clientes)
		}
	})
});
router.get('/cliente/:id', (req,res) => {
	Cliente.findById(req.params.id).populate("pedidos").exec((error, cliente) => {
		if(error){
			console.log(`Whoopsie. Erro: ${error}`);
		} else {
			console.log(cliente.pedido);
			res.render('verCliente/verCliente', {cliente: cliente});
		}
	})
});
router.get('/cliente/:id/edit', (req,res) => {
	Cliente.findById(req.params.id, (error, cliente) => {
		if(error){res.render('error/error', {error:error})}
		else{
			res.render('editarCliente/editarCliente', {cliente: cliente})
		}
	})
});
router.post('/cliente/new', (req,res) => {
	var novoCliente = {
		email: req.body.email,
		nome: req.body.nome,
		cpfcnpj: req.body.cpfcnpj,
		sobrenome: req.body.sobrenome,
		celular: req.body.celular,
		telefone: req.body.telefone,
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
			res.render('error/error', {error:error});
		} else {
			console.log(`Cliente '${cliente.nome}' criado com sucesso.`)
			res.redirect('/cliente/' + cliente._id);
		}
	});
});
router.put('/cliente/:id/edit', (req,res) => {
	Cliente.findByIdAndUpdate(req.params.id, req.body.cliente, (error,cliente) => {
		if(error){
			console.log(error);
		} else{
			console.log(cliente);
			res.redirect('/cliente/' + cliente.id);
		}
	})
});
router.delete('/cliente/:id', (req,res) => {
	Cliente.findByIdAndRemove(req.params.id, (error,deleted) => {
		if(error){
			console.log(error)
		}
		else{
			console.log(`${deleted.nome} foi deletado da base.`);
			res.redirect('/cliente');
		}
	});
});
module.exports = router;