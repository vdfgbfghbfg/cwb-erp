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
var Pedido = require('./models/pedido.model');
var multer = require('multer');
var upload = multer({ dest: './public/uploads/'});
var autoIncrement = require('mongoose-auto-increment');
var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(expressSanitized());
mongoose.connect("mongodb://dog:dog123@ds121456.mlab.com:21456/heroku_s2674vqf", {useMongoClient: true}, function(){
	console.log("and MongoDB is ok!")
});
var connection = mongoose.createConnection("mongodb://dog:dog123@ds121456.mlab.com:21456/heroku_s2674vqf");
autoIncrement.initialize(connection);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
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
	Cliente.findById(req.params.id).populate("pedidos").exec((error, cliente) => {
		if(error){
			console.log(`Whoopsie. Erro: ${error}`);
		} else {
			console.log(cliente.pedido);
			res.render('verCliente/verCliente', {cliente: cliente});
		}
	})
});
app.get('/produto/new', (req,res) => {
	res.render('novoProduto/novoProduto');
});
//pagina editar cliente
app.get('/cliente/:id/edit', (req,res) => {
	Cliente.findById(req.params.id, (error, cliente) => {
		if(error){res.render('error/error', {error:error})}
		else{
			res.render('editarCliente/editarCliente', {cliente: cliente})
		}
	})
});
//pagina ver todos os produtos
app.get('/produto', (req,res)=>{
	Produto.find((error,produtos) => {
		if(error){res.render('error/error', {error:error})}
		else{
			res.render('verProdutos/verProdutos', {produtos: produtos});
		};
	})
});
app.get('/produto/:id', (req,res) => {
	Produto.findById(req.params.id).populate("categorias").exec((error, produto) => {
		if(error){res.render('error/error', {error:error})}
		else {
			console.log(`O produto ${produto.nomeProduto} foi visualizado.`);
			res.render('verProduto/verProduto', {produto: produto});
		}
	});
});

app.get('/produto/:id/edit', (req,res)=>{
	Produto.findById(req.params.id, (error, produto)=>{
		if(error){res.render('error/error', {error:error})}
		else{
			res.render('editarProduto/editarProduto', {produto: produto});
		}
	});
});
app.get('/pedido/:id/edit',(req,res)=>{
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
app.get('/pedido', (req,res) => {
	Pedido.find((error,pedidos)=>{
		if(error){res.render('error/error', {error:error})}
		else{
			res.render('verPedidos/verPedidos', {pedidos: pedidos});
		}
	});
});
app.get('/pedido/new', (req,res)=>{
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
app.get('/pedido/:id',(req,res)=>{
	Pedido.findById(req.params.id,(error,pedido)=>{
		if(error){res.render('error/error', {error:error})}
		else {
			Cliente.findById(pedido.cliente._id,(error,cliente)=>{
				if(error){res.render('error/error', {error:error})}
				else {
					res.render('verPedido/verPedido', {pedido: pedido, cliente: cliente});
				}
			})
		}
	})
});
app.get('/categoria', (req,res)=>{
	Categoria.find((error,categorias)=>{
		if(error){res.render('error/error', {error:error})}
		else {
			res.render('verCategorias/verCategorias',{categorias: categorias});
		}
	});
});
app.get('/categoria/new', (req,res)=>{
	res.render('novaCategoria/novaCategoria');
});
//post routes
app.post('/cliente/new', (req,res) => {
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
app.post('/produto/new',upload.single('img'), (req,res)=>{
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
app.post('/pedido/new', (req,res)=>{
	req.body.pedido.produtos = req.body.produtos;
	Pedido.create(req.body.pedido, (error,pedido)=>{
		if(error){
			console.log(error);
			res.render('error/error', {error:error});
		}
		else {
			var novoPedido = 
			Cliente.findById(pedido.cliente._id, (error,cliente)=>{
				if(error){
					console.log(error);
					res.render('error/error', {error:error});
				}
				else{
					console.log('Prestes a pushar o pedido na array pedidos do cliente. Pedido: ' + pedido + '. Cliente antes: ' + cliente);
					cliente.pedidos.push(pedido);
					cliente.save((error,cliente)=>{
						if(error){console.log('opa! paramos salvando o cliente. Erro:' + error)}
					});
					console.log('Cliente depois: ' + cliente);
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
}),
//update routes
app.put('/cliente/:id/edit', (req,res) => {
	Cliente.findByIdAndUpdate(req.params.id, req.body.cliente, (error,cliente) => {
		if(error){
			console.log(error);
		} else{
			console.log(cliente);
			res.redirect('/cliente/' + cliente.id);
		}
	})
});
app.put('/produto/:id/edit', upload.single('img'), (req,res)=>{
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
app.put('/pedido/:id/edit', (req,res)=>{
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
});
app.delete('/produto/:id', (req,res)=>{
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
app.delete('/pedido/:id', (req,res)=>{
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
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('Express server listening on port', port)
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