var mongodb=require('./db');
//var markdown = require('markdown').markdown;

function Post(post){
	this.name=post.name;
	this.boss=post.boss;
	this.pic=post.pic;
	this.price=post.price;
	this.iprice=post.iprice;
	this.desp=post.desp;
	this.ldesp=post.ldesp;
	this.fbrand=post.fbrand;
	this.mbrand=post.mbrand;
	this.lbrand=post.lbrand;
	this.state=post.state;
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
"boss":this.boss,
"pic":this.pic,
"price":this.price,
"iprice":this.iprice,
"desp":this.desp,
"ldesp":this.ldesp,
"fbrand":this.fbrand,
"mbrand":this.mbrand,
"lbrand":this.lbrand,
"state":this.state
};

console.log(post);
mongodb.open(function(err,db){
if(err){return callback(err);}

db.collection('ids',function(err,collection){
	collection.findAndModify({"name":"product"},[], {$inc:{'id':1}}, {new:true, upsert:true},function(err,doc){
	db.collection('posts',function(err,collection){
		if(err){mongodb.close();
			return callback(err);}
			console.log("ceshi"+doc.id);
			var newpost={
				"pid":doc.id,
				"name":post.name,
				"boss":post.boss,
				"pic":post.pic,
				"price":post.price,
				"iprice":post.iprice,
				"desp":post.desp,
				"ldesp":post.ldesp,
				"fbrand":post.fbrand,
				"mbrand":post.mbrand,
				"lbrand":post.lbrand,
				"state":post.state,
				"time":time,
				"sold":0,
				"pv":0
			};
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
//get all new

Post.getallnew=function(pid,onsale,callback){

mongodb.open(function(err,db){
if(err){return callback(err);}
db.collection('posts',function(err,collection){
if(err){mongodb.close();return callabck(err);}
var query={};
if(pid){
query.pid=parseInt(pid);
}
if(onsale)
{
	query.onsale=parseInt(onsale);
}
collection.find(query).sort({time:-1}).toArray(function(err,docs){

mongodb.close();
if(err){callback(err,null);}
callback(null,docs);


});


});


});


};


//get all


Post.getall=function(pid,callback){

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

//post.get sth


Post.getcart=function(carts,callback){


mongodb.open(function(err,db){

	if(err){return callback(err);}
	db.collection('posts',function(err,collection){
		id=7;
	var query={};
	query.pid=parseInt(id);
	var i=0;
	console.log(carts.length);

	var a=new Array();
	carts.forEach(function(cart,index){
		a[index]=cart.pid;

	});
	console.log(carts[0]);

	console.log(a);
//var a=collection.findOne({"pid":cart.pid});
		collection.find({"pid":{"$in":a}}).sort({time:-1}).toArray(function(err,post){
	
				console.log(post);

					
										
							mongodb.close();
									callback(null,post);

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
query.state=1;
collection.findOne(query,function(err,post){

mongodb.close();
if(err){callback(err,null);}
console.log(post);
callback(null,post);


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
	query.state=2;

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

Post.getTen=function(boss,fbrand,mbrand,lbrand,state,page,callback){
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
		if(fbrand){
			query.fbrand=fbrand;	
		}
		if(mbrand){
			query.mbrand=mbrand;	
		}
		if(lbrand){
			query.lbrand=lbrand;	
		}
		if(state){
			query.state=state;
		}

	collection.find(query,{skip:(page-1)*9,limit:9}).sort({
		
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


Post.getBrand=function(boss,callback){
mongodb.open(function(err,db){

if(err){

return callback(err);
}

db.collection('posts',function(err,collection){
	if(err){mongodb.close();
		return callback(err);}

	collection.distinct("fbrand",{"boss":boss},function(err,docs){
	mongodb.close();
	if(err) {
		
		callback(err,null);
	}
	console.log(docs);
	callback(null,docs);


	});

});


});


};

//post down 

Post.down=function(boss,pid,callback){
mongodb.open(function(err,db){

if(err){

return callback(err);
}

db.collection('posts',function(err,collection){

				if(err){
					mongodb.close();
			    return callback(err);
			}
			var ppid=parseInt(pid);

    collection.findAndModify({"pid":ppid,"boss":boss},[],{$set:{"state":3}},{new:true,upsert:true},function(err,post){

				  	mongodb.close();
				  	console.log(post);
				    callback(null,post.state);

    });

  

});
});

};

////post po

Post.po=function(boss,pid,callback){
mongodb.open(function(err,db){

if(err){

return callback(err);
}

db.collection('posts',function(err,collection){

				if(err){
					mongodb.close();
			    return callback(err);
			}
			var ppid=parseInt(pid);

    collection.findAndModify({"pid":ppid,"boss":boss},[],{$set:{"state":1}},{new:true,upsert:true},function(err,post){

				  	mongodb.close();
				  	console.log(post);
				    callback(null,post.state);

    });

  

});
});

};

//post hot


Post.hot=function(boss,pid,callback){
mongodb.open(function(err,db){

if(err){

return callback(err);
}

db.collection('posts',function(err,collection){

				if(err){
					mongodb.close();
			    return callback(err);
			}
			var ppid=parseInt(pid);

    collection.findAndModify({"pid":ppid,"boss":boss},[],{$set:{"state":2}},{new:true,upsert:true},function(err,post){

				  	mongodb.close();
				  	console.log(post);
				    callback(null,post.state);

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
		//doc.ldesp=markdown.toHTML(doc.ldesp);
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






Post.search=function(boss,keyword,callback){

mongodb.open(function(err,db){
if(err){return callback(err);}
db.collection('posts',function(err,collection){
if(err){mongodb.close();return callabck(err);}


var query={};
if(boss){
	query.boss=boss;
}
if(keyword){
	var pattern = new RegExp("^.*"+keyword+".*$", "i");
	query.name=pattern;
}
      collection.find(query).sort({
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


//post manage

Post.manage=function(boss,page,callback){


mongodb.open(function(err,db){

	if(err){return callback(err);}
	var query={};
	if(boss){
	query.boss=boss;
}
	db.collection('posts',function(err,collection){


		collection.find(query,{skip:(page-1)*9,limit:9}).sort({sold:-1,time:-1}).toArray(function(err,posts){


			mongodb.close();
			callback(null.posts);

		});


});

});
};

Post.update=function(pid,name,pic,price,iprice,desp,fbrand,mbrand,lbrand,state,callabck){

mongodb.open(function(err,db){
	if(err){return callback(err);}
	var date=new Date();

var time={date:date,
	year:date.getFullYear(),
	month:date.getFullYear()+"-"+(date.getMonth()+1),
	day : date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate(),
	minute : date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes()
};
	db.collection('posts',function(err,collection){
		if(err){
			mongodb.close();
			callback(err,null);
		}
		collection.update({"pid":parseInt(pid)},{$set:{"name":name,"pic":pic,"price":price,"iprice":iprice,"desp":desp,"fbrand":fbrand,"mbrand":mbrand,
			"lbrand":lbrand,"state":state,"time":time}});

		mongodb.close();
		callback(null,1);






});
});


};


Post.picId=function(callback){

	mongodb.open(function(err,db){
	if(err){return callback(err);}
	db.collection('ids',function(err,collection){
		if(err){
			mongodb.close();
			callback(err,null);
		}
		collection.findAndModify({"name":"pic"},[], {$inc:{'id':1}}, {new:true, upsert:true},function(err,doc){
			callback(null,doc.id);
		});
	});
});

};
//post.sold.record

/*

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


*/