var mongodb=require('./db');
var markdown = require('markdown').markdown;

function Post(name,pic,price,desp,sex){
	this.name=name;
	this.pic=pic;
	this.price=price;
	this.desp=desp;
	this.sex=sex;
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
name:this.name,
pic:this.pic,
price:this.price,
desp:this.desp,
sex:this.sex,
time:time
}

mongodb.open(function(err,db){
if(err){return callback(err);}

db.collection('ids',function(err,collection){
	collection.findAndModify({"name":"product"},[], {$inc:{'id':1}}, {new:true, upsert:true},function(err,doc){
	db.collection('posts',function(err,collection){
		if(err){mongodb.close();
			return callback(err);}
		collection.insert({"pid":doc.id,"name":post.name,"pic":post.pic,"price":post.price,
	"desp":post.desp,"sex":post.sex,"time":post.time},{safe:true},function(err,post){

	mongodb.close();
	callback(err,post);

	});


	});



});

	});




});




};

//save post end


//get post start
Post.get=function(name,callback){

mongodb.open(function(err,db){
if(err){return callback(err);}
db.collection('posts',function(err,collection){
if(err){mongodb.close();return callabck(err);}
var query={};
if(name){
query.name=name;
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


//getten post start

Post.getTen=function(name,page,callback){
mongodb.open(function(err,db){

if(err){

return callback(err);
}

db.collection('posts',function(err,collection){
	if(err){mongodb.close();
		return callback(err);}
	var query={};
	if(name){
		query.name=name;	
	}

	collection.find(query,{skip:(page-1)*10,limit:10}).sort({
		
time:-1}).toArray(function(err,docs){
	if(err) {mongodb.close();callback(err,null);}
	docs.forEach(function(doc){
	doc.post=markdown.toHtml(doc.post);
	

	});
	callback(null,docs);


	});

});


});


};

//getone

Post.getOne=function(name,callback){

mongodb.open(function(err,db){

	if(err){return callback(err);}
	db.collection('posts',function(err,collection){
	if(err){mongodb.close();return callback(err);}
	
	collection.findOne({name:name},function(err,doc){
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
      collection.find({"name":pattern},{"name":1,"desp":1,"price":1,"pic":1}).sort({
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
