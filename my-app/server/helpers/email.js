const url = require('url');
const Mailer = require('../core').Mailer;
const config = require('../config');
var handlebars = require('handlebars');
var fs = require('fs');
const admin = config.app.admin;
const site = config.app.site;
const siteUrl = config.app.siteUrl;
const userConfig = config.app.user;




exports.sendAccountConfirmation = function(user, cb){
	let name 	= user.first_name + " " + user.last_name;
	let to 		= user.email;
	let hash 	= user.code;

	let url 	= addParams(config.urls.confirmAccount,{
		email : user.id,
		hash : hash
	});
   var self=this;
	let subject = "Account confirmation";
	let body={name:name,sitename:config.app.siteName,url:url,siteurl:siteUrl}
	readHTMLFile(__dirname + '/email/register.html', function(err, html) {
		var template = handlebars.compile(html);
		var replacements =body;
		var htmlToSend = template(replacements);
        self.sendEmail(to, admin.email, subject,htmlToSend, cb);
	});


};

exports.sendpayment = function(user, cb){
	let name 	= user.name;
	let trainername 	= user.bytrainer;
	let to 		= user.email;

   var self=this;
	let subject = "Payment success";
	let body={name:name,sitename:config.app.siteName,url:url,siteurl:siteUrl,trainername:trainername}
	readHTMLFile(__dirname + '/email/paymentsuccess.html', function(err, html) {
		var template = handlebars.compile(html);
		var replacements =body;
		var htmlToSend = template(replacements);
        self.sendEmail(to, admin.email, subject,htmlToSend, cb);
	});


};
exports.send_payment = function(user, cb){
	let name 	= user.name;
	let trainername 	= user.bytrainer;
	let to 		= user.email;
	let planstate 		= user.planstate;
	let plan 		= user.plan;

   var self=this;
	let subject = "Payment success";
	let body={name:name,sitename:config.app.siteName,url:url,siteurl:siteUrl,trainername:trainername,planstate:planstate,plan:plan}
	readHTMLFile(__dirname + '/email/payment_success.html', function(err, html) {
		var template = handlebars.compile(html);
		var replacements =body;
		var htmlToSend = template(replacements);
        self.sendEmail(to, admin.email, subject,htmlToSend, cb);
	});


};

exports.sendInvoice = function(user, cb){
	let orderid 	= user.orderid;
	let city 	= user.city;
	let zip 	= user.zip;
	let street 	= user.street.replace(/(^[,\s]+)|([,\s]+$)/g, '');
	let amount 	= user.amount;
	let plan 	= user.plan;

	let trainercity 	= user.trainercity;
	let trainerzip 	= user.trainerzip;
	let trainerstreet 	= user.trainerstreet.replace(/(^[,\s]+)|([,\s]+$)/g, '');
	let vatamount 	= user.vatamount;
	let totalamount 	= user.totalamount;
	let amountplan 	= user.amountplan;
	let start_date 	= user.start_date;
	let name 	= user.name;
	let to 		= user.email;
	let trainername=user.trainername;

	let traineremail=user.traineremail;
	let subscription_plan 	= user.subscription_plan;
	
   
	let cvrvat 	= user.cvrvat;
   var self=this;
	let subject = "Payment Invoice";
	let body={name:name,traineremail:traineremail,subscription_plan:subscription_plan,cvrvat:cvrvat,amountplan:amountplan,trainername:trainername,orderid:orderid,city:city,zip:zip,street:street,amount:amount,plan:plan,trainercity:trainercity,trainerzip:trainerzip,trainerstreet:trainerstreet,vatamount:vatamount,totalamount:totalamount,start_date:start_date,sitename:config.app.siteName,url:url,siteurl:siteUrl}
	readHTMLFile(__dirname + '/email/invoice.html', function(err, html) {
		var template = handlebars.compile(html);
		var replacements =body;
		var htmlToSend = template(replacements);
        self.sendEmail(to, admin.email, subject,htmlToSend, cb);
	});


};


