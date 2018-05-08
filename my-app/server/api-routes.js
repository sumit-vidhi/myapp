const express = require('express');
const controllers = require('./controllers').api;
var MyAppModel      = require('./models/dbconnection');
const moment        = require('moment');
const emailHelper 	= require('./helpers/email');
const fn 	= require('./helpers/functions');
const router = express.Router();
var quickPay = require('quick-pay')("12269694e35e808800c8312b498e927b2a482949ed36a45dc9d57ac7e96e961f");
var request = require("request");

var cron = require('node-cron');

/** 
cron.schedule('* * * * *', function(req,res){
    
     userModel = new MyAppModel();
     userModel.query("select * from  orders where status='active'", function(err, ordersrows) {
         if(err) {
             console.log(err);
             //res.send({ status: 'error',logs: {},message: 'Internal server error. Please try again'});
     }else{  
         console.log(ordersrows);
         if (ordersrows.recordset.length>0) {                     
           
          for(i in ordersrows.recordset)
          {
             orderId=ordersrows.recordset[i].id;
             amount=ordersrows.recordset[i].amount;
             subscription_id=ordersrows.recordset[i].subscription_id;
             enddate=ordersrows.recordset[i].end_date;
             user_id=ordersrows.recordset[i].user_id;
             var mysqlTimestamp =moment(Date.now()).format('YYYY-MM-DD');
             var currnet=new Date(mysqlTimestamp).getTime();
             var end_date=new Date(enddate).getTime();
             console.log(currnet);
             console.log(end_date);
             if(end_date==currnet){
              
             headers=
             { 
               'cache-control': 'no-cache',
               authorization: 'Basic OjEyMjY5Njk0ZTM1ZTgwODgwMGM4MzEyYjQ5OGU5MjdiMmE0ODI5NDllZDM2YTQ1ZGM5ZDU3YWM3ZTk2ZTk2MWY=',
               'accept-version': 'v10' }
             newrandonnumber=fn.getRandNum(6);
                     var options = { method: 'POST',
                     url: 'https://api.quickpay.net/subscriptions/'+subscription_id+'/recurring',
                     qs: { amount:amount,auto_capture:true,order_id:newrandonnumber},
                     headers: headers };
                 request(options, function (error, response, body) {
                     //console.log(body);
                    // console.log(response);
                     if (error) throw new Error(error);
                 });
             var options = { method: 'GET',
               url: 'https://api.quickpay.net/subscriptions/'+subscription_id,
              headers:headers
            };
            request(options, function (error, response, body) {
                if (error) throw new Error(error);
                body=JSON.parse(body);
                console.log(body);
                if(body.state=='active'){
                    userModel = new MyAppModel();
                    enddate=moment(enddate).add(1, 'months').format('YYYY-MM-DD');
                    var values="end_date='"+enddate+"'";
                    userModel.query("Update  orders set "+values+" where id="+orderId, function(err, rows) {
                        if(err) {
                           // res.send({ code: 100,message: 'User not found'}); 
                        }else{
                            id=body.id;
                            amount=amount;
                            currency=body.currency;
                            order_id=body.order_id;
                            accepted=body.accepted;
                            created_at=body.created_at;
                            user_id=user_id;
                            var field="subscription_id,amount,currency,created_at,accepted,user_id,trainer_id,order_id,status";
                                  var values="'"+id+"','"+amount+"','"+currency+"','"+created_at+"','"+accepted+"','"+user_id+"','"+trainer_id+"','"+order_id+"','active'";
                                 qd="Insert  into order_history ("+field+") OUTPUT Inserted.ID  values("+values+")";
                                 console.log(qd);
                                  userModel.query("Insert  into order_history ("+field+") OUTPUT Inserted.ID  values("+values+")", function(err, rows) {
                                  if(err) {
                                      res.send({ code: 100,message: 'User not found'}); 
                                  }else{
                                  }
                                })          
                        }
                    })
                }
            })
             
          }
        }
        }
      
     } 
     })
 
 
 });
 */



/**
 *  Follwing routes for user registration,user login,
 *  user authentication, token verification, email varification
 *  create user, edit user, delete user, get users
 */
var multer = require('multer');
var multerAzure = require('multer-azure');

 
// var upload = multer({ 
   
