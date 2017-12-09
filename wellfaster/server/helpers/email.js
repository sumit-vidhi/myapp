const url = require('url');
const Mailer = require('../core').Mailer;
const config = require('../config');

const admin = config.app.admin;
const site = config.app.site;
const userConfig = config.app.user;




exports.sendAccountConfirmation = function(user, cb){
	let name 	= user.first_name + " " + user.last_name;
	let to 		= user.email;
	let hash 	= user.code;

	let url 	= addParams(config.urls.confirmAccount,{
		email : user.id,
		hash : hash
	});

	let subject = "Account confirmation";
	
	let body = "Hi " + name + ", <br><br>";
		body += "Thanks for signing up for "+ config.app.siteName +". ";
		body += "Please confirm your account.  <br><br>";
		body += "<a href ='"+url+"' target=\"_blank\">Confirm your account</a> <br><br>";
		body += "&mdash; The "+ config.app.siteName + " Team";

	this.sendEmail(to, admin.email, subject, body, cb);	

};

exports.sendWelcome = function(user, cb){
	let name 	= user.first_name + " " + user.last_name;
	let to 		= user.email;

	let subject = "Account confirmation";
	
	let body = "Hi " + name + ", <br><br>";
		body += "Thanks for signing up for "+ config.app.siteName +". ";
		body += "Please find below login detail..  <br><br>";
		body += "Email:  "+ user.email +"<br>";
		body += "Password: "+ userConfig.defaultPassword +"  <br><br>";
		body += "&mdash; The "+ config.app.siteName + " Team";

	this.sendEmail(to, admin.email, subject, body, cb);	

};

exports.sendRequestPassword = function(user, cb){
	let name = user.first_name + " " + user.last_name;
	let to = user.email;
	let hash = user.code;
	let url = addParams(config.urls.resetPassword,{
		email : user.id,
		hash : hash
	});
	
	let subject = "Password Reset";
	
	let body = "Hi " + name + ", <br><br>";
		body += "Please use following link to reset your password on " +  config.app.siteName  +". <br><br>";
		body += "<a href ='"+url+"'  target=\"_blank\">Reset password</a> <br><br>";
		body += "&mdash; The "+ config.app.siteName + " Team";

	this.sendEmail(to, admin.email, subject, body, cb);	

};

// emailHelper.sendResetPasswordEmail();
// emailHelper.sendForgotPasswordEmail();

exports.sendEmail = function(to, from, subject, body, cb){
    // setup email data with unicode symbols
    let mailOptions = {
        from: from, // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        html: body // html body
    };

    console.log(body);

	Mailer.sendMail(mailOptions, cb);
};


function addParamsAsQuery(url, params){
	let counter = 0;
	for(i in params){
		url += (counter == 0) ? "?" : "&";
		url += i+"="+params[i];
		counter++;
	}
	return url;
}

function addParams(url, params){
	let paramsArr = [];
	for(i in params){
		paramsArr.push(params[i]);
	}

	if(paramsArr.length > 0)
		url += '/' + paramsArr.join('/');	
	return url;
}