exports.sendInvoicetrainer = function(user, cb){
	let orderid 	= user.orderid;
	let city 	= user.city;
	let zip 	= user.zip;
	let street 	= user.street.replace(/(^[,\s]+)|([,\s]+$)/g, '');
	let trainercity 	= user.trainercity;
	let trainerzip 	= user.trainerzip;
	let trainerstreet 	= user.trainerstreet.replace(/(^[,\s]+)|([,\s]+$)/g, '');
	let amount 	= user.amount;
	let plan 	= user.plan;
	let vatamount 	= user.vatamount;
	let totalamount 	= user.totalamount;
	let amountplan 	= user.amountplan;
	let start_date 	= user.start_date;
	let name 	= user.name;
	let to 		= user.email;
	let traineremail=user.traineremail;
	let trainername=user.trainername;
    let subscription_plan 	= user.subscription_plan;

   var self=this;
	let subject = "Payment Invoice";
	let body={name:name,traineremail:traineremail,subscription_plan:subscription_plan,amountplan:amountplan,trainername:trainername,orderid:orderid,city:city,trainercity:trainercity,trainerzip:trainerzip,trainerstreet:trainerstreet,zip:zip,street:street,amount:amount,plan:plan,vatamount:vatamount,totalamount:totalamount,start_date:start_date,sitename:config.app.siteName,url:url,siteurl:siteUrl}
	readHTMLFile(__dirname + '/email/invoice_trainer.html', function(err, html) {
		var template = handlebars.compile(html);
		var replacements =body;
		var htmlToSend = template(replacements);
        self.sendEmail(to, admin.email, subject,htmlToSend, cb);
	});


};


exports.sendInvoicetrainerplan = function(user, cb){
	let orderid 	= user.orderid;
	let city 	= user.city;
	let zip 	= user.zip;
	let street 	= user.street.replace(/(^[,\s]+)|([,\s]+$)/g, '');
	let trainercity 	= user.trainercity;
	let trainerzip 	= user.trainerzip;
	let trainerstreet 	= user.trainerstreet.replace(/(^[,\s]+)|([,\s]+$)/g, '');
	let amount 	= user.amount;
	let plan 	= user.plan;
	let vatamount 	= user.vatamount;
	let totalamount 	= user.totalamount;
	let amountplan 	= user.amountplan;
	let start_date 	= user.start_date;
	let name 	= user.name;
	let to 		= user.email;
	let traineremail=user.traineremail;
	let trainername=user.trainername;
    let subscription_plan 	= user.subscription_plan;

   var self=this;
	let subject = "Payment Invoice";
	let body={name:name,traineremail:traineremail,subscription_plan:subscription_plan,amountplan:amountplan,trainername:trainername,orderid:orderid,city:city,trainercity:trainercity,trainerzip:trainerzip,trainerstreet:trainerstreet,zip:zip,street:street,amount:amount,plan:plan,vatamount:vatamount,totalamount:totalamount,start_date:start_date,sitename:config.app.siteName,url:url,siteurl:siteUrl}
	readHTMLFile(__dirname + '/email/invoice_trainerplan.html', function(err, html) {
		var template = handlebars.compile(html);
		var replacements =body;
		var htmlToSend = template(replacements);
        self.sendEmail(to, admin.email, subject,htmlToSend, cb);
	});


};

exports.sendInvoicetrainerplantrainer = function(user, cb){
	let orderid 	= user.orderid;
	let city 	= user.city;
	let zip 	= user.zip;
	let street 	= user.street.replace(/(^[,\s]+)|([,\s]+$)/g, '');
	let trainercity 	= user.trainercity;
	let trainerzip 	= user.trainerzip;
	let trainerstreet 	= user.trainerstreet.replace(/(^[,\s]+)|([,\s]+$)/g, '');
	let amount 	= user.amount;
	let plan 	= user.plan;
	let vatamount 	= user.vatamount;
	let totalamount 	= user.totalamount;
	let amountplan 	= user.amountplan;
	let start_date 	= user.start_date;
	let name 	= user.name;
	let to 		= user.email;
	let traineremail=user.traineremail;
	let trainername=user.trainername;
    let subscription_plan 	= user.subscription_plan;

   var self=this;
	let subject = "Payment Invoice";
	let body={name:name,traineremail:traineremail,subscription_plan:subscription_plan,amountplan:amountplan,trainername:trainername,orderid:orderid,city:city,trainercity:trainercity,trainerzip:trainerzip,trainerstreet:trainerstreet,zip:zip,street:street,amount:amount,plan:plan,vatamount:vatamount,totalamount:totalamount,start_date:start_date,sitename:config.app.siteName,url:url,siteurl:siteUrl}
	readHTMLFile(__dirname + '/email/invoice_trainerplan_trainer.html', function(err, html) {
		var template = handlebars.compile(html);
		var replacements =body;
		var htmlToSend = template(replacements);
        self.sendEmail(to, admin.email, subject,htmlToSend, cb);
	});


};





