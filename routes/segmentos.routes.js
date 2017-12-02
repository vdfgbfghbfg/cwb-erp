var express = require('express');
var router = express.Router();
var expressSanitized = require("express-sanitized");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var Segmento = require('./../models/segmento.model');
var Cliente = require('./../models/cliente.model');

router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());
router.use(expressSanitized());
router.use(methodOverride("_method"));

router.get('/segmento', (req,res)=>{
	Segmento.find((error,segmentos)=>{
		if(error){
			console.log(error);
			res.render('error/error',{error:error});
		}
		else{
			segmentos.forEach(segmento => {
				Cliente.find({segmento: { $all: [ segmento._id ]}} ,(error,clientes)=>{
					segmento.clientes = [];
					segmento.clientes.push(clientes);
					segmento.clientesQtde = clientes.length;
					segmento.save((error,segmento)=>{
						if(error){console.log(error)}
					});
				});	
			});
			res.render('verSegmentos/verSegmentos', {segmentos:segmentos});
		}
	})
});
router.get('/segmento/new', (req,res)=>{
	res.render('novoSegmento/novoSegmento');
});
router.get('/segmento/:id', (req,res)=>{
	Segmento.findById(req.params.id,(error,segmento)=>{
		Cliente.find({segmento: { $all: [ segmento._id ] } }).populate("segmentos").exec((error,clientes)=>{
			if(error){
				console.log(error);
				res.render('error/error',{error:error});
			}
			else{
				res.render('verSegmento/verSegmento', {segmento: segmento, clientes: clientes});
			}
		});
	});
});
router.post('/segmento/new', (req,res)=>{
	Segmento.create(req.body.segmento, (error,segmento)=>{
		if(error){
			console.log(error);
			res.render('error/error',{error:error});
		}else{
			res.redirect('/segmento');
		}
	});
});
router.delete('/segmento/:id', (req,res)=>{
	Segmento.findByIdAndRemove(req.params.id, (error,segmento)=>{
		if(error){
			console.log(error);
			res.render('error/error',{error:error});
		}else{
			res.redirect('/segmento');
		}
	});
});


module.exports = router;