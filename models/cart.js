var mongodb=require('./db');

function Cart(cart){
this.buyer=cart.buyer;
this.seller=cart.seller;
this.pid=cart.pid;
this.amount=cart.amount;
this.price=cart.price;
this.pic=cart.pic;
this.name=cart.name;

}


module.exports=Cart;


Cart.prototype.save=function(callback){
	var cart={
		"buyer":this.buyer,
		"seller":this.seller,
		"pid":this.pid,
		"amount":this.amount,
		"price":this.price,
		"pic":this.pic,
		"name":this.name
	};
var date=new Date();
		
	var time={date:date,
		year:date.getFullYear(),
		month:date.getFullYear()+"-"+(date.getMonth()+1),
		day : date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate(),
		minute : date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes()
	};
	mongodb.open(function(err,db){
	
		if(err){callback(err);}
		db.collection('ids',function(err,collection){
	collection.findAndModify({"name":"cart"},[], {$inc:{'id':1}}, {new:true, upsert:true},function(err,doc){
		var newcart={
			"cid":doc.id,
			"pid":cart.pid,
			"name":cart.name,
			"pic":cart.pic,
			"amount":cart.amount,
			"buyer":cart.buyer,
			"seller":cart.seller,
			"state":1,
			"price":cart.price,
			"time":time
		}
		
		db.collection('carts',function(err,collection){
		if(err){mongodb.close();callback(err);}
	   collection.insert(newcart,{safe:true}
      , function (err,cart) {
          mongodb.close();
         callback(err,cart);
      });   


	});
});
});
});
};

//get cart

Cart.get=function(name,state,callback){
	mongodb.open(function(err,db){
	if(err){callback(err);}
		var query={};
	if(name){
		query.buyer=name;
	}
	if(state){
		query.state=state;
	}

	db.collection('carts',function(err,collection){
	if(err){mongodb.close();callback(err);}
	
	collection.find(query).sort({time:-1}).toArray(function(err,carts){

			mongodb.close();
		if(carts){
		
		callback(null,carts);

		}else {
		callback(err,null);
		}
	});


	});
	
	});

};



//remove cart

Cart.del=function(buyer,cid,callback){
	
	mongodb.open(function(err,db){
	if(err){callback(err);}
	
	db.collection('carts',function(err,collection){
	if(err){mongodb.close();callback(err);}
	
	collection.findAndModify({"buyer":buyer,"cid":cid},[],{$set:{"state":0}},{new:true,upsert:true},function(err,cart){
	mongodb.close();
		if(cart){
		callback(null,cart);
		}else {
		callback(err,null);
		}
	
	});



});
	
	});

};



//removeall cart

Cart.delall=function(name,callback){
	
	mongodb.open(function(err,db){
	if(err){callback(err);}
	
	db.collection('carts',function(err,collection){
	if(err){mongodb.close();callback(err);}
	
	collection.update({"buyer":name,"state":1},{$set:{"state":2}},{multi:true});
	mongodb.close();
		callback(null,1);
		
	
	});

	});

};

//cart number


Cart.getNum=function(name,callback){
	
	mongodb.open(function(err,db){
	if(err){callback(err);}
	
	db.collection('carts',function(err,collection){
	if(err){mongodb.close();callback(err);}
	
	collection.find({"buyer":name,"state":1}).count(function(err,number){

		console.log("very good");
		mongodb.close();
			callback(null,number);

	});

		
	
	});

	});

};





//add cart

Cart.modify=function(buyer,cid,amount,callback){
	
	mongodb.open(function(err,db){
	if(err){callback(err);}
	
	db.collection('carts',function(err,collection){
	if(err){mongodb.close();callback(err);}
	collection.findAndModify({"buyer":buyer,"cid":cid},[],{$inc:{"amount":amount}},{new:true,upsert:true},function(err,cart){
	mongodb.close();
		if(err){
		callback(err,null);
		}else {
		callback(null,cart);
		}
	});
	});
	});

};

//minus cart


//buy cart


Cart.buy=function(name,callback){
	
	var name=this.name;
	
	console.log(cart);
	mongodb.open(function(err,db){
	if(err){callback(err);}
	
	db.collection('users',function(err,collection){
	if(err){mongodb.close();callback(err);}
	
	collection.findAndModify({"name":name},[],{$set:{"carts.$.state":state}},{new:true,upsert:true},function(err,user){
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

