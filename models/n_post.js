var mongodb=require('./db');
var markdown = require('markdown').markdown;

function Post(name,pic,price,brand,desp,ldesp,sex,boss,show){
	this.name=name;
	this.pic=pic;
	this.price=price;
	this.brand=brand;
	this.desp=desp;
	this.ldesp=ldesp;
	this.sex=sex;
	this.boss=boss;
	this.show=show;
}

module.exports=Post;

//save post start
Post.prototype.save=function(callback){

var date=new Date();

var time={date:date,
	year:date.getFullYear(),
	month:date.getFullYear()+"-"+(date.getMonth()+1),
	day : date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate(),
	minute : date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes()
};

var post={
"name":this.name,
"pic":this.pic,
"price":this.price,
"brand":this.brand,
"desp":this.desp,
"ldesp":this.ldesp,
"sex":this.sex,
"boss":this.boss,
"show":this.show,
"time":time,
"sold":0,
"pv":0,
"comments":[],
"onsale":1,
};

mongodb.open(function(err,db){
if(err){return callback(err);}

db.collection('ids',function(err,collection){
	collection.findAndModify({"name":"product"},[], {$inc:{'id':1}}, {new:true, upsert:true},function(err,doc){
	db.collection('posts',function(err,collection){
		if(err){mongodb.close();
			return callback(err);}
			console.log("ceshi"+doc.id);
			var newpost={"pid":doc.id,
			"name":post.name,
			"pic":post.pic,
			"price":post.price,
			"brand":post.brand,
			"desp":post.desp,
			"ldesp":post.ldesp,
			"sex":post.sex,
			"boss":post.boss,
			"show":post.show,
			"time":post.time,
			"pv":post.pv,
			"sold":post.sold,
			"onsale":post.onsale,
			"comments":post.comments};
		collection.insert(newpost,{safe:true},function(err,post){

	mongodb.close();
	callback(err,post);

	});


	});



});

	});




});




};

//save post end

//get boss post

Post.getBoss=function(name,callback){

mongodb.open(function(err,db){
if(err){return callback(err);}
db.collection('posts',function(err,collection){
if(err){mongodb.close();return callabck(err);}
var query={};
if(name){
query.boss=name;
}

collection.find(query).sort({time:-1}).toArray(function(err,docs){

mongodb.close();
if(err){callback(err,null);}
callback(null,docs);


});


});


});


};

//get post start
Post.get=function(pid,callback){

mongodb.open(function(err,db){
if(err){return callback(err);}
db.collection('posts',function(err,collection){
if(err){mongodb.close();return callabck(err);}
var query={};
if(pid){
query.pid=parseInt(pid);
}

collection.find(query).sort({time:-1}).toArray(function(err,docs){

mongodb.close();
if(err){callback(err,null);}
callback(null,docs);


});


});


});


};
//get post end
//get one shop ad

Post.getAd=function(boss,callback){
mongodb.open(function(err,db){

if(err){

return callback(err);
}

db.collection('posts',function(err,collection){
	if(err){mongodb.close();
		return callback(err);}
	var query={};
	if(boss){
		query.boss=boss;	
	}
	query.show="main";

	collection.find(query,{limit:3}).sort({
		
time:-1}).toArray(function(err,doc){
	mongodb.close();
	if(err) {
		
		callback(err,null);
	}
	callback(null,doc);


	});

});


});


};



//getten post start

Post.getTen=function(boss,brand,sex,page,callback){
mongodb.open(function(err,db){

if(err){

return callback(err);
}

db.collection('posts',function(err,collection){
	if(err){mongodb.close();
		return callback(err);}
	var query={};
	if(boss){
		query.boss=boss;	
	}
	if(brand){
		query.brand=brand;	
	}
	if(sex){
		query.sex=sex;	
	}

	collection.find(query,{skip:(page-1)*10,limit:10}).sort({
		
time:-1}).toArray(function(err,docs){
	mongodb.close();
	if(err) {
		
		callback(err,null);
	}
	callback(null,docs);


	});

});


});


};
//get brand


Post.getBrand=function(callback){
mongodb.open(function(err,db){

if(err){

return callback(err);
}

db.collection('posts',function(err,collection){
	if(err){mongodb.close();
		return callback(err);}

	collection.distinct("brand",function(err,docs){
	mongodb.close();
	if(err) {
		
		callback(err,null);
	}
	console.log(docs.length);
	callback(null,docs);


	});

});


});


};



//getone

Post.getOne=function(pid,callback){

mongodb.open(function(err,db){

	if(err){return callback(err);}
	db.collection('posts',function(err,collection){
	if(err){mongodb.close();return callback(err);}
	
		collection.findOne({"pid":pid},function(err,doc){
			collection.update({"pid":pid},{$inc:{"pv":1}});
		mongodb.close();
		if(err)
		{
		callback(err,null);
		} 

		callback(err,doc);
			});	

	});
});

};


//remove


Post.remove=function(name,callback){

mongodb.open(function(err,db){

	if(err){return callback(err);}
	db.collection('posts',function(err,collection){
	if(err){mongodb.close();return callback(err);}
	
	collection.remove({name:name},function(err,doc){
	mongodb.close();
	if(doc)
	{
	callback(err,doc);
	} else {
	callback(err,null);
		}

		});	
	});
});

};



//search post






Post.search=function(keyword,callback){

mongodb.open(function(err,db){
if(err){return callback(err);}
db.collection('posts',function(err,collection){
if(err){mongodb.close();return callabck(err);}
var pattern = new RegExp("^.*"+keyword+".*$", "i");
      collection.find({"name":pattern}).sort({
        time:-1
      }).toArray(function(err, docs){
        mongodb.close();
         if (err) {
         callback(err, null);
        }
        callback(null, docs);
      });
    });
  });
};

//post.sold

Post.sold=function(carts,callback){

mongodb.open(function(err,db){

	if(err){return callback(err);}
	db.collection('posts',function(err,collection){

		carts.forEach(function(cart,index){ 
collection.update({"pid":cart.pid},{$inc:{'sold':cart.amount}});
		});
		
		mongodb.close();
		callback(null,1);
});
});
};


//post.sold.record



Post.record=function(oid,user,carts,adds,time,callback){

mongodb.open(function(err,db){

	if(err){callback(err,null);}
	

		db.collection('ids',function(err,collection){
			if(err){
				mongodb.close();
				console.log("wrong");
				callback(err,null);
			}
			collection.findOne({"name":"sold"},function(err,doc){
				var id=parseInt(doc.id);
				console.log(id);
				collection.update({"name":"sold"},{$inc:{'id':carts.length}});

				db.collection('posts',function(err,collection){

					carts.forEach(function(cart,index){ 
						id=id+1;
						var record={
							"soid":id,
							"oid":oid,
							"cid":cart.cid,
							"buyer":user,
							"ip":adds.ip,
							"who":adds.who,
							"phone":adds.phone,
							"amount":cart.amount,
							"state":"first",
							"time":time
						}

			collection.update({"pid":cart.pid},{$push:{"record":record}});
					});
					mongodb.close();

					callback(null,1);


		
			});
		
	});

	});	

	});
};