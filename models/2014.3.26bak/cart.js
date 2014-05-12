var mongodb=require('./db');

function Cart(name,cart){
this.name=name;
this.cart=cart;
}


module.exports=Cart;


Cart.prototype.save=function(callback){
	var name=this.name;
	var cart=this.cart;
	mongodb.open(function(err,db){
	
		if(err){callback(err);}
		
		db.collection('users',function(err,collection){
		if(err){mongodb.close();callback(err);}
		collection.findAndModify({"name":name},[],{$push:{"carts":cart}},{new:true,upsert:true},
function(err,user){

mongodb.close();
callback(null,user.carts);


});
});
});
};

//get cart

Cart.get=function(name,callback){
	mongodb.open(function(err,db){
	if(err){callback(err);}
	
	db.collection('users',function(err,collection){
	if(err){mongodb.close();callback(err);}
	
	collection.findOne({"name":name},function(err,user){

			mongodb.close();
		if(user){
		callback(err,user);
		}else {
		callback(err,null);
		}
	});


	});
	
	});





};