exports.sendInvoicewithvat = function(user, cb){
	let orderid 	= user.orderid;
	let city 	= user.city;
	let zip 	= user.zip;
	let street 	= user.street.replace(/(^[,\s]+)|([,\s]+$)/g, '');
	let amount 	= user.amount;
	let plan 	= user.plan;
	let vatamount 	= user.vatamount;
	let totalamount 	= user.totalamount;
	let amountplan 	= user.amountplan;
	let start_date 	= user.start_date;
	let name 	= user.name;
	let to 		= user.email;
	let trainername=user.trainername;
    let subscription_plan 	= user.subscription_plan;
	let cvrvat 	= user.cvrvat;
   var self=this;
	let subject = "Payment Invoice";
	let body={name:name,subscription_plan:subscription_plan,cvrvat:cvrvat,amountplan:amountplan,trainername:trainername,orderid:orderid,city:city,zip:zip,street:street,amount:amount,plan:plan,vatamount:vatamount,totalamount:totalamount,start_date:start_date,sitename:config.app.siteName,url:url,siteurl:siteUrl}
	readHTMLFile(__dirname + '/email/invoice_withvat.html', function(err, html) {
		var template = handlebars.compile(html);
		var replacements =body;
		var htmlToSend = template(replacements);
        self.sendEmail(to, admin.email, subject,htmlToSend, cb);
	});


};

exports.sendInvoicewithvatplan = function(user, cb){
	let orderid 	= user.orderid;
	let city 	= user.city;
	let zip 	= user.zip;
	let street 	= user.street.replace(/(^[,\s]+)|([,\s]+$)/g, '');
	let amount 	= user.amount;
	let plan 	= user.plan;
	let vatamount 	= user.vatamount;
	let totalamount 	= user.totalamount;
	let amountplan 	= user.amountplan;
	let start_date 	= user.start_date;
	let name 	= user.name;
	let to 		= user.email;
	let trainername=user.trainername;
	let trainercity 	= user.trainercity;
	let trainerzip 	= user.trainerzip;
	let trainerstreet 	= user.trainerstreet.replace(/(^[,\s]+)|([,\s]+$)/g, '');
    let subscription_plan 	= user.subscription_plan;
	let cvrvat 	= user.cvrvat;
   var self=this;
	let subject = "Payment Invoice";
	let body={name:name,subscription_plan:subscription_plan,trainercity:trainercity,trainerzip:trainerzip,trainerstreet:trainerstreet,cvrvat:cvrvat,amountplan:amountplan,trainername:trainername,orderid:orderid,city:city,zip:zip,street:street,amount:amount,plan:plan,vatamount:vatamount,totalamount:totalamount,start_date:start_date,sitename:config.app.siteName,url:url,siteurl:siteUrl}
	readHTMLFile(__dirname + '/email/invoice_trainerwithvatplan.html', function(err, html) {
		var template = handlebars.compile(html);
		var replacements =body;
		var htmlToSend = template(replacements);
        self.sendEmail(to, admin.email, subject,htmlToSend, cb);
	});


};

