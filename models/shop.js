var mongodb=require('./db');

function Shop(shop){
	this.owner=shop.owner;
	this.shopname=shop.shopname;
	this.shoppic=shop.shoppic;
	this.shopdesp=shop.shopdesp;
};

module.exports=Shop;

//save shop



Shop.prototype.save=function(callback){


mongodb.open(function(err,db){
	if(err){return callback(err);}
	db.collection('ids',function(err,collection){
	collection.findAndModify({"name":"shop"},[], {$inc:{'id':1}}, {new:true, upsert:true},function(err,doc){

		if(err){mongodb.close();
			return callback(err);}
			db.collection('shops',function(err,collection){
					if(err){mongodb.close();
						return callback(err);}
						var date=new Date();
						var time={date:date,
							year:date.getFullYear(),
							month:date.getFullYear()+"-"+(date.getMonth()+1),
							day : date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate(),
							minute : date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes()
						};

						var newshop={
							"sid":doc.id,
							"owner":this.owner,
							"shopname":this.shopname,
							"shopdesp":this.shopdesp,
							"shoppic":this.shoppic,
							"pv":0,
							"hot":0,
							"total":0,
							"time":time,
							"state":0
						};
						collection.insert(newshop,{safe:true},function(err,shop){

							mongodb.close();
							callback(err,shop);

});
					});
		});});
});
};

