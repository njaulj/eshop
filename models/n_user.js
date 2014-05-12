var mongodb=require('./db');

function User(user){
	this.name=user.name;
	this.password=user.password;
};

module.exports=User;

//save user start

User.prototype.save=function(callback){
	
	var user={
    name:this.name,
    password:this.password
  }
	var date=new Date();

  var time={date:date,
    year:date.getFullYear(),
    month:date.getFullYear()+"-"+(date.getMonth()+1),
    day : date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate(),
    minute : date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes()
  };
	mongodb.open(function(err,db){
		if(err){
		return callback(err);
		}
				db.collection('ids',function(err,collection){
  collection.findAndModify({"name":"user"},[], {$inc:{'id':1}}, {new:true, upsert:true},function(err,doc){

      var newuser={
        uid:doc.id,
    name:user.name,
    password:user.password,
    adds:[],
    carts:[],
    orders:[],
    cartnum:0,
    role:"normal",
    shopname:""
    }
           	db.collection('users',function(err,collection){ if(err)
			{
			mongodb.close();
			return callback(err);			
			}
	
		collection.insert(newuser,{safe:true},function(err,user)
		{     
			mongodb.close();
			callback(err,user);
			
 });
     });
            });
        });
});
};
//save user end

//get user

User.get = function(name, callback){//读取用户信息
  //打开数据库
  mongodb.open(function(err, db){
    if(err){
      return callback(err);
    }
    //读取 users 集合
    db.collection('users', function(err, collection){
      if(err){
        mongodb.close();
        return callback(err);
      }
      //查找用户名 name 值为 name文档
      collection.findOne({
        "name": name
      },function(err, doc){
        mongodb.close();
        if(doc){

          callback(err,doc);//成功！返回查询的用户信息
	console.log(doc);
        } else {
          callback(err, null);//失败！返回null
        }
      });
    });
  });
};

//get user end


//remove
User.remove = function(name, callback){//读取用户信息
  //打开数据库
  mongodb.open(function(err, db){
    if(err){
      return callback(err);
    }
    //读取 users 集合
    db.collection('users', function(err, collection){
      if(err){
        mongodb.close();
        return callback(err);
      }
      //查找用户名 name 值为 name文档
      collection.remove({
        name: name
      },function(err, doc){
        mongodb.close();
        if(doc){

          callback(err,doc);//成功！返回查询的用户信息
        } else {
          callback(err, null);//失败！返回null
        }
      });
    });
  });
};



//update 
