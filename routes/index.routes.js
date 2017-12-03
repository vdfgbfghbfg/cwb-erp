var express = require('express');
var router = express.Router();
var expressSanitized = require("express-sanitized");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var Categoria = require('./../models/categoria.model');
var Produto = require('./../models/produto.model');
var Cliente = require('./../models/cliente.model');
var Pedido = require('./../models/pedido.model');
var Segmento = require('./../models/segmento.model');

router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());
router.use(expressSanitized());
router.use(methodOverride("_method"));

Date.prototype.monthNames = [
	    "Janeiro", "Fevereiro", "Março",
	    "Abril", "Maio", "Junho",
	    "Julho", "Agosto", "Setembro",
	    "Outubro", "Novembro", "Dezembro"
	];
Date.prototype.getMonthName = function() {
	    return this.monthNames[this.getMonth()];
	};
var date = new Date;
var monthName = date.getMonthName();

router.get('/',(req,res)=>{
	res.render('home/home');
});

router.get('/dashboard', (req,res) => {
	Pedido.find(/*{'data.mes.nome': monthName},*/(error,pedidos)=>{
		if(error){
			res.render('error/error', {error:error});
		}
		else{
			Cliente.find({}).populate('pedidos').exec((error,clientes)=>{
				if(error){
					res.render('error/error', {error:error});
				}
				else{
					Segmento.find().sort({'clientesQtde':-1}).exec((error,segmentos)=>{
						if(error){
							res.render('error/error', {error:error});
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
							Categoria.find((error,categorias)=>{
								if(error){
									res.render('error/error', {error:error});
								}
								else{
									Produto.find((error,produtos)=>{
									if(error){
										res.render('error/error', {error:error});
									}
									else{
											var data = new Date;
											var esteMes = data.getMonth();
											var mesPassado = data.getMonth() -1;
											var mesRetrasado = data.getMonth() -2;
											var faturamento = [];
											faturamento[0] = 0;
											faturamento[1] = 0;
											faturamento[2] = 0;
											Pedido.find((error,pedidos)=>{
												if(error){
													res.render("error/error", {error:error});
												} else{
													pedidos.forEach((pedido,i)=>{
														if(pedido.data.mes.numero === esteMes){
															faturamento[2] += pedido.totalVenda;
														}
														if(pedido.data.mes.numero === mesPassado){
															faturamento[1] += pedido.totalVenda;
														}
														if(pedido.data.mes.numero === mesRetrasado){
															faturamento[0] += pedido.totalVenda;
														}
													});
													res.render('dashboard/dashboard', {pedidos:pedidos, clientes: clientes, segmentos: segmentos, categorias: categorias, produtos: produtos, monthName: monthName, faturamento: faturamento});
												}
										});
										
									}
									});
								}
							});
						}
					});
				}
			});
		}
	});
});
module.exports = router;