var mongodb=require('./db');

function Order(name,order){
this.name=name;
this.order=order;
}


module.exports=Order;


Order.prototype.save=function(callback){
	var name=this.name;
	var order=this.order;
	mongodb.open(function(err,db){
	
		if(err){ callback(err);}
		
		db.collection('users',function(err,collection){
		if(err){mongodb.close(); callback(err);}
		collection.findAndModify({"name":name},[],{$push:{"orders":order}},{new:true,upsert:true},
function(err,user){

mongodb.close();
callback(null,user.orders);


});
});
});
};

//get order
Order.get=function(name,callback){
	mongodb.open(function(err,db){
	if(err){callback(err);}
	
	db.collection('users',function(err,collection){
	if(err){mongodb.close();callback(err);}
	
	collection.findOne({"name":name},function(err,user){

			mongodb.close();
		if(user){
		callback(err,user.orders);
		console.log(user.orders);
		}else {
		callback(err,null);
		}
	});


	});
	
	});





};
