var crypto = require('crypto');
var User = require('../models/user.js');
var fs=require('fs');
var Post=require('../models/post.js');
var Address=require('../models/address.js');
var Cart=require('../models/cart.js');
var Order=require('../models/order.js');
var Comment=require('../models/comment.js');

module.exports=function(app){

	//app.get('/') not login

	app.get('/',checkNotLogin);
	app.get('/',function(req,res){
		res.render('login',{
			title:'EasyOTO｜关注互联网创业',
			success:req.flash('success').toString(),
			error:req.flash('error').toString()
		});

	});

	//app.post('/login') not login

	app.post('/login',checkNotLogin);
	app.post('/login',function(req,res){
			var name=req.body.name;
			var password=req.body.password;
			console.log(password);
			var md5=crypto.createHash('md5');
			var password=md5.update(password).digest('hex');
			var err=0;
			User.get(name,function(err,user){
				if (!user)
				{	//用户不存在
					return res.json({success:4});
				}
				if(user.password != password)
				{	
					return res.json({success:3});
				}
				req.session.user=user.name;
				res.json({success:1});
				});

	});

	//app.post('/reg') not login

	app.post('/reg',checkNotLogin);
	app.post('/reg',function(req,res){
		var name=req.body.name;
		var password=req.body.password;
			var md5=crypto.createHash('md5');
			var password=md5.update(req.body.password).digest('hex');
			var newUser= new User({
			"name":name,
			"password":password
			});
			User.get(newUser.name,function(err,user){
			if (user){
				//用户已经存在
				return res.json({success:4});			
				}
			newUser.save(function(err){
				if(err){
					return res.json({success:3});
						
				}
				path="./public/uploads/"+newUser.name;
				fs.mkdir(path,function(err,path){
				req.session.user=newUser.name;
				res.json({success:1});
			});
			});
});
	});


	//app.get('/index') login
	app.get('/index',checkLogin);
	app.get('/index',function(req,res){
		var page=req.query.page?parseInt(req.query.page):1;
		Cart.getNum(req.session.user,function(err,num){
			if(err){
					return res.redirect('/index');			
				}
			var sstate=1;
			User.getAllshop(sstate,page,function(err,shops){
				if(err){
					return res.redirect('/index');			
				}
					res.render('index',{
						title:'EasyOTO|关注互联网创业',
						user:req.session.user,
						num:num,
						shops:shops,
						length:shops.length,
						page:page,
						success:req.flash('success').toString(),
						error:req.flash('error').toString()
					});
			
			});
		});
	});
	
	//app.get('/mall') login
	app.get('/mall',checkLogin);
	app.get('/mall',function(req,res){
		var page=req.query.page?parseInt(req.query.page):1;
		Cart.getNum(req.session.user,function(err,num){
			if(err){
					return res.redirect('/index');			
				}
			var sstate=1;
			User.getAllshop(sstate,page,function(err,shops){
				if(err){
					return res.redirect('/index');			
				}
					res.render('mall',{
						title:'EasyOTO|关注互联网创业',
						user:req.session.user,
						num:num,
						shops:shops,
						length:shops.length,
						page:page,
						success:req.flash('success').toString(),
						error:req.flash('error').toString()
					});
			
			});
		});
	});


	//app.get('/shop/:boss') login
	app.get('/shop/:boss',checkLogin);
	app.get('/shop/:boss',function(req,res){
		var page=req.query.page?parseInt(req.query.page):1;
		var boss=req.params.boss;
		Cart.getNum(req.session.user,function(err,num){
			if(err){
					return res.redirect('/index');			
				}
			var state=1;
			Post.getTen(boss,null,null,null,state,page,function(err,posts){
				if(err){
					return res.redirect('/index');			
				}
				Post.getAd(boss,function(err,ads){
					if(err){
					return res.redirect('/index');			
				}
				User.pvAdd(boss,function(err,back){
					res.render('shop',{
						title:"欢迎光临"+boss+"店铺",
						user:req.session.user,
						num:num,
						posts:posts,
						length:posts.length,
						boss:boss,
						ads:ads,
						page:page,
						success:req.flash('success').toString(),
						error:req.flash('error').toString()
					});
				});
			});
		});
	});
});		

	//app.get('/hire')

	app.get('/hire',checkLogin);
	app.get('/hire',function(req,res){
		Cart.getNum(req.session.user,function(err,num){
		res.render('hire',{
			title:"我要兼职",
			num:num,
			user:req.session.user
		})
	});
		});

 	//app.get('/:shop/search') login
 	app.get('/shop/:boss/search',checkLogin);
 	app.get('/shop/:boss/search',function(req,res){
 		var page=req.query.page?parseInt(req.query.page):1;
 		Post.search(req.params.boss,req.query.keyword,page,function(err,posts){
 			if(err){
					req.flash('error',err);
					return res.redirect('back');	
				}
			res.render('shopsearch',{
				title:"Search:"+req.query.keyword,
				boss:boss,
				posts:posts,
				user:req.session.user,
				page:page
			});	
 		});
 	});

	//app.get('/cart') login
	app.get('/cart',checkLogin);
	app.get('/cart',function(req,res){
		var state=1;
		Cart.get(req.session.user,state,function(err,carts){
			if(err){
					return res.redirect('/index');			
				}
			Address.get(req.session.user,state,function(err,adds){
				if(err){
					return res.redirect('/index');			
				}
				Cart.getNum(req.session.user,function(err,num){
					if(err){
					return res.redirect('/index');			
				}
				res.render('cart',{
					'title':"我的购物车",
					user:req.session.user,
					carts:carts,
					adds:adds,
					num:num,
					success:req.flash('success').toString(),
					error:req.flash('error').toString()
				});
			});
		});
	});
});
	//app.post('/cart') login
	app.post('/cart',checkLogin);
	app.post('/cart',function(req,res){
		var pid=parseInt(req.body.pid);
		Post.get(pid,function(err,post){
			if(err){
					return res.redirect('/index');			
				}
			var amount=0;
			var cart=new Cart({
				"pid":pid,
				"price":post.price,
				"amount":amount,
				"buyer":req.session.user,
				"seller":post.boss,
				"pic":post.pic,
				"name":post.name
			});
			cart.save(function(err,carts){
				if(err){
					return res.redirect('/index');			
				}
				if(carts){
					res.json({success:2});
					}
				res.json({success:1});	
			});
		});
	});

	//app.post('/cart/modify') login
	app.post('/cart/modify',checkLogin);
	app.post('/cart/modify',function(req,res){
		var cid=parseInt(req.body.cid);
		var amount=parseInt(req.body.amount);
		Cart.modify(req.session.user,cid,amount,function(err,cart){

			if(err){
				return res.json({success:2});
			}
			res.json({success:1});
		});
	});

	//app.post('/cart/del') login
	app.post('/cart/del',checkLogin);
	app.post('/cart/del',function(req,res){
		var cid=parseInt(req.body.cid);
		Cart.del(req.session.user,cid,function(err,cart){

			if(cart){
				return res.json({success:1});
			}
			res.json({success:2});
		});
	});
 	
 	//app.post('/add') login
 	app.post('/address',checkLogin);
 	app.post('/address',function(req,res){
 		var ip=req.body.ip;
 		var who=req.body.who;
 		var phone=req.body.phone;
 		var address=new Address({
 			"name":req.session.user,
 			"ip":ip,
 			"who":who,
 			"phone":phone
 		});
 		address.save(function(err,address){
 			if(err){
 				return res.json({success:2});
 			}
 			res.json({success:1});
 		});
 	});

 	//app.post('/address/del') login
 	app.post('/address/del',checkLogin);
 	app.post('/address/del',function(req,res){
 		var aid=parseInt(req.body.aid);
 		Address.del(req.session.user,aid,function(err,adds){
 				 if(err){
		    	return  res.json({success:2});
		    }	
		    res.json({success:1});
 		});
 	});


 	//app.get('/order/:state') login
 	app.get('/order/:state',checkLogin);
 	app.get('/order/:state',function(req,res){
 		var state=req.params.state?parseInt(req.params.state):1;
 		var page=req.query.page?parseInt(req.query.page):1;
 		Cart.getNum(req.session.user,function(err,num){
 			if(err){
					return res.redirect('/index');			
				}
 			Order.getTen(req.session.user,null,null,state,page,function(err,orders){
 				if(err){
					return res.redirect('/index');			
				}
 				User.getTotal(req.session.user,function(err,total){
 					if(err){
					return res.redirect('/index');			
				}
 					res.render('order',{
 						title:'订单查询',
 						user:req.session.user,
 						num:num,
 						orders:orders,
 						total:total,
 						state:state,
 						page:page,
 						length:orders.length,
						success:req.flash('success').toString(),
						error:req.flash('error').toString()
 					});
 				});
 			});
 		});
 	});


 	//app.get('/ordershop/:state') login
 	app.get('/ordershop/:state',checkLogin);
 	app.get('/ordershop/:state',function(req,res){
 		var state=req.params.state?parseInt(req.params.state):1;
 		var page=req.query.page?parseInt(req.query.page):1;
 		Cart.getNum(req.session.user,function(err,num){
 			if(err){
					return res.redirect('/index');			
				}
 			User.getrole(req.session.user,function(err,role){	
 			if(role==2){
 			Order.getTen(null,req.session.user,null,state,page,function(err,orders){
 				if(err){
					return res.redirect('/index');			
				}
 				User.getTotal(req.session.user,function(err,total){
 					if(err){
					return res.redirect('/index');			
				}
 					res.render('ordershop',{
 						title:'订单查询',
 						user:req.session.user,
 						num:num,
 						orders:orders,
 						total:total,
 						state:state,
 						page:page,
 						length:orders.length,
						success:req.flash('success').toString(),
						error:req.flash('error').toString()
 					});
 				});
 			});
 		}
 	else{	
 			req.flash('error',"权限不够");
	 		res.render('ordershop',{
	 			title:'订单查询－权限',
	 			user:req.session.user,
	 			num:num,
	 			error:req.flash('error').toString()
	 		});
 		}
 		});
 	
 	});
});
 	//app.post('/order') login
 	app.post('/order',checkLogin);
 	app.post('/order',function(req,res){
 		var ip=req.body.ip;
		var who=req.body.who;
		var phone=req.body.phone;
		var state=1;
		Cart.get(req.session.user,state,function(err,carts){
			if(err){
					return res.redirect('/index');			
				}
			Order.save(carts,ip,who,phone,function(err,doc){
				if(err){
					return res.redirect('/index');			
				}
				Post.sold(carts,function(err,post){
					if(err){
					return res.redirect('/index');			
				}
				Cart.delall(req.session.user,function(err,user){
					if(err){
					return res.redirect('/index');			
				}
					User.total(req.session.user,carts,function(err,total){
						if(err){
					return res.redirect('/index');			
				}
						res.json({success:1});
					});
				});
			});
			});
		});
 	});

 	//app.post('orderprocess') login

	app.post('/orderprocess',checkLogin);
	app.post('/orderprocess',function(req,res){
		var oid=req.body.oid;
		Order.getOne(oid,req.session.user,function(err,ostate){
			if(err){
					return res.redirect('/index');			
				}
			if(ostate>0 && ostate<5){
				console.log(ostate);
				Order.process(oid,req.session.user,function(err,backstate){

					res.json({state:backstate});

				});


			}
			else{
				res.json({state:ostate});
			}

		});

		

	});

	//app.post('orderback') login

	app.post('/orderback',checkLogin);
	app.post('/orderback',function(req,res){
		var oid=req.body.oid;
		Order.getOne(oid,req.session.user,function(err,ostate){
			if(err){
					return res.redirect('/index');			
				}
			if(ostate==6){
				console.log(ostate);
				Order.back(oid,req.session.user,function(err,backstate){

					res.json({state:backstate});

				});


			}
			else{
				res.json({state:ostate});
			}

		});

		

	});

	//app.post('/ordertrash') login
	app.post('/ordertrash',checkLogin);
	app.post('/ordertrash',function(req,res){
		var oid=req.body.oid;
		Order.getOne(oid,req.session.user,function(err,ostate){
			if(err){
					return res.redirect('/index');			
				}
			if(ostate>0 && ostate<3){

				Order.trash(oid,req.session.user,function(err,backstate){

					res.json({state:backstate});

				});


			}
			else{

				res.json({state:ostate});

			}

		});

	});

	//app.post('/orderdetail') login to buyer
	app.post('/orderdetail',checkLogin);
	app.post('/orderdetail',function(req,res){
		var oid=req.body.oid;
		Order.getDetail(oid,req.session.user,function(err,order){
			if(err){
					return res.redirect('/index');			
				}
			User.contactShop(order.seller,function(err,contact){
				if(err){
					return res.redirect('/index');			
				}
				res.json({
					seller:order.seller,
					contact:contact
				});

			});

		});
	});

	//app.post('/orderwho') login to seller
	app.post('/orderwho',checkLogin);
	app.post('/orderwho',function(req,res){
		var oid=req.body.oid;
		Order.getDetail(oid,req.session.user,function(err,order){
			if(err){
					return res.redirect('/index');			
				}
	
				res.json({
					ip:order.ip,
					who:order.who,
					phone:order.phone	
								});

		});
	});

	//app.get('/postshop') login
	app.get('/postshop/:state',checkLogin);
	app.get('/postshop/:state',function(req,res){
		var state=req.params.state?parseInt(req.params.state):1;
		Cart.getNum(req.session.user,function(err,num){
			User.getrole(req.session.user,function(err,role){
			if(err){
					return res.redirect('/index');			
				}
			if(role==2){
		var page=req.query.page?parseInt(req.query.page):1;
		
			if(err){
					return res.redirect('/index');			
				}
		Post.getTen(req.session.user,null,null,null,state,page,function(err,posts){
			if(err){
					return res.redirect('/index');			
				}
			res.render('postshop',{
 						title:'商品管理',
 						user:req.session.user,
 						posts:posts,
 						num:num,
 						page:page,
 						state:state,
 						length:posts.length,
						success:req.flash('success').toString(),
						error:req.flash('error').toString()
 					});
		
		});
	}else{
			req.flash('error',"权限不够");
	 		res.render('postshop',{
	 			title:'订单查询－权限',
	 			user:req.session.user,
	 			num:num,
	 			error:req.flash('error').toString()
	 		});

	}
});
});
	});

	//app.get('/poshop') login
	app.get('/poshop',checkLogin);
	app.get('/poshop',function(req,res){
		User.getrole(req.session.user,function(err,role){
			if(err){
					return res.redirect('/index');			
				}
			if(role==2){
		Cart.getNum(req.session.user,function(err,num){
			if(err){
					return res.redirect('/index');			
				}
			res.render('poshop',{
 						title:'商品管理',
 						user:req.session.user,
 						num:num,
						success:req.flash('success').toString(),
						error:req.flash('error').toString()
 					});
		});
	
	}else{
			req.flash('error',"权限不够");
	 		res.render('poshop',{
	 			title:'订单查询－权限',
	 			user:req.session.user,
	 			error:req.flash('error').toString()
	 		});

	}
});

	});

	//app.post('/poshop') login
	app.post('/poshop',checkLogin);
	app.post('/poshop',function(req,res){
		User.getrole(req.session.user,function(err,role){
			if(err){
					return res.redirect('/index');			
				}
			if(role==2){
			var tmp_path=req.files.pic.path;
			var target_path="./public/uploads/"+req.session.user+"/"+req.files.pic.name;
			var req_path="/uploads/"+req.session.user+"/"+req.files.pic.name;
			fs.rename(tmp_path,target_path,function(err){
			if(err) throw err;
			fs.unlink(tmp_path,function(){
				if(err) throw err;
				var post=new Post({
						name:req.body.title,
						boss:req.session.user,
						pic:req_path,
						price:req.body.price,
						iprice:req.body.iprice,
						desp:req.body.desp,
						ldesp:req.body.ldesp,
						fbrand:req.body.fbrand,
						mbrand:req.body.mbrand,
						lbrand:req.body.lbrand,
						state:parseInt(req.body.state)
					});
				post.save(function(err){
				if(err){req.flash('error',err);
				return res.redirect('/');}	
				req.flash('success','发布成功');
				res.redirect('/poshop');
			});
			});
		});
	
	}else{
				req.flash('error','权限不足');
					res.redirect('/poshop');
	}
});


	});


	//app.post('/postdown') login
	app.post('/postdown',checkLogin);
	app.post('/postdown',function(req,res){
		var pid=parseInt(req.body.pid);
		Post.down(req.session.user,pid,function(err,post){
			if(err){
					return res.redirect('/index');			
				}
			res.json({success:1});
		});
	});

	//app.post('/posthot') login
	app.post('/posthot',checkLogin);
	app.post('/posthot',function(req,res){
		var pid=parseInt(req.body.pid);
		Post.hot(req.session.user,pid,function(err,post){
			if(err){
					return res.redirect('/index');			
				}
			res.json({success:1});
		});
	});

	//app.post('/postpo') login
	app.post('/postpo',checkLogin);
	app.post('/postpo',function(req,res){
		var pid=parseInt(req.body.pid);
		Post.po(req.session.user,pid,function(err,post){
			if(err){
					return res.redirect('/index');			
				}
			res.json({success:1});
		});
	});

	//app.get('/postupdate') login
	app.get('/postupdate/:pid',checkLogin);
	app.get('/postupdate/:pid',function(req,res){



	});


 	//app.get('/search') login
 	app.get('/search',checkLogin);
 	app.get('/search',function(req,res){
 		var page=req.query.page?parseInt(req.query.page):1;
 		Post.search(null,req.query.keyword,page,function(err,posts){
 			res.render('search',{
 				title:"Search:"+req.query+keyword,
 				posts:posts,
 				user:req.session.user,
 				page:page
 			});
 		})
 	});

 	//app.get('/p/pid') login
 	app.get('/p/:pid',checkLogin);
 	app.get('/p/:pid',function(req,res){
 		var pid=parseInt(req.params.pid);
 		var page = req.query.page?parseInt(req.query.page):1;
 		Post.getOne(pid,function(err,post){
 			if(err){
 				req.flash('error',err);
 				return res.redirect('/');
 			}
 			Cart.getNum(req.session.user,function(err,num){
 			Comment.get(pid,function(err,comments){
 				res.render('product',{
 					title:post.name,
 					post:post,
 					user:req.session.user,
 					page:page,
 					num:num,
 					comments:comments,
 					success: req.flash('success').toString(),
     				error: req.flash('error').toString()
 				});
 			});
 		});
 	});
 });		

 	

 	//app.post('/p/:pid') login
 	app.post('/p/:pid',checkLogin);
 	app.post('/p/:pid',function(req,res){
	var pid=parseInt(req.params.pid);
	var date = new Date(),
      time = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
	var comment=new Comment({
					"pid":pid,
					"name":req.body.name,
					"time":time,
					"content":req.body.content
				});
	comment.save(function(err){
		 if(err){
      				res.json({success:2});
    			}
	  	res.redirect('back');
		});
	});

 	//app.get('/beeasy') login
 	app.get('/beeasy',checkLogin);
 	app.get('/beeasy',function(req,res){
 		Cart.getNum(req.session.user,function(err,num){
 			User.getrole(req.session.user,function(err,role){
			if(err){
					return res.redirect('/index');			
				}
			if(role!=2){
		
			if(err){
					return res.redirect('/index');			
				}
			res.render('beeasy',{
 						title:'店铺申请',
 						user:req.session.user,
 						num:num,
						success:req.flash('success').toString(),
						error:req.flash('error').toString()
 					});
		
	
	}else{
			req.flash('error',"权限不够");
	 		res.render('beeasy',{
	 			title:'店铺申请',
	 			user:req.session.user,
	 			num:num,
	 			error:req.flash('error').toString()
	 		});

	}
});});
 	});

 	//app.post('/beeasy') login
 	app.post('/beeasy',checkLogin);
 	app.post('/beeasy',function(req,res){
 		User.getrole(req.session.user,function(err,role){
			if(err){
					return res.redirect('/index');			
				}
			if(role!=2){
			var tmp_path=req.files.pic.path;
			var target_path="./public/uploads/"+req.session.user+"/"+req.files.pic.name;
			var req_path="/uploads/"+req.session.user+"/"+req.files.pic.name;
			fs.rename(tmp_path,target_path,function(err){
			if(err) throw err;
			fs.unlink(tmp_path,function(){
				if(err) throw err;
				var shop={
						shopname:req.body.name,
						user:req.session.user,
						shoppic:req_path,
						contact:req.body.contact,
						email:req.body.email,
						whatsell:req.body.whatsell,
						shopdesp:req.body.desp
					};
				User.beeasy(shop,function(err){
				if(err){req.flash('error',err);
				return res.redirect('/');}	
				req.flash('success','您的信息已经进入审批流程，客服会主动联系您！');
				res.redirect('/beeasy');
			});
			});
		});
	
	}else{
				req.flash('error','您已经是老板了，亲');
					res.redirect('/beeasy');
	}
});

});


 	//app.get('/pay/:oid') login
 	app.get('/pay/:oid',checkLogin);
 	app.get('/pay/:oid',function(req,res){
 		var oid=parseInt(req.params.oid);
 		Cart.getNum(req.session.user,function(err,num){
 				if(err){req.flash('error',err);
				return res.redirect('/');}	
 		Order.getDetail(oid,req.session.user,function(err,order){
 				console.log(order);
 				if(err){req.flash('error',err);
				return res.redirect('/');}	
				User.payShop(req.session.user,function(err,payment){
					res.render('pay',{
						title:'付款界面',
						order:order,
						payment:payment,
						user:req.session.user,
						num:num
					});


				});

 		});
 	});
 	});




 	//app.get('/beeasyadmin') login
 	app.get('/beeasyadmin/:sstate',checkLogin);
 	app.get('/beeasyadmin/:sstate',function(req,res){
 		Cart.getNum(req.session.user,function(err,num){
 			User.getrole(req.session.user,function(err,role){
			if(err){
					return res.redirect('/index');			
				}
 		if(role==9)
 		{	
 			var sstate=req.params.sstate?parseInt(req.params.sstate):1;
 			var page=req.query.page?parseInt(req.query.page):1;
 			User.getAdminshop(sstate,page,function(err,shops){
				if(err){
					return res.redirect('/index');			
				}
					res.render('beeasyadmin',{
						title:'店铺申请管理界面',
						user:req.session.user,
						num:num,
						shops:shops,
						length:shops.length,
						page:page,
						success:req.flash('success').toString(),
						error:req.flash('error').toString()
					});
				});
 		}
 		else{
 			req.flash('error',"权限不够");
	 		res.render('beeasyadmin',{
	 			title:'店铺申请管理',
	 			user:req.session.user,
	 			num:num,
	 			error:req.flash('error').toString()
	 		});

 		}

 	});});});

 	//app.post('/shopclose') login
	app.post('/shopclose',checkLogin);
	app.post('/shopclose',function(req,res){
		var uid=parseInt(req.body.uid);
		var sstate=3;
		User.shopMod(uid,sstate,function(err,user){
			if(err){
					return res.redirect('/index');			
				}
			res.json({success:1});
		});
	});

	 	//app.post('/shopok') login
	app.post('/shopok',checkLogin);
	app.post('/shopok',function(req,res){
		var uid=parseInt(req.body.uid);
		var sstate=1;
		var role=2;
		User.shopok(uid,sstate,role,function(err,user){
			if(err){
					return res.redirect('/index');			
				}
			res.json({success:1});
		});
	});

	 	//app.post('/shopopen') login
	app.post('/shopopen',checkLogin);
	app.post('/shopopen',function(req,res){
		var uid=parseInt(req.body.uid);
		var sstate=1;
		User.shopMod(uid,sstate,function(err,user){
			if(err){
					return res.redirect('/index');			
				}
			res.json({success:1});
		});
	});


 	//app.get('/logout') login
 	app.get('/logout',checkLogin);
 	app.get('/logout',function(req,res){
 		req.session.user=null;
 		req.flash('success','登出成功');
 		res.redirect('/index');
 	});

 	//app.get('/ad') login
 	app.get('/about',checkLogin);
 	app.get('/about',function(req,res){
 		Cart.getNum(req.session.user,function(err,num){

 			res.render('about',{
 				title:"关于我们",
 				num:num,
 				user:req.session.user
 			});
 		});

 	});


//weixin get

app.get('/weixin',function(req,res){
var query=req.query;
var token='weixin';
console.log("signature:",query.signature);

if(auth(token,query.timestamp,query.nonce,query.signature)){

res.send(query.echostr);
console.log('auth passed!')

}
else{
console.log('auth failed!');
res.send('auth failed');

}


});


//weixin post



app.post('/weixin',function(req,res){
console.log(query);
var token='weixin';
console.log("signature:",query.signature);

if(auth(token,query.timestamp,query.nonce,query.signature)){

res.send(query.echostr);
console.log('auth passed!')
console.log(req.body.xml);

}
else{
console.log('auth failed!');
res.send('auth failed');

}


});

//modules.exports end
};

//checkLogin
function checkLogin(req,res,next){
	if(!req.session.user){
		req.flash('error','未登录');
		return res.redirect('/');
	}
	next();
}

//checkNotLogin
function checkNotLogin(req,res,next){
	if(req.session.user){
		req.flash('error','已登录');
		return res.redirect('/index');
	}
	next();
}	


function auth(token,timestamp,nonce,signature){
var arr=[];
arr.push(timestamp);
arr.push(nonce);
arr.push(token);


var d=crypto.createHash('sha1').update(arr.sort().join('').toString()).digest('hex');

if(d == signature)
{
return true;
}

else return false;

}