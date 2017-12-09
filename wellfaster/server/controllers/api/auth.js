let Promise = require('bluebird');
let RegisterModel = require('../../models/register');
let LoginModel = require('../../models/login');
let UserModel 			= require('../../models/user');
let TokenModel 			= require('../../models/token');
let ResendModel 		= require('../../models/resend');
let ForgotModel	 		= require('../../models/forgot');
let ResetModel 			= require('../../models/reset');
let ConnectModel 		= require('../../models/connect');
let SocialAccountModel 	= require('../../models/social-account');
let ConfirmationModel 	= require('../../models/confirmation');
let fn 					= require('../../helpers/functions');

let userconfig 	= require('../../config').app.user;


module.exports = {
	register : function(req, res, next){

		console.log(req.body);

		let model = new RegisterModel();
		
		if(model.load(req.body) && model.validate()){
			
			let email = model.get('email');
			
			return new Promise(function(resolve, reject) {
				let model = new UserModel();
				model.findByEmail(email, function(err, result){
					if(err) reject(err);
					else resolve(result);
				})
			})
			.then(function(rows) {
				//If exist return error;
		      	if(rows.length > 0) throw new Error('email_already_used');
				
				//Register New User
				return new Promise(function(resolve, reject) {
					model.register(function(err, result){
						if(err) reject(err);
						else resolve(result);
					})
				})
			})
			.then(function(result){
		    	return res.send({
					code : 200,
					message : result.message
				});
		    })
			.catch(function(err) {
				return res.send({
					code : 100,
					message : err.message
				});
		    })
		    .finally(function(response){
		    	console.log('user registration completed');
		    });

		}else{
			let errors = model.getErrors();
			res.send({
				code : 100,
				message : "Invalid data",
				errors : errors
			});
		}
	},

	login : function(req, res, next){
		
		let model = new LoginModel();


		if(model.load(req.body) && model.validate()){
			
			let email = model.get('email');
			
			return new Promise(function(resolve, reject) {
				let model = new UserModel();
				model.findByEmail(email, function(err, rows){
					if(err) reject(err);
					else if(rows.length == 0) reject(new Error('invalid_email_password'));
					else resolve(rows[0]);
				})
			})
			.then(function(user){
				if(user.confirmed_at == '') 
		      		throw new Error('user_confirmation_required.');

		   		return new Promise(function(resolve, reject) {
					if(fn.validateHashSync(model.get('password'), user.password)) resolve(user);
					else reject(new Error('invalid_email_password'));					
				})	
			})
			.then(function(user){
				let token = fn.getToken(user.auth_key);
	
				return res.send({
					code : 200,
					token : token,
					message : 'Login success'
				});
			})
			.catch(function(err){
				return res.send({
					code  : 100,
					error : err.message
				});
			})

		}else{
			let errors = model.getErrors();
			console.log(errors);
			res.send({
				code  : 100,
				error : "Invalid data",
			});
		}
	},

	connect : function(req, res, next){
		/*let post = {
			"id":"108572616528480728957",
			"name":"Kuldeep Singh",
			"email":"kuldeep@wegile.com",
			"photoUrl":"https://lh4.googleusercontent.com/-1MIjKOmAfXo/AAAAAAAAAAI/AAAAAAAAAAA/ACnBePYomuf7cQp5cK_3YhJ2Gb86Eh_wGw/s96-c/photo.jpg",
			"provider":"GOOGLE"
		};*/

		let model = new ConnectModel();
		if(model.load(req.body) && model.validate()){
			return new Promise(function(resolve, reject){
				let socialModel = new SocialAccountModel();
				
				socialModel.findByClientId(model.get('id'), function(err, rows){
					if(err) reject(err);

					if(rows && rows.length > 0){
						socialModel.getUser( rows[0].user_id, function(err, user){
							if(err) reject(err);
							else resolve(user);
						})
					}else{
						model.connect(function(err, user){
							if(err) reject(err);
							else resolve(user);
						})
					}
				});
			})
			.then(function(user){
				let token = fn.getToken(user.auth_key);
				return res.send({
					code : 200,
					token : token,
					message : 'Login success'
				});
			})
			.catch(function(err){
				return res.send({
					code  : 100,
					error : err.message
				});
			})

		}else{
			let errors = model.getErrors();
			console.log(errors);
			res.send({
				code  : 100,
				error : "Invalid data",
			});	
		}
	},
	
	request_password_reset : function(req, res, next){
		
		let model = new ForgotModel();
		if(model.load(req.body) && model.validate()){

			let email = model.get('email');
			
			return new Promise(function(resolve, reject) {
				let model = new UserModel();
				model.findByEmail(email, function(err, rows){
					if(err) reject(err);
					else if(rows.length == 0) reject(new Error('invalid_email'));
					else resolve(rows[0]);
				})
			})
			.then(function(user) {
				
				if(! fn.isDate(user.confirmed_at)) 
		      		throw new Error('user_confirmation_required.');

				//Resend Confirmation
				return new Promise(function(resolve, reject) {
					model.request(user, function(err, result){
						if(err) reject(err);
						else resolve(result);
					})
				})
			})
			.then(function(result){
		    	return res.send({
					code : 200,
					message : result.message
				});
		    })
			.catch(function(err) {
				return res.send({
					code : 100,
					error : err.message
				});
		    })
		    .finally(function(response){
		    	console.log('user registration completed');
		    });
		}else{
			let errors = model.getErrors();
			res.send({
				code : 100,
				message : "Invalid data",
				errors : errors
			});
		}
	},

	reset_password : function(req, res, next){
		let model = new ResetModel();
		
		if(model.load(req.body) && model.validate()){

			let userId = model.get('id');
			let userVerificationCode = model.get('code');

			return new Promise(function(resolve, reject) {
				
				let user = new UserModel();
				
				user.findOne(userId, function(err, user){
					if(err) reject(err);
					else resolve(user);
				})
			})
			.then(function(user) {

				if(! fn.isDate(user.confirmed_at)) 
		  	 		throw new Error('user_confirmation_required');

				//Resend Confirmation
				return new Promise(function(resolve, reject) {
					model.reset(function(err, result){
						if(err) reject(err);
						else resolve(result);
					})
				})
			})
			.then(function(result){
		    	return res.send({
					code : 200,
					message : result.message
				});
		    })
			.catch(function(err) {
				return res.send({
					code : 100,
					message : err.message
				});
		    })
		    .finally(function(response){
		    	console.log('user registration completed');
		    });
		}else{
			let errors = model.getErrors();
			res.send({
				code : 100,
				message : "Invalid data",
				errors : errors
			});
		}
	},

	resend_confirmation : function(req, res, next){
		let model = new ResendModel();
		if(model.load(req.body) && model.validate()){

			let email = model.get('email');
			
			return new Promise(function(resolve, reject) {
				let model = new UserModel();
				model.findByEmail(email, function(err, result){
					if(err) reject(err);
					else resolve(result);
				})
			})
			.then(function(rows) {
				//If exist return error;
		      	if(rows.length == 0) 
		      		throw new Error('Wrong email');	

		      	if(userconfig.enableConfimation == false)
		      		throw new Error('User already confirmed');

		      	let user = rows[0];

		      	if(fn.isDate(user.confirmed_at)) 
		      		throw new Error('User already confirmed');

				//Resend Confirmation
				return new Promise(function(resolve, reject) {
					model.resend(user, function(err, result){
						if(err) reject(err);
						else resolve(result);
					})
				})
			})
			.then(function(result){
		    	return res.send({
					code : 200,
					message : result.message
				});
		    })
			.catch(function(err) {
				return res.send({
					code : 100,
					message : err.message
				});
		    })
		    .finally(function(response){
		    	console.log('user registration completed');
		    });
		}else{
			let errors = model.getErrors();
			res.send({
				code : 100,
				message : "Invalid data",
				errors : errors
			});
		}	
	},

	confirmation : function(req, res, next){

		let model = new ConfirmationModel();
		
		if(model.load(req.body) && model.validate()){

			let userId = model.get('id');
			let userVerificationCode = model.get('code');

			return new Promise(function(resolve, reject) {
				
				let user = new UserModel();
				
				user.findOne(userId, function(err, user){
					console.log(user);
					if(err) reject(err);
					else resolve(user);
				})
			})
			.then(function(user) {
				//If exist return error;
		      	if(! user) 
		      		throw new Error('User does not exist');	

		      	if(userconfig.enableConfimation == false)
		      		throw new Error('User already confirmed');

				if(fn.isDate(user.confirmed_at)) 
		       		throw new Error('User already confirmed');

				//Resend Confirmation
				return new Promise(function(resolve, reject) {
					let token = new TokenModel();
					token.find({ user_id : user.id, code : userVerificationCode }, function(err, rows){
						if(err) reject(err);
						else resolve(rows);
					})
				})
			})
			.then(function(rows) {
				//If exist return error;
		      	if(rows.length == 0) 
		      		throw new Error('Invalid confirmation code');	

		      	let userid = rows[0].user_id;

				//Confirm user
				return new Promise(function(resolve, reject) {
					model.confirmUser(userid, function(err, result){
						if(err) reject(err);
						else resolve(result);
					})
				})
			})
			.then(function(result){
		    	return res.send({
					code : 200,
					message : result.message
				});
		    })
			.catch(function(err) {
				return res.send({
					code : 100,
					message : err.message
				});
		    })
		    .finally(function(response){
		    	console.log('user registration completed');
		    });
		}else{
			let errors = model.getErrors();
			res.send({
				code : 100,
				message : "Invalid data",
				errors : errors
			});
		}	
	},

	confirm_token : function(req, res, next){

		let model = new ConfirmationModel();
		
		if(model.load(req.body) && model.validate()){

			let userId = model.get('id');
			let userVerificationCode = model.get('code');

			return new Promise(function(resolve, reject) {
				
				let user = new UserModel();
				
				user.findOne(userId, function(err, user){
					if(err) reject(err);
					else resolve(user);
				})
			})
			.then(function(user) {
				if(! fn.isDate(user.confirmed_at)) 
		       		throw new Error('user_confirmation_required');

				//Resend Confirmation
				return new Promise(function(resolve, reject) {
					let token = new TokenModel();
					token.find({ user_id : user.id, code : userVerificationCode }, function(err, rows){
						if(err) reject(err);
						else if(rows.length == 0) reject(new Error('invalid_code'));
						else resolve(user);
					})
				})
			})
			.then(function(user){
		    	return res.send({
					code : 200,
					result : user
				});
		    })
			.catch(function(err) {
				return res.send({
					code : 100,
					error : err.message
				});
		    })
		}else{
			let errors = model.getErrors();
			res.send({
				code : 100,
				message : "Invalid data",
				errors : errors
			});
		}	
	}

}



