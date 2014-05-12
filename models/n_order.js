ar mongodb=require('./db');

function Cart(name,pid,amount,ip,who,phone,state){
this.name=name;
this.pid=pid;
this.amount=amount;
this.ip=ip;
this.who=who;
this.phone=phone;
this.state=state;
}


module.exports=Cart;


Cart.saveorder=function(name,pid,amount,ip,who,phone,state,callback){

	mongodb.open(function(err,db){
		if(err){callback(err);}



	});


};