//   storage: multerAzure({
//     connectionString: 'DefaultEndpointsProtocol=https;AccountName=wellfasterstore;AccountKey=6h3dY22tndMG0osMtVvtuE9qRYN/yoXk2jaUOUUjPOGujj3LaGht9iDr1CxVkn5r1M1cZCZIkpCnz1D07Gu2+g==;EndpointSuffix=core.windows.net', //Connection String for azure storage account, this one is prefered if you specified, fallback to account and key if not.
//     account: 'wellfasterstore', //The name of the Azure storage account
//     key: '6h3dY22tndMG0osMtVvtuE9qRYN/yoXk2jaUOUUjPOGujj3LaGht9iDr1CxVkn5r1M1cZCZIkpCnz1D07Gu2+g==', //A key listed under Access keys in the storage account pane
//     container: 'images',  //Any container name, it will be created if it doesn't exist
    
//     blobPathResolver: function(req, file, callback){
//       var blobPath = ty(req, file); //Calculate blobPath in your own way.
//       callback(null, blobPath);
//     }
//   })
// });

// function ty(req, file){
//     console.log(file);
// return file.fieldname + '-' + Date.now() + '.webm';
// }

var upload = multer({ 
    
    storage: multerAzure({
      connectionString: 'DefaultEndpointsProtocol=https;AccountName=wellfasterstore;AccountKey=6h3dY22tndMG0osMtVvtuE9qRYN/yoXk2jaUOUUjPOGujj3LaGht9iDr1CxVkn5r1M1cZCZIkpCnz1D07Gu2+g==;EndpointSuffix=core.windows.net', //Connection String for azure storage account, this one is prefered if you specified, fallback to account and key if not.
      account: 'wellfasterstore', //The name of the Azure storage account
      key: '6h3dY22tndMG0osMtVvtuE9qRYN/yoXk2jaUOUUjPOGujj3LaGht9iDr1CxVkn5r1M1cZCZIkpCnz1D07Gu2+g==', //A key listed under Access keys in the storage account pane
      container: 'images',  //Any container name, it will be created if it doesn't exist
      mimetype:"video/mp4",
      blobPathResolver: function(req, file, callback){
        var blobPath = ty(req, file); //Calculate blobPath in your own way.
        callback(null, blobPath);
      }
    })
  });
  
  function ty(req, file){
  return file.originalname;
  }

router.post('/user/signup', controllers.api.signup);
// router.post('/user/register', controllers.api.register);
router.post('/user/login', controllers.api.login);
router.post('/user/validate', controllers.api.validate);
router.post('/user/request', controllers.api.reset_user_password);
router.post('/user/reset', controllers.api.update_password);
router.post('/user/check_requset', controllers.api.check_passwordrequest);
router.get('/user/me', controllers.api.get_user_details);
router.post('/user/update_profile', controllers.api.update_profile);
router.post('/user/get_trainers_listing', controllers.api.get_trainers_listing);
router.post('/user/get_trainers_detail', controllers.api.get_trainers_detail);
router.post('/user/getuser_detail', controllers.api.getuser_detail);
router.post('/user/connect', controllers.api.connect);
router.post('/user/uploadImage', controllers.api.uploadImage);
router.post('/user/emailcheck', controllers.api.check_emailexist);
router.post('/user/savereview', controllers.api.savereview);
router.post('/user/hire_trainer', controllers.api.hire_trainer);
router.get('/user/get_hire_trainer_user', controllers.api.get_hire_trainer_user);
router.post('/user/addmessage', controllers.api.addmessage);
router.post('/user/get_message_trainer_user', controllers.api.get_message_trainer_user);
router.get('/user/logout', controllers.api.logout);
router.post('/user/accept_trainer', controllers.api.accept_trainer);
router.post('/user/save_setting', controllers.api.save_setting);
router.post('/user/change_password', controllers.api.change_password);
router.post('/user/update_messagetime', controllers.api.update_messagetime);
router.post('/user/create_subscription', controllers.api.create_subscription);
router.post('/user/checkpayment', controllers.api.checkpayment);
router.post('/user/changestatus', controllers.api.changestatus);
router.get('/user/payments', controllers.api.getsubscription);
router.post('/user/cancelsubscription', controllers.api.cancelsubscription);
router.post('/user/cancelsubscriptionplan', controllers.api.cancelsubscriptionplan);
router.post('/user/deletephoto', controllers.api.deletephoto);
router.post('/user/send_mail', controllers.api.send_mail);
router.get('/user/pendingrequset', controllers.api.pendingrequset);
router.post('/user/paymentsucess', controllers.api.paymentsucess);
router.post('/user/paymentsucessplan', controllers.api.paymentsucessplan);
router.get('/user/gettrainername/:search', controllers.api.gettrainername);
router.get('/user/getacceptedrequests', controllers.api.getacceptedrequests);
router.post('/user/getunreadmessage', controllers.api.getunreadmessage);
router.post('/user/uploadvideo', upload.any(), function (req, res, next) {
    console.log(req.files)
    res.send({"code":200,"imageurl":req.files[0].url})
  })





module.exports = router;














