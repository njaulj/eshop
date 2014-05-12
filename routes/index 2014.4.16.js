var crypto = require('crypto');
var User = require('../models/user.js');
var fs=require('fs');
var Post=require('../models/post.js');
var Address=require('../models/address.js');
var Cart=require('../models/cart.js');
var Order=require('../models/order.js');
var Comment=require('../models/comment.js');
var Shop=require('../models/shop.js');

module.exports=function(app){
//ad

app.get('/ad',function(req,res){
		
		res.render('eoto',{
		title:'EasyOTO|关注互联网创业'
	});
		
	});
	
app.get('/new',checkLogin);
app.get('/new',function(req,res){
	Cart.getNum(req.session.user,function(err,num){
		var page = req.query.page?parseInt(req.query.page):1;
		var onsale=1;
		Post.getTen(null,null,null,null,onsale,page,function(err,posts){
		res.render('new',{
		title:'EasyOTO|关注互联网创业',
		user:req.session.user,
		posts:posts,
		num:num
	});
	});
		
		});
	});

//index
	app.get('/',checkLogin);
	app.get('/',function(req,res){
		var page = req.query.page?parseInt(req.query.page):1;
		var sstate=1;
		User.getallshop(sstate,page,function(err,shops){
		if(err){shops=[];console.log(shops);}
		
					if(page==1){
				   	console.log("1hao");
				    res.render('index',{
				      title: "EasyOTO|关注互联网创业",
				      shops:shops,
				      user: req.session.user,
				      success: req.flash('success').toString(),
				      error: req.flash('error').toString()
				    });
					}
		    else{
		    	console.log("2hao");
		    res.json({
		      shops:shops
		    });
			}
			});
			});

//shop/boss
/*
		app.get('/shop/:boss',function(req,res){
		Post.getBoss(req.params.boss,function(err,posts){
		if(err){posts=[];console.log(posts);}
		
		res.render('index',{
		title:'EasyOTO|boss',
		user:req.session.user,
		posts:posts,
		success:req.flash('success').toString(),
		error:req.flash('error').toString()

	});
	});
	});
*/

//reg
	app.get('/reg',checkNotLogin);
	app.get('/reg',function(req,res){
		res.render('reg',{
		title:'注册',
		success:req.flash('success').toString(),
		error:req.flash('error').toString()});
	});


	app.post('/reg',checkNotLogin);
	app.post('/reg',function(req,res){
		var name=req.body.name;
		var password=req.body.password;
		if(name && password){
		var md5=crypto.createHash('md5');
		var password=md5.update(req.body.password).digest('hex');
		var newUser= new User({
		"name":name,
		"password":password
		});
		console.log(newUser.name);
		console.log(newUser.password);
		User.get(newUser.name,function(err,user){
		if (user){
			err='用户已存在';	
			console.log("already in it");	
			}
		if(err){
			console.log('something wrong');
			req.flash('error',err);
			return res.redirect('/reg');			
			}
		newUser.save(function(err){
			console.log("a");
			if(err){
				req.flash('error',err);
			return res.redirect('/reg');			
			}
			req.session.user=newUser.name;
			req.flash('success','注册成功');
			res.redirect('/');
		
		});
		});
	}else {
		req.flash('error',"亲，可能忘记填了什么……！");
			return res.redirect('/reg');	
	}
	});

//login
	app.get('/login',checkNotLogin);
	app.get('/login',function(req,res){
		res.render('login',{title:'登录',
		user:req.session.user,
		success:req.flash('success').toString(),
		error:req.flash('error').toString()});
	});

	app.post('/login',checkNotLogin);
	app.post('/login',function(req,res){
		var name=req.body.name;
		var password=req.body.password;
		var boss=req.session.boss;
		if(name && password){
		var md5=crypto.createHash('md5');
		var password=md5.update(password).digest('hex');
		User.get(name,function(err,user){
			if (!user)
			{
				req.flash('error','用户不存在');
				return res.redirect('/login');	
			}
			if(user.password != password)
			{
				req.flash('error','密码错误！');
				return res.redirect('/login');	
			}
			req.session.user=user.name;
		//	req.flash('success','登录成功');

			res.redirect('/shop/'+boss);

			});
	}else{
		req.flash('error',"亲，可能忘记填了什么……！");
				return res.redirect('/login');	
	}
	});

	//open shop
	app.get('/openshop',checkLogin);
	app.get('/openshop',function(req,res){
		User.get(req.session.user,function(err,user){
		
			res.render('openshop',{
			title:'申请店铺',
			role:user.role,
			user:req.session.user,
			success:req.flash('success').toString(),
			error:req.flash('error').toString() 
	});
		});

	});

//post
	app.get('/post',checkLogin);
	app.get('/post',function(req,res){
		User.get(req.session.user,function(err,user){
		
			res.render('post',{
			title:'商品发布',
			role:user.role,
			user:req.session.user,
			success:req.flash('success').toString(),
			error:req.flash('error').toString() 
	});
		});

	});
	app.post('/post',checkLogin);
	app.post('/post',function(req,res){
	var tmp_path=req.files.pic.path;
	var target_path="./public/uploads/"+req.session.user+"/"+req.files.pic.name;
	var req_path="/uploads/"+req.session.user+"/"+req.files.pic.name;
	fs.rename(tmp_path,target_path,function(err){
	if(err) throw err;
	fs.unlink(tmp_path,function(){
		if(err) throw err;

		console.log(req.body.title);
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
		lbrand:req.body.lbrand
	});
	console.log(post);
		post.save(function(err){
		if(err){req.flash('error',err);return res.redirect('/');}	
		req.flash('success','发布成功');
		res.redirect('/post');
		
		

		});
	});
	});	
	
	
	
	});




