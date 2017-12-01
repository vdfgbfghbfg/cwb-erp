var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: './public/uploads/'});
var expressSanitized = require("express-sanitized");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var Produto = require('./../models/produto.model');
var Categoria = require('./../models/categoria.model');

router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());
router.use(expressSanitized());
router.use(methodOverride("_method"));

router.get('/produto/new', (req,res) => {
	Categoria.find((error,categorias)=>{
		res.render('novoProduto/novoProduto',{categorias: categorias});
	});
});
router.get('/produto', (req,res)=>{
	Produto.find((error,produtos) => {
		if(error){res.render('error/error', {error:error})}
		else{
			res.render('verProdutos/verProdutos', {produtos: produtos});
		};
	})
});
router.get('/produto/:id', (req,res) => {
	Produto.findById(req.params.id).populate("categorias").exec((error, produto) => {
		if(error){res.render('error/error', {error:error})}
		else {
			console.log(`O produto ${produto.nomeProduto} foi visualizado.`);
			res.render('verProduto/verProduto', {produto: produto});
		}
	});
});

router.get('/produto/:id/edit', (req,res)=>{
	Produto.findById(req.params.id, (error, produto)=>{
		if(error){res.render('error/error', {error:error})}
		else{
			Categoria.find((error,categorias)=>{
				res.render('editarProduto/editarProduto', {produto: produto, categorias: categorias});
			});
		}
	});
});
router.post('/produto/new',upload.single('img'), (req,res)=>{
	console.log(req.file)
	req.body.produto.img = req.file;
 	req.body.produto.img.caminho = "/uploads/" + req.body.produto.img.filename;
	Produto.create(req.body.produto, (error, produto) =>{
		if(error){
			console.log(error);
			res.render('error/error', {error:error});
		}
		else {
			console.log(`Produto ${produto.nomeProduto} inserido com sucesso`);
			res.redirect('/produto/' + produto._id);
		}
	})
});
router.put('/produto/:id/edit', upload.single('img'), (req,res)=>{
	if(req.file){
		req.body.produto.img = req.file;
 		req.body.produto.img.caminho = "/uploads/" + req.body.produto.img.filename;
	}
	Produto.findByIdAndUpdate(req.params.id, req.body.produto, (error, produto)=>{
		if(error){
			console.log(error);
			res.render('error/error', {error:error});
		}
		else {
			console.log(`Produto ${produto.nomeProduto} atualilzado com sucesso`);
			res.redirect('/produto/'+ produto._id);
		}
	});
});

router.delete('/produto/:id', (req,res)=>{
	Produto.findByIdAndRemove(req.params.id, (error, produto)=>{
		if(error){
			console.log(error);
			res.render('error/error', {error:error});
		}
		else {
			console.log(`Produto ${produto.nomeProduto} removido com sucesso`);
			res.redirect('/produto');
		}
	});
});
module.exports = router;