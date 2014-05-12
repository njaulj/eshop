var crypto = require('crypto');
var User = require('../models/n_user.js');
var fs=require('fs');
var Post=require('../models/n_post.js');
var Address=require('../models/address.js');
var Cart=require('../models/cart.js');
var Order=require('../models/order.js');

module.exports=function(app){
//index
	app.get('/',function(req,res){
		Post.get(null,function(err,posts){
		if(err){posts=[];console.log(posts);}
		
		res.render('index',{
		title:'Express Iliujun',
		user:req.session.user,
		posts:posts,
		success:req.flash('success').toString(),
		error:req.flash('error').toString()

	});
	});
	});

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
		var password_re=req.body['password-repeat'];
		if(password_re != password){
			req.flash('error','两次输入的密码不一致');
			return res.redirect('/reg');		
		}
		var md5=crypto.createHash('md5');
		var password=md5.update(req.body.password).digest('hex');
		var newUser= new User({
		name:name,
		password:password
		});
		console.log(newUser.name);
		console.log(newUser.password);
		User.get(newUser.name,function(err,user){
		if (user){err='用户已存在';	
			console.log("already in it");	
			}
		if(err){
			console.log('something wrong');
			req.flash('error',err);
			return res.redirect('/reg');			
			}
		newUser.save(function(err){console.log("a");
			if(err){
console.log("b");req.flash('error',err);
			return res.redirect('/reg');			
			}
			req.session.user=newUser.name;
			req.flash('success','注册成功');
			res.redirect('/');
		
		});
		});

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
		var md5=crypto.createHash('md5');
		var password=md5.update(req.body.password).digest('hex');
		User.get(req.body.name,function(err,user){
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
			res.redirect('/');

			});

	});
//post
	app.get('/post',checkLogin);
	app.get('/post',function(req,res){
		res.render('post',{title:'商品发布'});
	});
	app.post('/post',checkLogin);
	app.post('/post',function(req,res){
	var tmp_path=req.files.pic.path;
	var target_path="./public/uploads/"+req.files.pic.name;
	var req_path="/uploads/"+req.files.pic.name;
	fs.rename(tmp_path,target_path,function(err){
	if(err) throw err;
	fs.unlink(tmp_path);
	});	
	var post=new Post(req.body.title,req_path,req.body.price,req.body.desp,req.body.sex);
	post.save(function(err){
	if(err){req.flash('error',err);return res.redirect('/');}	
	req.flash('success','发布成功');
	res.redirect('/');
	
	

	});
	
	
	});




//mm
	app.get('/mm',checkLogin);
	app.get('/mm',function(req,res){
		Post.get(null,function(err,posts){
		if(err){posts=[];}
		res.render('mm',{
		title:'女士专区',
		user:req.session.user,
		posts:posts,
		success:req.flash('success').toString(),
		error:req.flash('error').toString()

	});
	});
	
	});
	app.post('/mm',checkLogin);
	app.post('/mm',function(req,res){

	});

//man
	app.get('/man',checkLogin);
	app.get('/man',function(req,res){
		Post.get(null,function(err,posts){
		if(err){posts=[];}
		res.render('man',{
		title:'男士专区',
		user:req.session.user,
		posts:posts,
		success:req.flash('success').toString(),
		error:req.flash('error').toString()

	});
	});
	
	});
	app.post('/man',checkLogin);
	app.post('/man',function(req,res){

	});


//logout
	app.get('/logout',checkLogin);
	app.get('/logout',function(req,res){
		req.session.user=null;
		req.flash('success','登出成功');
		res.redirect('/');
		
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
	var address={"ip":ip,
			"who":who,
			"phone":phone};
	console.log(address.ip);


	var newAddress=new Address(req.session.user,address);
	console.log(newAddress);

	newAddress.save(function(err,adds){
		 if(!adds){
      req.flash('error',err); 
      res.redirect('/');
    }	
	console.log(adds);
	req.flash('success', '添加成功!');
    	res.redirect('back');
	});


});

//remove address



app.get('/d/:name', function(req,res){
  Address.remove(req.params.name, function(err, post){
    if(err){
      req.flash('error',err); 
      return res.redirect('/');
    }
	req.flash('success', '添加成功!');
    res.redirect('back');
  });
});

//order

	app.get('/order',checkLogin);
	app.get('/order',function(req,res){

	Order.get(req.session.user,function(err,orders){

	if(!orders){req.flash('error','用户不存在');
	 res.redirect('/');}
	res.render('order',{
		title:"您的订单",
		orders:orders,
		success:req.flash('success').toString(),
		error:req.flash('error').toString()
	});
});
});

	app.post('/order',checkLogin);
	app.post('/order',function(req,res){
	var pname=req.body.pname;
	var amount=req.body.amount;
	var address=req.body.address;
	var total=req.body.total;
	var time=new Date();
	var carttop={
		"pname":pname,
		"amount":amount
	};
	var order={     "cartop":carttop,
			"address":address,
			"total":total,
			"time":time};
	var newOrder=new Order(req.session.user,order);
	newOrder.save(function(err){

		 if(err){
      req.flash('error',err); 
      res.redirect('/');
    }
    res.json({user:'tobi'});
    res.redirect('back');


	});

});




//cart

	app.get('/cart',checkLogin);
	app.get('/cart',function(req,res){

	Cart.get(req.session.user,function(err,carts){

	if(!carts){req.flash('error','用户不存在');
	 res.redirect('/');}
	res.render('cart',{
		title:"购物车",
		carts:carts,
		success:req.flash('success').toString(),
		error:req.flash('error').toString()
	});
});
});


	

//search


app.get('/search', function(req,res){
  Post.search(req.query.keyword, function(err, posts){

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


//get one product

app.get('/p/:name', function(req,res){
  Post.getOne(req.params.name, function(err, post){
    if(err){
      req.flash('error',err); 
      return res.redirect('/');
    }
	console.log(post);
    res.render('product',{
      title: req.params.name,
      post: post,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});

//cart one product
app.post('/p/:name',function(req,res){
	var pname=req.params.pname;
	var amount=req.body.amount;
	var cart={"pname":pname,
			"amount":amount};
	console.log(cart.pname);
	var newCart=new Cart(req.session.user,cart);
	newCart.save(function(err){

		 if(err){
      req.flash('error',err); 
      res.redirect('/');
    }
    req.flash('success', '添加成功!');
    res.redirect('back');


	});

});


//end of this function
};

//checkuserlogin status
function checkLogin(req,res,next){
if(!req.session.user){
req.flash('error','未登录');
return res.redirect('/login');
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