//postad
	app.get('/postad',checkLogin);
	app.get('/postad',function(req,res){
		User.get(req.session.user,function(err,user){
		
			res.render('postad',{
			title:'广告位发布',
			role:user.role,
			user:req.session.user,
			success:req.flash('success').toString(),
			error:req.flash('error').toString() 
	});
		});

	});
	app.post('/postad',checkLogin);
	app.post('/postad',function(req,res){
	var tmp_path=req.files.pic.path;
	var target_path="./public/uploads/"+req.session.user+"/"+req.files.pic.name;
	var req_path="/uploads/"+req.session.user+"/"+req.files.pic.name;
	fs.rename(tmp_path,target_path,function(err){
	if(err) throw err;
	fs.unlink(tmp_path,function(){
		if(err) throw err;

	var post=new Post(req.body.title,req_path,req.body.price,req.body.brand,req.body.desp,req.body.ldesp,req.body.sex,req.session.user,req.body.show);
		post.save(function(err){
		if(err){req.flash('error',err);return res.redirect('/');}	
		req.flash('success','发布成功');
		res.redirect('/postad');
		
		

		});
	});
	});	
	
	
	
	});

/*

//mm
	app.get('/mm',checkLogin);
	app.get('/mm',function(req,res){
		var page = req.query.page?parseInt(req.query.page):1;
		Post.getTen(null,null,null,page,function(err,posts){
		if(err){posts=[];console.log(posts);}
		
		if(page==1){
   	console.log("1hao");
    res.render('mm',{
      title: "EasyOTO|关注互联网创业",
      posts:posts,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
	}
    else{
    	console.log("2hao");
    res.json({
      posts: posts
    });
	}
	});
	});


//man
	app.get('/man',checkLogin);
	app.get('/man',function(req,res){
	var page = req.query.page?parseInt(req.query.page):1;
		Post.getTen(null,null,null,page,function(err,posts){
		if(err){posts=[];console.log(posts);}
		
		if(page==1){
   	console.log("1hao");
    res.render('man',{
      title: "EasyOTO|关注互联网创业",
      posts:posts,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
	}
    else{
    	console.log("2hao");
    res.json({
      posts: posts
    });
	}
	});
	});

*/
//logout
	app.get('/logout',checkLogin);
	app.get('/logout',function(req,res){
		req.session.user=null;
		if(req.session.boss){
		boss=req.session.boss;
		req.flash('success','登出成功');
		res.redirect('/shop/'+boss);}
		else{
			req.flash('success','登出成功');
			res.redirect('/');}
		
		
	});

