var PROP =require("../properties.json");
var redis = require("redis"),
    client = redis.createClient({host: PROP.REDIS_HOST,port: PROP.REDIS_POST});
 
var key=PROP.KEY;

module.exports.redis_push=function(data,error){

    client.on("error",function(err){
        error(err);
    });
    client.on('ready',function() {
        client.lpush(key,data);
    });


}

module.exports.redis_lrage=function(res){

    client.on("error",function(err){
        error(err);
    });
    client.on('ready',function() {
        client.lrange(key,0,-1),function(err,element){
            res(element);
            client.del(key);
        }
    });

    
}