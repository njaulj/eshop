var crypto = require('crypto');
var User = require('../models/user.js');
var fs=require('fs');
var Post=require('../models/post.js');

module.exports=function(app){
//index
	app.get('/',function(req,res){
		Post.get(null,function(err,posts){
		if(err){posts=[];}
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
		res.render('reg',{title:'注册',
		user:req.session.user,
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
		name:req.body.name,
		password:password,
		email:req.body.email
		});
		
		User.get(newUser.name,function(err,user){
		if (user){err='用户已存在';		
			}
		if(err){
			req.flash('error',err);
			return res.redirect('/reg');			
			}
		newUser.save(function(err){
			if(err){req.flash('error',err);
			return res.redirect('/reg');			
			}
			req.session.user=newUser;
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
			req.session.user=user;
			req.flash('success','登录成功');
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
	var currentUser=req.session.user;
	var tmp_path=req.files.pic.path;
	var target_path="./public/uploads/"+req.files.pic.name;
	var req_path="/uploads/"+req.files.pic.name;
	fs.rename(tmp_path,target_path,function(err){
	if(err) throw err;
	fs.unlink(tmp_path,function(){
	if(err) throw err;
	res.send('File uploaded to:'+target_path+'-'+req.files.pic.size+'bytes');	
	
	var post=new Post(currentUser.name,req.body.title,req_path,req.body.desp,req.body.price,req.body.sex);
	post.save(function(err){
	if(err){req.flash('error',err);return res.redirect('/');}	
	req.flash('success','发布成功');
	return res.redirect('/');
	});

	});
	

	});
	
	
	});


//list
	app.get('/list',checkLogin);
	app.get('/list',function(req,res){
		res.render('list',{title:'我的订单'});
	});
	app.post('/list',checkLogin);
	app.post('/list',function(req,res){

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
