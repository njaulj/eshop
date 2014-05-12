var mongodb = require('./db');

function Comment(comment) {
  this.pid=comment.pid;
  this.name=comment.name;
  this.time=comment.time;
  this.content=comment.content;
}

module.exports = Comment;

Comment.prototype.save = function(callback) {
   var comment = {
      "pid":this.pid,
      "name":this.name,
      "time":this.time,
      "content":this.content
   };
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('ids',function(err,collection){
  collection.findAndModify({"name":"comment"},[], {$inc:{'id':1}}, {new:true, upsert:true},function(err,doc){
    var newcomment={
      "cmid":doc.id,
      "pid":comment.pid,
      "name":comment.name,
      "time":comment.time,
      "content":comment.content,
      "state":1
    }
    db.collection('comments', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //通过用户名、发表日期及标题查找文档，并把一条留言添加到该文档的 comments 数组里
      collection.insert(newcomment,{safe:true}
      , function (err,comment) {
          mongodb.close();
         callback(err,comment);
      });   
    });
      });   
    });
  });
};



Comment.get=function(pid,callback){
mongodb.open(function(err,db){

if(err){

return callback(err);
}

db.collection('comments',function(err,collection){
  if(err){mongodb.close();
    return callback(err);}
 


  collection.find({"pid":pid,"state":1}).sort({
    
time:-1}).toArray(function(err,docs){
  mongodb.close();
  if(err) {
    
    callback(err,null);
  }
  console.log("haha");
  callback(null,docs);


  });

});


});


};