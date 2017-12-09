/*ALLOW CROSS SITE DOMAIN TO ACCESS SERVER */
exports.allowCsrf =  function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
	res.header("Access-Control-Allow-Credentials", false);
	res.header("Access-Control-Max-Age", "86400");
	res.header("Access-Control-Allow-Headers", "OriginX-Requested-With, X-HTTP-Method-Override, Authorization, Content-Type, Accept");
	next();	
}
exports.logger = function(req, res, next){
	console.log(req.body);
	next();
}

