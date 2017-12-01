var express = require('express');
var router = express.Router();
var expressSanitized = require("express-sanitized");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var Categoria = require('./../models/categoria.model');
var Produto = require('./../models/produto.model');

router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());
router.use(expressSanitized());
router.use(methodOverride("_method"));

router.get('/categoria', (req,res)=>{
	Categoria.find((error,categorias)=>{
		if(error){res.render('error/error', {error:error})}
		else {
			categorias.forEach(categoria => {
				/*console.log('categoria: ' + categoria._id);*/
				Produto.find({categorias: { $all: [ categoria._id ]}} ,(error,produtos)=>{
					/*console.log('temos produto!');
					console.log(produtos);*/
					categoria.produtos = [];
					categoria.produtos.push(produtos);
					categoria.produtosQtde = produtos.length;
					categoria.save((error,categoria)=>{
						if(error){console.log(error)}
					});
					/*console.log('categoria sendo salva: ' + categoria);*/
				});
			});
			/*console.log('categoria antes de visualizar: ' + categorias);*/
			res.render('verCategorias/verCategorias',{categorias: categorias});
		}
	});
});
router.get('/categoria/new', (req,res)=>{
	res.render('novaCategoria/novaCategoria');
});
router.get('/categoria/:id', (req,res)=>{
	Categoria.findById(req.params.id, (error,categoria)=>{
				if(error){res.render('error/error', {error:error})}
		else {
			Produto.find({categorias: { $all: [ categoria._id ]}},(error,produtos)=>{
				res.render('verCategoria/verCategoria',{categoria: categoria, produtos:produtos});
			});
		}
	});
});
router.get('/categoria/:id/edit', (req,res)=>{
	Categoria.findById(req.params.id, (error,categoria)=>{
		if(error){res.render('error/error', {error:error})}
		else {
			res.render('editarCategoria/editarCategoria',{categoria: categoria});
		}
	});
});
router.post('/categoria/new', (req,res)=>{
	Categoria.create(req.body.categoria, (error,categoria)=>{
		if(error){res.render('error/error', {error:error})}
		else {
			res.redirect('/categoria');
		}
	});
});
router.put('/categoria/:id/edit', (req,res)=>{
	Categoria.findByIdAndUpdate(req.params.id, req.body.categoria, (error,categoria)=>{
		if(error){res.render('error/error', {error:error})}
		else {
			res.redirect('/categoria' + categoria._id);
		}
	});
});
router.delete('/categoria/:id', (req,res)=>{
	Categoria.findByIdAndRemove(req.params.id, (error,categoria)=>{
		if(error){res.render('error/error', {error:error})}
		else {
			res.redirect('/categoria');
		}
	});
});

module.exports = router;