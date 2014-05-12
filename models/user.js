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
        headpic:"",
        role:1,
        ustate:1,
        shopname:"",
        shopdesp:"",
        shoppic:"",
        contact:"",
        email:"",
        whatsell:"",
        sstate:0,
        time:time,
        total:0,
        hot:0,
        pv:0
    }
           	db.collection('users',function(err,collection){ 
              if(err)
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

User.total=function(name,carts,callback){
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
  if(carts){
      carts.forEach(function(cart,index){

            var total=cart.amount*cart.price;
            total.toFixed(2);
            collection.update({"name":name},{$inc:{"total":total}});

          });
    }
      collection.findOne({"name":name},function(err,user){

          mongodb.close();
                callback(null,user.total);

      });
      
    });
  });

};

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

          callback(null,doc);//成功！返回查询的用户信息
	  //       console.log(doc);
        } else {
          callback(err, null);//失败！返回null
        }
      });
    });
  });
};

//get shop contact

User.contactShop= function(name, callback){//读取用户信息
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
      },{"contact":1},function(err, doc){
        mongodb.close();
        if(doc){

          callback(null,doc.contact);//成功！返回查询的用户信息
    //       console.log(doc);
        } else {
          callback(err, null);//失败！返回null
        }
      });
    });
  });
};


//User.pay shop


User.payShop= function(name, callback){//读取用户信息
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
      },{"email":1},function(err, doc){
        mongodb.close();
        if(doc){

          callback(null,doc.email);//成功！返回查询的用户信息
    //       console.log(doc);
        } else {
          callback(err, null);//失败！返回null
        }
      });
    });
  });
};

//get total

User.getTotal = function(name, callback){//读取用户信息
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

          callback(null,doc.total);//成功！返回查询的用户信息
      //     console.log(doc.total);
        } else {
          callback(err, null);//失败！返回null
        }
      });
    });
  });
};





//get role

User.getrole = function(name, callback){//读取用户信息
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
        if(doc && doc.ustate==1){

          callback(null,doc.role);//成功！返回查询的用户信息
 // console.log(doc);
        } else {
          callback(err, null);//失败！返回null
        }
      });
    });
  });
};

//get shopname
//
//
/*
User.getshopname= function(name, callback){//读取用户信息
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
        console.log(doc);
        mongodb.close();
        if(doc && doc.sstate==1){
            console.log("good");
          callback(null,doc.shopname,doc.role);//成功！返回查询的用户信息
        } else {
          callback(err, null);//失败！返回null
        }
      });
    });
  });
};
*/

//shop pv add

User.pvAdd = function(name, callback){//读取用户信息
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
      collection.update({
        name:name
      },{$inc:{"pv":1}});
        mongodb.close();
        callback(null,1);
    
    });
  });
};


//chanpassword


User.changePass = function(name,password,callback){//读取用户信息
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
      var query={};
      query.name=name;
      collection.findAndModify(query,[],{$set:{"password":password}},{new:true,upsert:true},function(err,user){


     
        mongodb.close();
        callback(null,user);
     });
    });
  });
};


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
        callback(err,doc);
      });
    });
  });
};

//save orders


//get hotshop


User.getHotshop=function(sstate,callback){
mongodb.open(function(err,db){

if(err){

return callback(err);
}

db.collection('users',function(err,collection){
  if(err){mongodb.close();
    return callback(err);}
  var query={};
  if(sstate){
    query.sstate=sstate;  
  }

  collection.find(query,{limit:6}).sort({
    
hot:-1}).toArray(function(err,doc){
  mongodb.close();
  if(err) {
    
    callback(err,null);
  }
  callback(null,doc);


  });

});


});


};

//User get all shop

User.getAllshop=function(sstate,page,callback){

  mongodb.open(function(err,db){

          if(err){

          return callback(err);
          }
  var query={};
  if(sstate)
  {

    query.sstate=sstate;
  }

          db.collection('users',function(err,collection){
                  if(err){mongodb.close();
                    return callback(err);}
                  collection.find(query,{"name":1,"shopname":1,"shoppic":1,"shopdesp":1,"contact":1,"whatsell":1,"pv":1},{skip:(page-1)*9,limit:9}).sort({hot:-1,pv:-1,time:-1}).toArray(function(err,shops){
                        mongodb.close();
                          if(err) {
                            
                            callback(err,null);
                          }
                          callback(null,shops);



                  });
                   });
           });
};

//get all active shop