exports.sendInvoicewithvatplantrainer = function(user, cb){
	let orderid 	= user.orderid;
	let city 	= user.city;
	let zip 	= user.zip;
	let street 	= user.street.replace(/(^[,\s]+)|([,\s]+$)/g, '');
	let amount 	= user.amount;
	let plan 	= user.plan;
	let vatamount 	= user.vatamount;
	let totalamount 	= user.totalamount;
	let amountplan 	= user.amountplan;
	let start_date 	= user.start_date;
	let name 	= user.name;
	let to 		= user.email;
	let traineremail=user.traineremail;
	let trainername=user.trainername;
	let trainercity 	= user.trainercity;
	let trainerzip 	= user.trainerzip;
	let trainerstreet 	= user.trainerstreet.replace(/(^[,\s]+)|([,\s]+$)/g, '');
    let subscription_plan 	= user.subscription_plan;
	let cvrvat 	= user.cvrvat;
   var self=this;
	let subject = "Payment Invoice";
	let body={name:name,subscription_plan:subscription_plan,traineremail:traineremail,trainercity:trainercity,trainerzip:trainerzip,trainerstreet:trainerstreet,cvrvat:cvrvat,amountplan:amountplan,trainername:trainername,orderid:orderid,city:city,zip:zip,street:street,amount:amount,plan:plan,vatamount:vatamount,totalamount:totalamount,start_date:start_date,sitename:config.app.siteName,url:url,siteurl:siteUrl}
	readHTMLFile(__dirname + '/email/invoice_trainerwithvatplan_trainer.html', function(err, html) {
		var template = handlebars.compile(html);
		var replacements =body;
		var htmlToSend = template(replacements);
        self.sendEmail(to, admin.email, subject,htmlToSend, cb);
	});


};

exports.sendInvoicetrainertvat22 = function(user, cb){
	let orderid 	= user.orderid;
	let city 	= user.city;
	let zip 	= user.zip;
	let street 	= user.street.replace(/(^[,\s]+)|([,\s]+$)/g, '');
	let trainercity 	= user.trainercity;
	let trainerzip 	= user.trainerzip;
	let trainerstreet 	= user.trainerstreet.replace(/(^[,\s]+)|([,\s]+$)/g, '');
	let amount 	= user.amount;
	let plan 	= user.plan;
	let traineremail=user.traineremail;
	let vatamount 	= user.vatamount;
	let totalamount 	= user.totalamount;
	let amountplan 	= user.amountplan;
	let start_date 	= user.start_date;
	let name 	= user.name;
	let to 		= user.email;
	let trainername=user.trainername;
    let subscription_plan 	= user.subscription_plan;
	let cvrvat 	= user.cvrvat;
   var self=this;
	let subject = "Payment Invoice";
	let body={name:name,traineremail:traineremail,subscription_plan:subscription_plan,cvrvat:cvrvat,amountplan:amountplan,trainername:trainername,orderid:orderid,city:city,trainercity:trainercity,trainerzip:trainerzip,trainerstreet:trainerstreet,zip:zip,street:street,amount:amount,plan:plan,vatamount:vatamount,totalamount:totalamount,start_date:start_date,sitename:config.app.siteName,url:url,siteurl:siteUrl}
	readHTMLFile(__dirname + '/email/invoice_trainerwithvat22.html', function(err, html) {
		var template = handlebars.compile(html);
		var replacements =body;
		var htmlToSend = template(replacements);
        self.sendEmail(to, admin.email, subject,htmlToSend, cb);
	});


};


