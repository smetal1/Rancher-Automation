var express = require('express');
var router = express.Router();
var shell=require('shelljs');
var rancher="/home/ubuntu/Rancher-Dev/scripts/rancher";
var file_line_reader=require('line-by-line');
var sleep = require('sleep');
var redis= require("../services/redis_services");

/* GET home page. */
router.post('/create', function(req, res) {
  //res.render('index', { title: 'Express' });
 
  var clientName=req.body.clientName;
  redis.redis_push(clientName);
  var filename="/home/ubuntu/Rancher-Dev/warbox/"+clientName+".yml";
  var command=rancher+" up --file "+filename
  action(clientName,filename,command)
  res.send("Sucess");

});

router.post('/get-endpoints', function(req, res) {
	var command="aws ec2 describe-instances --filters 'Name=tag:Name,Values="+req.body.clientName+"2'"
	var sh=JSON.parse(shell.exec(command));
	//console.log(sh);
	if(sh.Reservations.length>0){
	res.send(sh.Reservations[0].Instances[0].PublicIpAddress);
	}
	else {
		res.send("Waiting");
	}

});

router.post('/setup', function(req, res) {
	//var clientName=req.body.clientName;
	//var log_file=clientName+'.log'
	var pending_client=[];
	var current_client_list=redis.redis_lrange();
	red.redis_lrange(function(current_client_list){
		if(current_client_list.length>0){
			current_client_list.forEach(function(clientName){
				var log_file=clientName+'.log'
				var command=rancher +" cluster ls >"+log_file
				var command_grep="grep -hnr "+clientName+"  "+log_file+" | grep 'Default'"
				//console.log(command)
				sleep.sleep(3)
					var sh=shell.exec(command);
				sleep.sleep(2)
				//console.log(command_grep)
				var shell_grep=shell.exec(command_grep)
				sleep.sleep(5)
				//console.log(shell_grep.toString().split('         '))
				var splitter_array=shell_grep.toString().split('         ');
			
				var switch_index=splitter_array[0].split(':')[1]
				installService(switch_index)
				//console.log(switch_index)
				shell.rm(log_file)
			
				if(shell_grep.toString().includes('provisioning')){
	console.log(clientName)			
	pending_client.push(clientName);
				}
				else {
				//res.send("Ready");
					console.log("Ready"+clientName);
					//call install Service Function
				}
			});
			console.log(pending_client);
			redis.redis_push(pending_client);
		}
		

	});
	
	

});

function action(clientName,filename,command){
  var regex='s/\demo\b/eRtc'+clientName+'/g'
  console.log(filename)
  shell.cp('-R','/home/ubuntu/Rancher-Dev/scripts/ec2.yml',filename);
  shell.sed('-i',"demo",clientName,filename);
  shell.exec(command);
  shell.rm(filename);

}

function installService(envNumber){
var command_switch_env="echo "+envNumber+" | "+rancher+"context switch"
var command_kubectl=rancher+" kubectl get nodes"
	shell.exec(command_switch_env)
	var kube=shell.exec(command_kubectl)
	console.log(kube)
}
module.exports = router;
