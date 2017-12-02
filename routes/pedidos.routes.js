var express = require('express');
var router = express.Router();
var expressSanitized = require("express-sanitized");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var Pedido = require('./../models/pedido.model');
var Cliente = require('./../models/cliente.model');
var Produto = require('./../models/produto.model');

router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());
router.use(expressSanitized());
router.use(methodOverride("_method"));

router.get('/pedido', (req,res) => {
	Pedido.find((error,pedidos)=>{
		if(error){res.render('error/error', {error:error})}
		else{
			res.render('verPedidos/verPedidos', {pedidos: pedidos});
		}
	});
});
router.get('/pedido/new', (req,res)=>{
	Cliente.find((error,clientes)=>{
		if(error){res.render('error/error', {error:error})}
		else{
			Produto.find((error,produtos)=>{
				if(error){res.render('error/error', {error:error})}
				else {
					Pedido.find((error,pedidos)=>{
						if(error){res.render('error/error', {error:error})}
						else{
							res.render('novoPedido/novoPedido', {produtos: produtos, clientes:clientes});
						}
					});
				};
			});
		}
	})
});
router.get('/pedido/:id',(req,res)=>{
	Pedido.findById(req.params.id,(error,pedido)=>{
		if(error){res.render('error/error', {error:error})}
		else {
			Cliente.findById(pedido.cliente._id).populate("segmento").exec((error,cliente)=>{
				if(error){res.render('error/error', {error:error})}
				else {
					res.render('verPedido/verPedido', {pedido: pedido, cliente: cliente});
				}
			})
		}
	})
});
router.get('/pedido/:id/edit',(req,res)=>{
	Pedido.findById(req.params.id, (error,pedido)=>{
		if(error){
				console.log(error);
				res.render('error/error', {error:error});
			}
			else {
				Cliente.findById(pedido.cliente._id, (error,cliente)=>{
					if(error){
						console.log(error);
						res.render('error/error', {error:error});
					}
					else {
						res.render('editarPedido/editarPedido', {pedido:pedido, cliente:cliente});
					}
				});
			}
		});
});
router.post('/pedido/new', (req,res)=>{
	req.body.pedido.produtos = req.body.produtos;
	Pedido.create(req.body.pedido, (error,pedido)=>{
		if(error){
			console.log(error);
			res.render('error/error', {error:error});
		}
		else {
			Cliente.findById(pedido.cliente._id, (error,cliente)=>{
				if(error){
					console.log(error);
					res.render('error/error', {error:error});
				}
				else{
					cliente.pedidos.push(pedido);
					cliente.save((error,cliente)=>{
						if(error){console.log('opa! paramos salvando o cliente. Erro:' + error)}
					});
				}
			});
			req.body.produtos.forEach(produto => {
				if(produto._id){
					Produto.findByIdAndUpdate(produto.idOficial, {$inc:{quantidade: - produto.quantidade}},(error,produtoAtualizado)=>{
						if(error){console.log(error)}
					});
					
				}
			})
			/*console.log(pedido);*/
			res.redirect('/pedido/' + pedido._id);

		}
	});
});
router.put('/pedido/:id/edit', (req,res)=>{
	Pedido.findByIdAndUpdate(req.params.id, req.body.pedido, (error,pedido)=>{
		if(error){
			console.log(error);
			res.render('error/error', {error:error});
		}
		else {
			console.log(`Pedido ${pedido.nomeProduto} atualilzado com sucesso`);
			res.redirect('/pedido/'+ pedido._id);
		}
	});
});
router.delete('/pedido/:id', (req,res)=>{
	Pedido.findByIdAndRemove(req.params.id, (error, pedido)=>{
		if(error){
			console.log(error);
			res.render('error/error', {error:error});
		}
		else {
			console.log(`Pedido ${pedido._id} removido com sucesso`);
			res.redirect('/pedido');
		}
	});
});
module.exports = router;