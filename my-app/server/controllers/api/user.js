const Promise 	= require('bluebird');
const fn 		= require('../../helpers/functions');
const UserModel = require('../../models/user');

module.exports = {
	index : function(){

	},

	me : function(req, res, next){
		let accessToken = req.get('Authorization');

		if(accessToken){
			let authKey 	= fn.getTokenKey(accessToken);
			let userModel 	= new UserModel();
			
			return new Promise(function(resolve, reject){

				if(! authKey){
					reject(new Error('Invalid access token'))
				}
				else {
					userModel.findByAuthKey(authKey, function(err, rows){
						if(err) reject(err);
						else if(rows && rows.length > 0) resolve(rows[0]);
						else reject(new Error('User not found'));
					});
				}				
			})
			.then(function(user){
				res.send({
					code 	: 200,
					data 	: user,
					message : 'Success'
				});	
			})
			.catch(function(err){
				res.send({
					code 	: 100,
					message : 'Error : ' + err.message
				});	
			});

		}else{
			res.send({
				code 	: 	100,
				message : 	'Error : Token not found'
			})
		}	
		
	},

	create : function(){

	},

	edit : function(){

	},

	delete : function(){

	},
};