exports.sendInvoicetrainertvat = function(user, cb){
	let orderid 	= user.orderid;
	let city 	= user.city;
	let zip 	= user.zip;
	let street 	= user.street.replace(/(^[,\s]+)|([,\s]+$)/g, '');
	let trainercity 	= user.trainercity;
	let trainerzip 	= user.trainerzip;
	let trainerstreet 	= user.trainerstreet.replace(/(^[,\s]+)|([,\s]+$)/g, '');
	let amount 	= user.amount;
	let plan 	= user.plan;
	let traineremail=user.traineremail;
	let vatamount 	= user.vatamount;
	let totalamount 	= user.totalamount;433
	let amountplan 	= user.amountplan;
	let start_date 	= user.start_date;
	let name 	= user.name;
	let to 		= user.email;
	let trainername=user.trainername;
    let subscription_plan 	= user.subscription_plan;
	let cvrvat 	= user.cvrvat;
   var self=this;
	let subject = "Payment Invoice";
	let body={name:name,traineremail:traineremail,subscription_plan:subscription_plan,cvrvat:cvrvat,amountplan:amountplan,trainername:trainername,orderid:orderid,city:city,trainercity:trainercity,trainerzip:trainerzip,trainerstreet:trainerstreet,zip:zip,street:street,amount:amount,plan:plan,vatamount:vatamount,totalamount:totalamount,start_date:start_date,sitename:config.app.siteName,url:url,siteurl:siteUrl}
	readHTMLFile(__dirname + '/email/invoice_trainerwithvat.html', function(err, html) {
		var template = handlebars.compile(html);
		var replacements =body;
		var htmlToSend = template(replacements);
        self.sendEmail(to, admin.email, subject,htmlToSend, cb);
	});


};




exports.cancelSubscription = function(user, cb){
	let name 	= user.trainername;
	let to 		= user.email;
	let username=user.name;

   var self=this;
	let subject = "Cancel Subscription";
	let body={trainername:name,sitename:config.app.siteName,url:url,siteurl:siteUrl,name:username}
	readHTMLFile(__dirname + '/email/cancelsubscription.html', function(err, html) {
		var template = handlebars.compile(html);
		var replacements =body;
		var htmlToSend = template(replacements);
        self.sendEmail(to, admin.email, subject,htmlToSend, cb);
	});


};

exports.sendMessage = function(user, cb){
	let name 	= user.name;
	let message 	= user.message;
	let photo 	= user.photo;
	let to 		= user.email;
    let sender 	= user.sender;
	if(photo==null){
		photo=config.app.siteUrl+"image/user2-160x160.jpg";
	}
	var self=this;
	let subject = "New message from wellfaster";
	
	let body={name:name,photo:photo,message:message,siteurl:siteUrl,sender:sender}
	readHTMLFile(__dirname + '/email/message.html', function(err, html) {
		var template = handlebars.compile(html);
		var replacements =body;
		var htmlToSend = template(replacements);
        self.sendEmail(to, admin.email, subject,htmlToSend, cb);
	});
	// let body ="<img width='180' height='140' src='"+photo+"'/> <br><br> ";
	// body+= name+"., <br><br>";
	// body += message;	

	// this.sendEmail(to, admin.email, subject, body, cb);	

};

exports.sendtrainermessage = function(user, cb){
	let name 	= user.name;
	let message 	= user.message;
	let subject 	= user.subject;
	let to 		= user.email;
	let useremail 	= user.useremail;
	let sender 	= user.sender;
	let username 	= user.username;
	
	var self=this;
	
	let body={name:name,message:message,siteurl:siteUrl,username:username,useremail:useremail,subject:subject}
	readHTMLFile(__dirname + '/email/trainermessage.html', function(err, html) {
		var template = handlebars.compile(html);
		var replacements =body;
		var htmlToSend = template(replacements);
        self.sendEmail(to, admin.email, subject,htmlToSend, cb);
	});
	// let body ="<img width='180' height='140' src='"+photo+"'/> <br><br> ";
	// body+= name+"., <br><br>";
	// body += message;	

	// this.sendEmail(to, admin.email, subject, body, cb);	

};

exports.sendAccept = function(user, cb){
	let name 	= user.name;
	let message 	= user.message;
	let photo 	= user.photo;
	let to 		= user.email;
    let sender 	= user.bytrainer;
	if(photo==null){
		photo=config.app.siteUrl+"image/user2-160x160.jpg";
	}
    var self=this;
	let subject = "Hire request accepted by "+sender;
	let body={name:name,photo:photo,message:message,siteurl:siteUrl,sender:sender}
	readHTMLFile(__dirname + '/email/accept.html', function(err, html) {
		var template = handlebars.compile(html);
		var replacements =body;
		var htmlToSend = template(replacements);
        self.sendEmail(to, admin.email, subject,htmlToSend, cb);
	});


};

