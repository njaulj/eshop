var mongodb=require('./db');
var PPost=require('./post');

function Order(name,order){
this.name=name;
this.order=order;
}


module.exports=Order;

//get ten order

Order.getTen=function(buyer,seller,pid,state,page,callback){
mongodb.open(function(err,db){

if(err){

return callback(err);
}

db.collection('orders',function(err,collection){
  if(err){mongodb.close();
    return callback(err);}
 	var query={};
 	if(buyer){
 		query.buyer=buyer;
 	}
 	if(seller){
 		query.seller=seller;
 	}
 	if(pid){
 		query.pid=pid;
 	}
 	if(state){

 		query.state=state;
 	}

  collection.find(query,{skip:(page-1)*9,limit:9}).sort({
    
oid:-1}).toArray(function(err,orders){
  mongodb.close();
  console.log("haha");
  callback(err,orders);


  });

});


});


};
//Order Process
Order.process=function(oid,seller,callback){
mongodb.open(function(err,db){

if(err){

return callback(err);
}

db.collection('orders',function(err,collection){

				if(err){
					mongodb.close();
			    return callback(err);
			}
			var ooid=parseInt(oid);

    collection.findAndModify({"oid":ooid,"seller":seller},[],{$inc:{"state":1}},{new:true,upsert:true},function(err,order){

				  	mongodb.close();
				  	console.log(order);
				    callback(null,order.state);

    });

  

});
});
};


//Order back
Order.back=function(oid,seller,callback){
mongodb.open(function(err,db){

if(err){

return callback(err);
}

db.collection('orders',function(err,collection){

				if(err){
					mongodb.close();
			    return callback(err);
			}
			var ooid=parseInt(oid);

    collection.findAndModify({"oid":ooid,"seller":seller},[],{$set:{"state":1}},{new:true,upsert:true},function(err,order){

				  	mongodb.close();
				  	console.log(order);
				    callback(null,order.state);

    });

  

});
});
};
//order trash

Order.trash=function(oid,seller,callback){
mongodb.open(function(err,db){

if(err){

return callback(err);
}

db.collection('orders',function(err,collection){

				if(err){
					mongodb.close();
			    return callback(err);
			}
			var ooid=parseInt(oid);

    collection.findAndModify({"oid":ooid,"seller":seller},[],{$set:{"state":6}},{new:true,upsert:true},function(err,order){

				  	mongodb.close();
				  	console.log(order.state);
				    callback(null,order.state);

    });

  

});
});
};



//get order

Order.getOne=function(oid,name,callback){
	mongodb.open(function(err,db){
	if(err){callback(err);}
	
	db.collection('orders',function(err,collection){
	if(err){mongodb.close();callback(err);}
	var ooid=parseInt(oid);
	console.log(ooid);
	collection.findOne({$or:[{"oid":ooid,"seller":name},{"oid":ooid,"buyer":name}]},function(err,order){

			mongodb.close();
		if(order){
		callback(err,order.state);
		}else {
		callback(err,null);
		}
	});


	});
	
	});


};

//get order detail

Order.getDetail=function(oid,name,callback){
	mongodb.open(function(err,db){
	if(err){callback(err);}
	
	db.collection('orders',function(err,collection){
	if(err){mongodb.close();callback(err);}
	var ooid=parseInt(oid);
	console.log(ooid);
	collection.findOne({$or:[{"oid":ooid,"seller":name},{"oid":ooid,"buyer":name}]},function(err,order){

			mongodb.close();
		if(order){
			console.log(order);
		callback(err,order);

		}else {
		callback(err,null);
		}
	});


	});
	
	});


};
//order shop
//save order
//get order total

Order.getTotal=function(buyer,callback){



};

//
Order.save=function(carts,ip,who,phone,callback){
	console.log(carts[0].pid);
	mongodb.open(function(err,db){
	
		if(err){callback(err);}
		
		db.collection('ids',function(err,collection){
			if(err){
				mongodb.close();
				console.log("wrong");
				callback(err,null);
			}

			collection.findOne({"name":"order"},function(err,doc){
				var id=parseInt(doc.id);
				console.log(id);
				collection.update({"name":"order"},{$inc:{'id':carts.length}});

		db.collection('orders',function(err,collection){

			var date=new Date();
				
			var time={date:date,
				year:date.getFullYear(),
				month:date.getFullYear()+"-"+(date.getMonth()+1),
				day : date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate(),
				minute : date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes()
			};
			carts.forEach(function(cart,index){

					id=id+1;
											var order={
														"oid":id,
														"pid":cart.pid,
														"pic":cart.pic,
														"name":cart.name,
														"price":cart.price,
														"buyer":cart.buyer,
														"seller":cart.seller,
														"ip":ip,
														"who":who,
														"phone":phone,
														"amount":cart.amount,
														"state":1,
														"time":time
													};	
							collection.insert(order);
							console.log("gggg");
					

			});

		mongodb.close();
		callback(null,1);

});
					});
		
	});

});
};

//get ten

/*
Order.getTen=function(name,page,callback){
	mongodb.open(function(err,db){
	if(err){callback(err);}
	
	db.collection('users',function(err,collection){

	 if (err) {
        mongodb.close();
        return callback(err);
      }

	var query={};
	collection.find(query,{skip:(page-1)*10,limit:10}).sort({
        uid: -1
      }).toArray(function (err, users) {
        mongodb.close();
        if (err) {
          callback(err, null);//失败！返回 null
        }

	 callback(null, users);
	});


	});
	
	});

};*/