//address

	app.get('/address',checkLogin);
	app.get('/address',function(req,res){
	
	Address.get(req.session.user,function(err,adds){
		console.log(req.session.user);
	if(!adds){req.flash('error','用户不存在');
	 res.redirect('/');}
	res.render('address',{
		title:"收货地址",
		adds:adds,
		user:req.session.user,
		success:req.flash('success').toString(),
		error:req.flash('error').toString()
	});
});
});
	app.post('/address',checkLogin);
	app.post('/address',function(req,res){
	var ip=req.body.ip;
	var who=req.body.who;
	var phone=req.body.phone;
	var address=new Address({
			"name":req.session.user,
			"ip":ip,
			"who":who,
			"phone":phone});

	address.save(function(err,adds){
			 if(!adds){
      req.flash('error',err); 
      res.redirect('/');
    		}	
    		console.log(adds);
	res.json({success:1});
	});

});

//remove address
	app.post('/address/del',checkLogin);
	app.post('/address/del',function(req,res){
	var aid=parseInt(req.body.aid);

   console.log(aid);
	Address.del(aid,function(err,adds){
		 if(!adds){
      req.flash('error',err); 
      res.redirect('/');
    }	
	console.log("good");
	res.json({success:1});
	});

});
//admin

	app.get('/admin',checkLogin);
	app.get('/admin',function(req,res){
  //判断是否是第一页，并把请求的页数转换成 number 类型
  //查询并返回第 page 页的10篇文章
	User.get(req.session.user, function(err, users){
		
		    if(err){
		      req.flash('error',err); 
		      res.redirect('/');

		    } 
    res.render('admin',{
      title: '个人信息管理后台',
      user: req.session.user,
      users: users,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
});
});
//order process

app.post('/orderprocess',checkLogin);

app.post('/orderprocess',function(req,res){

	var oid=req.body.oid;

	Order.getOne(oid,function(err,ostate){
		if(ostate>0 && ostate<4){
			console.log(ostate);
			Order.process(oid,function(err,backstate){

				res.json({state:backstate});

			});


		}
		else{
			res.json({state:ostate});
		}

	});

	

});


//order trash

app.post('/ordertrash',checkLogin);

app.post('/ordertrash',function(req,res){

	var oid=req.body.oid;
	Order.getOne(oid,function(err,ostate){
		if(ostate>0 && ostate<3){

			Order.trash(oid,function(err,backstate){

				res.json({state:backstate});

			});


		}
		else{

			res.json({state:ostate});

		}

	});

});

//
//shopadmin
app.get('/shopadmin',checkLogin);
	app.get('/shopadmin',function(req,res){
  //判断是否是第一页，并把请求的页数转换成 number 类型
  //查询并返回第 page 页的10篇文章
  		var page = req.query.page?parseInt(req.query.page):1;
	User.get(req.session.user, function(err, users){
		if(users.role==2){
		Post.getBoss(req.session.user,function(err,posts){
		Order.getTen(null,req.session.user,null,null,page,function(err,orders){
			if(page==1){ 
				    if(err){
				      req.flash('error',err); 
				      res.redirect('/');

				    } 

		    	console.log(orders);
			    res.render('shopadmin',{
			      title: '店铺后台管理',
			      orders:orders,
			      posts:posts,
			      user: req.session.user,
			      users: users,
			      success: req.flash('success').toString(),
			      error: req.flash('error').toString()
			    });
			}
				else{
					res.json({orders:orders});
				}
		});
	});
	}
	else {

		req.flash('error',"您没有权限进入店铺管理后台");
	  res.render('shopadmin',{
      title: '用户管理',
      user: req.session.user,
      users: users,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });

	}
});

});

//post single boss admin

app.get('/postupdate/:pid',checkLogin);
	app.get('/postupdate/:pid',function(req,res){
		var pid=parseInt(req.params.pid);
	User.get(req.session.user, function(err, users){
		Post.get(pid,function(err,post){
		console.log(post);
		//验证是否当前登录的人是boss，而且是该件商品的发布者
		console.log(users.name);
		console.log(post.boss);
		if(users.role==2 && users.name==post.boss){
		
				    if(err){
				      req.flash('error',err); 
				      res.redirect('/');

				    } 

		    
			    res.render('postupdate',{
			      title: '商品后台管理',
			      post:post,
			      user: req.session.user,
			      users: users,
			      success: req.flash('success').toString(),
			      error: req.flash('error').toString()
			    });
		
	
	}
	else {

		req.flash('error',"您没有权限进入店铺管理后台");
	  res.render('postupdate',{
      title: '用户管理',
      user: req.session.user,
      users: users,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });

	}
});

});
});

//post update

app.post('/postupdate/:pid',checkLogin);
app.post('/postupdate/:pid',function(req,res){
	var pid=parseInt(req.params.pid);
	var show=parseInt(req.body.show);
	Post.get(pid,function(err,post){
		if(post.boss==req.session.user){




	var tmp_path=req.files.pic.path;
	var target_path="./public/uploads/"+req.session.user+"/"+req.files.pic.name;
	var req_path="/uploads/"+req.session.user+"/"+req.files.pic.name;
	fs.rename(tmp_path,target_path,function(err){
	if(err) throw err;
	fs.unlink(tmp_path,function(){
		if(err) throw err;

	
		Post.update(pid,req.body.title,req_path,req.body.price,req.body.iprice,req.body.desp,req.body.fbrand,req.body.mbrand,req.body.lbrand,show,function(err,succ){
		if(err){req.flash('error',err);
		return res.redirect('/');}	
		req.flash('success','发布成功');
		res.redirect('/postupdate');
		

		});
	});
	});	
		}
		else{		
				if(err){req.flash('error',err);
					return res.redirect('/');}	
					req.flash('error','发布失败');
					res.redirect('/postupdate');
			
		}

	});

});



app.get('/postadmin',checkLogin);
	app.get('/postadmin',function(req,res){
  		var page = req.query.page?parseInt(req.query.page):1;
	User.get(req.session.user, function(err, users){
		console.log(users);
		if(users.role==2){
		Post.getTen(req.session.user,null,null,null,page,function(err,posts){
			console.log(posts);
			if(page==1){ 
				    if(err){
				      req.flash('error',err); 
				      res.redirect('/');

				    } 

		    
			    res.render('postadmin',{
			      title: '商品后台管理',
			      posts:posts,
			      user: req.session.user,
			      users: users,
			      success: req.flash('success').toString(),
			      error: req.flash('error').toString()
			    });
			}
				else{
					res.json({posts:posts});
				}
	
	});
	}
	else {

		req.flash('error',"您没有权限进入店铺管理后台");
	  res.render('postadmin',{
      title: '用户管理',
      user: req.session.user,
      users: users,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });

	}
});

});



app.get('/testcart',function(req,res){

Cart.getNum(req.session.user,function(err,num){

		 res.render('test',{
      title: '用户管理',
      user: req.session.user,
      num: num,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });

});

});



app.get('/testshop',function(req,res){
	var page = req.query.page?parseInt(req.query.page):1;
User.getallshop(page,function(err,shops){

		res.render('test1',{
      title: '店铺管理',
      shops: shops,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });

});

});


app.get('/testuser',function(req,res){
	var page = req.query.page?parseInt(req.query.page):1;
User.getalluser(page,function(err,users){

		res.render('usermanage',{
      title: '人员管理',
      users: users,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });

});

});

app.get('/testuser1',checkLogin);
app.get('/testuser1',function(req,res){
	var name=req.session.user;
	
User.getsingleuser(name,function(err,users){

		res.render('singuser',{
      title: '人员管理',
      users: users,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });

});

});


app.get('/searchuser',checkLogin);
app.get('/searchuser',function(req,res){	
User.search(req.query.name,function(err,users){

		res.render('searchuser',{
      title: '人员管理',
      users: users,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });

});
});

app.post('/changePass',checkLogin);
app.post('/changePass',function(req,res){	
	var md5=crypto.createHash('md5');
	var password=md5.update(req.body.newPass).digest('hex');
User.changePass(req.session.user,password,function(err,users){
		req.flash('success',"成功");
		res.render('changePass',{
      title: '密码修改',
      users: users,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });

});
});

//order

	app.get('/order',checkLogin);
	app.get('/order',function(req,res){
		var buyer=req.session.user;
		var page = req.query.page?parseInt(req.query.page):1;
			Order.getTen(buyer,null,null,null,page,function(err,orders){
				User.total(buyer,null,null,function(err,total){
				 		if(page==1){ 
				 		
			    		    if(err){
			   
			      req.flash('error',err); 
			      return res.redirect('/');}


			    
			   	console.log("1hao");
			    res.render('order',{
			      title: "EasyOTO|开放平台",
			      orders:orders,
			      total:total,
			      user: req.session.user,
			      success: req.flash('success').toString(),
			      error: req.flash('error').toString()
			    });
		
				}
			    else{
			    	console.log("2hao");
			    res.json({
			      orders: orders
			    });}

			});
	 	});



	});

/*
	app.get('/order',function(req,res){
	Post.get(null,function(err,posts){
	User.get(req.session.user,function(err,users){

	if(!users){req.flash('error','用户不存在');
	 res.redirect('/');}
	res.render('order1',{
		title:"您的订单",
		posts:posts,
		user:req.session.user,
		orders:users.orders,
		success:req.flash('success').toString(),
		error:req.flash('error').toString()
	});
});
});
});
*/
//post order
app.post('/order',checkLogin);
app.post('/order',function(req,res){
	var ip=req.body.ip;
	var who=req.body.who;
	var phone=req.body.phone;

	Cart.get(req.session.user,function(err,carts){

	Post.getcart(carts,function(err,posts){

	Order.save(carts,ip,who,phone,posts,function(err,doc){


			Cart.delall(req.session.user,function(err,user){
				User.total(req.session.user,carts,posts,function(err,total){
			
						Post.sold(carts,function(err,psold){
			
					
							console.log("success");
					res.json({success:1});
					

						});
						
						});
							});
});
});

});
});

/*
	app.post('/order',checkLogin);
	app.post('/order',function(req,res){
	var ip=req.body.ip;
	var who=req.body.who;
	var phone=req.body.phone;
	var total=req.body.total;
	var state="卖家处理中";
	var adds={
		"ip":ip,
	"who":who,
	"phone":phone
};
	
	User.get(req.session.user,function(err,users){	
		var date=new Date();
		
var time={date:date,
	year:date.getFullYear(),
	month:date.getFullYear()+"-"+(date.getMonth()+1),
	day : date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate(),
	minute : date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes()
};

		req.session.user=users.name;	
		console.log(users.carts);
		console.log(users.name);
		var aorder={
			"adds":adds,
			"carts":users.carts,
			"time":time,
			"total":total,
			"state":state
			};
	
	var newOrder=new Order(req.session.user,aorder
);

	newOrder.save(function(err,users){
		 if(err){
      req.flash('error',err); 
      res.redirect('/');
    }	
	Cart.delall(req.session.user,function(err,user){
			if(err){
				req.flash('error',err); 
      			res.redirect('back');
			}
			console.log("good");
		res.json({success:1});

	});
	
		
		
		});
	});
	
});
//

*/
app.get('/getcart',function(req,res){
	var boss=req.session.boss;
	Cart.get(req.session.user,function(err,carts){
		Post.getcart(carts,function(err,posts){

			console.log(posts);
			res.render('test',{
		title:"购物车",
		posts:posts,
		success:req.flash('success').toString(),
		error:req.flash('error').toString()
});



		});

});
});

//cart

	app.get('/cart',checkLogin);
	app.get('/cart',function(req,res){
	
		Cart.get(req.session.user,function(err,carts){
			Post.getcart(carts,function(err,posts){
				Address.get(req.session.user,function(err,adds){
			
	if(err){
		req.flash('error','用户不存在');
	 res.redirect('/');}

	res.render('cart',{
		title:"购物车",
		user:req.session.user,
		posts:posts,
		carts:carts,
		adds:adds,
		success:req.flash('success').toString(),
		error:req.flash('error').toString()
			});
});});
	});
});

	//app.post('/cart',checkLogin);
	app.post('/cart',function(req,res){
	var amount=req.body.amount;
	var pid=req.body.pid;
	var seller=req.body.seller;
	//是否考虑编入图片，单价等信息呢？
	if(req.session.user){
	var cart=new Cart({
		"buyer":req.session.user,
		"seller":seller,
		"pid":pid,
		"amount":amount
		});


	cart.save(function(err,carts){
		 if(!carts){
      req.flash('error',err); 
      res.redirect('/');
    		}	
	res.json({success:1});
	});


}else{

	res.json({success:2});
}

});
//remove cart
	app.post('/cart/del',checkLogin);
	app.post('/cart/del',function(req,res){
	var cid=parseInt(req.body.cid);
	console.log(cid);
	Cart.del(cid,function(err,carts){
		 if(err){
      req.flash('error',err); 
      res.redirect('/');
    }	
	console.log("good");
	res.json({success:1});
	});

});
	


//modify cart

	app.post('/cart/modify',checkLogin);
	app.post('/cart/modify',function(req,res){
	var cid=parseInt(req.body.cid);
	var amount=parseInt(req.body.amount);
	console.log(cid);
	console.log(amount);

		Cart.modify(cid,amount,function(err,user){
			 if(err){
			 	console.log("wrong");
	      req.flash('error',err); 
	      res.redirect('/');
	   			 }	
		console.log("good");
		res.json({success:1});
	});

});


//buy cart
/*
	app.post('/cart/buy',checkLogin);
	app.post('/cart/buy',function(req,res){
	var state="buy";
	var cart={"state":state};
	
	var newCart=Cart(req.session.user,cart);
	console.log(newCart);
	newCart.buy(function(err,carts){
		 if(!carts){
      req.flash('error',err); 
      res.redirect('/');
    }	
	console.log("good");
	res.send({success:"ok"});
	});

});	
*/
//search


app.get('/search', function(req,res){
  Post.search(req.query.boss,req.query.keyword, function(err, posts){

    if(err){
      req.flash('error',err); 
      return res.redirect('/');
    }
	console.log(posts);
    res.render('search',{
      title: "SEARCH:"+req.query.keyword,
      posts: posts,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});

//get one shop
app.get('/shop/:boss', function(req,res){
	var boss=req.params.boss;
	var page = req.query.page?parseInt(req.query.page):1;
	var onsale=1;
  Post.getTen(boss,null,null,null,onsale,page,function(err, posts){
    if(err){
   
      req.flash('error',err); 
      return res.redirect('/');
    }


   	console.log(boss);
   if(page==1){ 
   	User.getsingleshop(boss,function(err,shop){
   		Post.getBrand(boss,function(err,brands){
   			Post.getAd(boss,function(err,ads){
   				User.pvAdd(boss,function(err,pv){
   					Cart.getNum(req.session.user,function(err,num){
    		    if(err){
   
      req.flash('error',err); 
      return res.redirect('/');}

      req.session.boss=boss;
    
   	console.log("1hao");
    res.render('shop',{
      title: "欢迎光临"+boss+"的小店",
      posts:posts,
      boss:boss,
      ads:ads,
      num:num,
      shopname:shop.shopname,
      brands:brands,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
});
});
   			});
   		});
   });
	}
    else{
    	console.log("2hao");
    res.json({
      posts: posts
    });}
  });
});


//get one brand of shop
app.get('/shop/:boss/fbrand/:fbrand', function(req,res){
	var boss=req.params.boss;
	var fbrand=req.params.fbrand;
	var state=1;
	var page = req.query.page?parseInt(req.query.page):1;
  Post.getTen(boss,fbrand,null,null,state,page,function(err, post){
    if(err){
   
      req.flash('error',err); 
      return res.redirect('/');
    }

   	console.log(boss);
   if(page==1){
   	User.getsingleshop(boss,function(err,shop){
   	  	Post.getBrand(boss,function(err,brands){
   	  		Post.getAd(boss,function(err,ads){
    		    if(err){
   		
      req.flash('error',err); 
      return res.redirect('/');}
      req.session.boss=boss;
      
   	console.log("1hao");
    res.render('brand',{
      title: "欢迎光临"+boss+"的小店",
      posts:post,
      ads:ads,
      boss:boss,
      shopname:shop.shopname,
      brands:brands,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
});
   	  	});
   	  	});
}
    else{
    	console.log("2hao");
    res.json({
      posts: post
    });}
  });
});

app.get('/shop/:boss/fbrand/:fbrand/mbrand/:mbrand', function(req,res){
	var boss=req.params.boss;
	var fbrand=req.params.fbrand;
	var mbrand=req.params.mbrand;
	var state=1;
	var page = req.query.page?parseInt(req.query.page):1;
  Post.getTen(boss,fbrand,mbrand,null,state,page,function(err, post){
    if(err){
   
      req.flash('error',err); 
      return res.redirect('/');
    }

   	console.log(boss);
   	  	
   if(page==1){
   	User.getsingleshop(boss,function(err,shop){
   	Post.getBrand(boss,function(err,brands){
   		Post.getAd(boss,function(err,ads){
    		    if(err){
   
      req.flash('error',err); 
      return res.redirect('/');}
      req.session.boss=boss;
   	console.log("1hao");
    res.render('brand',{
      title: "欢迎光临"+boss+"的小店",
      posts:post,
      boss:boss,
      ads:ads,
      shopname:shop.shopname,
      brands:brands,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
});
   	});
   	});
}
    else{
    	console.log("2hao");
    res.json({
      posts: post
    });}
  });
});



app.get('/shop/:boss/fbrand/:fbrand/mbrand/:mbrand/lbrand/:lbrand', function(req,res){
	var boss=req.params.boss;
	var fbrand=req.params.fbrand;
	var mbrand=req.params.mbrand;
	var lbrand=req.params.lbrand;
	var state=1;
	var page = req.query.page?parseInt(req.query.page):1;
  Post.getTen(boss,fbrand,mbrand,lbrand,state,page,function(err, post){
    if(err){
   
      req.flash('error',err); 
      return res.redirect('/');
    }


   	console.log(boss);
   if(page==1){
   	User.getsingleshop(boss,function(err,shop){
   	  	Post.getBrand(boss,function(err,brands){
   	  		Post.getAd(boss,function(err,ads){
    		    if(err){
   
      req.flash('error',err); 
      return res.redirect('/');}

    req.session.boss=boss;
   	console.log("1hao");
    res.render('brand',{
      title: "欢迎光临"+boss+"的小店",
      posts:post,
      boss:boss,
      ads:ads,
      shopname:shop.shopname,
      brands:brands,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
});
   	  	});
   	  	});
}
    else{
    	console.log("2hao");
    res.json({
      posts: post
    });}
  });
});
/*
app.get('/shop/:boss', function(req,res){
	var boss=req.params.boss;
	var page = req.query.page?parseInt(req.query.page):1;
  Post.getTen(boss,page,function(err, post){
    if(err){
   
      req.flash('error',err); 
      return res.redirect('/');
    }

   	req.session.boss=boss;
   	console.log(boss);
   	if(page==1){
    res.render('shop',{
      title: req.params.boss,
      posts:post,
      boss:req.session.boss,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });}
    else{
    res.json({
      posts: post
    });}
  });
});
*/

//get one product

app.get('/p/:pid', function(req,res){
	var pid=parseInt(req.params.pid);
	var page = req.query.page?parseInt(req.query.page):1;
	console.log(pid);
  Post.getOne(pid, function(err, post){
    if(err){
   
      req.flash('error',err); 
      return res.redirect('/');
    }

  	Comment.getTen(pid,page,function(err,comments){
  		if(page==1){
  		
  			Post.getBrand(post.boss,function(err,brands){
   	console.log("1hao");  
   	res.render('product',{
      title: post.name,
      post: post,
      brands:brands,
      comments:comments,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
		});
 
    }
    else{
    	console.log("2hao");
    res.json({
      comments: comments
    });}

  	});
 
  });
});

//comment one product
app.post('/p/:pid',function(req,res){
	var pid=parseInt(req.params.pid);
	var date = new Date(),
      time = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();

	var comment=new Comment({"pid":pid,
					"name":req.body.name,
					"time":time,
					"content":req.body.content
				});
	comment.save(function(err){

		 if(err){
      req.flash('error',err); 
      res.redirect('/');
    }
  	console.log("comment success");
    res.redirect('back');


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

//404

//end of this function
};

//checkuserlogin status
function checkLogin(req,res,next){
if(!req.session.user){
req.flash('error','未登录');
return res.redirect('/ad');
}
next();
}


function checkNotLogin(req,res,next){
if(req.session.user){
req.flash('error','已登录');
return res.redirect('/');
}
next();
}



//auth


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


//processmessage

function processMessage(data,response){

var ToUserName="";
var FromUserName="";
var CreateTime="";
var MsgType="";
var Content="";
var Location_X="";
var Location_Y="";
var Scale=1;
var Label="";
var PicUrl="";
var FuncFlag="";

var tempName="";






}