exports.sendReject = function(user, cb){
	let name 	= user.name;
	let message 	= user.message;
	let photo 	= user.photo;
	let to 		= user.email;
    let sender 	= user.bytrainer;
	if(photo==null){
		photo=config.app.siteUrl+"image/user2-160x160.jpg";
	}
	var self=this;
	let subject = "Hire request rejected by "+sender;
	let body={name:name,photo:photo,message:message,siteurl:siteUrl,sender:sender}
	readHTMLFile(__dirname + '/email/reject.html', function(err, html) {
		var template = handlebars.compile(html);
		var replacements =body;
		var htmlToSend = template(replacements);
        self.sendEmail(to, admin.email, subject,htmlToSend, cb);
	});
	// let body = "Hi " + name + ", <br><br>";
	// body += " <img width='180' height='140' src='"+photo+"'/><br><br>";	
	// body += message;

	// this.sendEmail(to, admin.email, subject, body, cb);	

};

exports.sendTrainerhire = function(user, cb){
	let name 	= user.name;
	let photo 	= user.photo;
	let to 		=user.email;
    let sender 	= user.id;
	if(photo==null){
		photo=config.app.siteUrl+"image/user2-160x160.jpg";
	}
	let aurl 	= addParams(config.urls.acceptTrainer,{
		id : user.hire,
		action:"1"
	});
	let durl 	= addParams(config.urls.acceptTrainer,{
		id : user.hire,
		action:"0"
	});

	var self=this;
	let subject = sender +"  wants to contact you";
	let body={name:name,photo:photo,aurl:aurl,durl:durl,sender:sender,siteurl:siteUrl}
	readHTMLFile(__dirname + '/email/requestsend.html', function(err, html) {
		var template = handlebars.compile(html);
		var replacements =body;
		var htmlToSend = template(replacements);
        self.sendEmail(to, admin.email, subject,htmlToSend, cb);
	});
	// let body = "Hi " + name + ", <br><br>";
	// body +=  "<img width='180' height='140' src='"+photo+"'/> <br><br>"
	// body+= sender +" wants to hire you <a href='"+aurl+"'>Accept</a>  |  <a href='"+durl+"'>Reject</a> <br><br>";	

	// this.sendEmail(to, admin.email, subject, body, cb);	

};

exports.sendadminTrainerhire = function(user, cb){
	let to 		=" request@wellfaster.com";
	

	var self=this;
	let subject = "Trainer request";
	let body={siteurl:siteUrl}
	readHTMLFile(__dirname + '/email/adminrequestsend.html', function(err, html) {
		var template = handlebars.compile(html);
		var replacements =body;
		var htmlToSend = template(replacements);
        self.sendEmail(to, admin.email, subject,htmlToSend, cb);
	});
	// let body = "Hi " + name + ", <br><br>";
	// body +=  "<img width='180' height='140' src='"+photo+"'/> <br><br>"
	// body+= sender +" wants to hire you <a href='"+aurl+"'>Accept</a>  |  <a href='"+durl+"'>Reject</a> <br><br>";	

	// this.sendEmail(to, admin.email, subject, body, cb);	

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
	let name = user.name;
	let to = user.email;
	let hash = user.code;
	let url = addParams(config.urls.resetPassword,{
		email : user.id,
		hash : hash
	});
	var self=this;
	let subject = "Password Reset";
    let body={name:name,sitename:config.app.siteName,url:url,siteurl:siteUrl}
	readHTMLFile(__dirname + '/email/forgot.html', function(err, html) {
		var template = handlebars.compile(html);
		var replacements =body;
		var htmlToSend = template(replacements);
        self.sendEmail(to, admin.email, subject,htmlToSend, cb);
	});

		

};

var readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};

// emailHelper.sendResetPasswordEmail();
// emailHelper.sendForgotPasswordEmail();

exports.sendEmail = function(to, from, subject, htmlToSend, cb){
    // setup email data with unicode symbols
    let mailOptions = {
        from: from, // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
		html: htmlToSend
    };

    console.log(mailOptions);

	Mailer.sendMail(mailOptions,cb);
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