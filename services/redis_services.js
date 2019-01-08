var PROP =require("../properties.json");
var redis = require("redis"),
    //client = redis.createClient({host: PROP.REDIS_HOST,port: PROP.REDIS_PORT});
 
 key=PROP.KEY;

module.exports.redis_push=function(data,error){
client = redis.createClient({host: PROP.REDIS_HOST,port: PROP.REDIS_PORT})
    client.on("error",function(err){
        console.log(err)
    });
    client.on('ready',function() {
	console.log(data);
        client.lpush(key,data);
    });


}

module.exports.redis_lrange=function(){
client = redis.createClient({host: PROP.REDIS_HOST,port: PROP.REDIS_PORT})
console.log("******")
    client.on("error",function(err){
        error(err);
    });
    client.on('ready',function() {
console.log("##########",key);
        client.lrange(key,0,-1),function(err,element){
           console.log(element) 
            client.del(key);
	return element;
        }
    });

    
}