User.getAdminshop=function(sstate,page,callback){

  mongodb.open(function(err,db){

          if(err){

          return callback(err);
          }
  var query={};
  if(sstate)
  {

    query.sstate=sstate;
  }

          db.collection('users',function(err,collection){
                  if(err){mongodb.close();
                    return callback(err);}
                  collection.find(query,{"name":1,"shopname":1,"shoppic":1,"shopdesp":1,"contact":1,"pv":1,"email":1,"whatsell":1,"sstate":1,"uid":1},{skip:(page-1)*9,limit:9}).sort({hot:-1,pv:-1,time:-1}).toArray(function(err,shops){
                        mongodb.close();
                          if(err) {
                            
                            callback(err,null);
                          }
                          callback(null,shops);



                  });
                   });
           });
};

//get all user


User.getalluser=function(ustate,page,callback){

  mongodb.open(function(err,db){

          if(err){

          return callback(err);
          } 

          db.collection('users',function(err,collection){
                  if(err){mongodb.close();
                    return callback(err);}
                    var query={};
                    if(ustate){

                      query.ustate=ustate;
                    }
                  collection.find(query,{"headpic":1,"name":1,"role":1,"ustate":1,"total":1},{skip:(page-1)*9,limit:9}).sort({total:-1,time:-1}).toArray(function(err,users){
                        mongodb.close();
                          if(err) {
                            
                            callback(err,null);
                          }
                          callback(null,users);



                  });
                   });
           });
};




User.getsingleuser=function(name,callback){

  mongodb.open(function(err,db){

          if(err){

          return callback(err);
          }
  
                var query={};
          if(name){

            query.name=name;
          }  

          db.collection('users',function(err,collection){
                  if(err){mongodb.close();
                    return callback(err);}
                  collection.findOne(query,{"headpic":1,"name":1,"role":1,"ustate":1,"total":1},function(err,user){
                        mongodb.close();
                          if(err) {
                            
                            callback(err,null);
                          }
                          callback(null,user);



                  });
                   });
           });
};


User.getsingleshop=function(name,callback){

  mongodb.open(function(err,db){

          if(err){

          return callback(err);
          }
  
                var query={};
          if(name){

            query.name=name;
          }  

          db.collection('users',function(err,collection){
                  if(err){mongodb.close();
                    return callback(err);}
                  collection.findOne(query,{"name":1,"shopname":1,"shoppic":1,"shopdesp":1,"sstate":1,"contact":1,"email":1,"pv":1,"hot":1},function(err,user){
                        mongodb.close();
                          if(err) {
                            
                            callback(err,null);
                          }
                          callback(null,user);



                  });
                   });
           });
};

User.beeasy=function(shop,callback){
  mongodb.open(function(err,db){
if(err){return callback(err);}
db.collection('users',function(err,collection){
if(err){mongodb.close();return callabck(err);}

  collection.findAndModify({"name":shop.user},[],{$set:{"shopname":shop.shopname,"shoppic":shop.shoppic,"shopdesp":shop.shopdesp,"contact":shop.contact,
"email":shop.email,"whatsell":shop.whatsell,"sstate":2}},{new:true,upsert:true},function(err,user){
         mongodb.close();
                          if(err) {
                            
                            callback(err,null);
                          }
                          callback(null,user);


});

});
});
};

User.shopMod=function(uid,sstate,callback){
  mongodb.open(function(err,db){
if(err){return callback(err);}
db.collection('users',function(err,collection){
if(err){mongodb.close();return callabck(err);}
collection.findAndModify({"uid":uid},[],{$set:{"sstate":sstate}},{new:true,upsert:true},function(err,user){
         mongodb.close();
                          if(err) {
                            
                            callback(err,null);
                          }
                          callback(null,user);


});

});
});
};


User.shopok=function(uid,sstate,role,callback){
  mongodb.open(function(err,db){
if(err){return callback(err);}
db.collection('users',function(err,collection){
if(err){mongodb.close();return callabck(err);}
collection.findAndModify({"uid":uid},[],{$set:{"sstate":sstate,"role":role}},{new:true,upsert:true},function(err,user){
         mongodb.close();
                          if(err) {
                            
                            callback(err,null);
                          }
                          callback(null,user);


});

});
});
};

User.search=function(keyword,callback){

mongodb.open(function(err,db){
if(err){return callback(err);}
db.collection('users',function(err,collection){
if(err){mongodb.close();return callabck(err);}


var query={};
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
//update 
