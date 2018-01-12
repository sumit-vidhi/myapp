const express = require('express');
const controllers = require('./controllers').api;
var MyAppModel      = require('./models/dbconnection');
const moment        = require('moment');
const router = express.Router();


var cron = require('node-cron');
cron.schedule('* * * * *', function(req,res){
   
    userModel = new MyAppModel();
    userModel.query("select u.email,u.id,u.message_setting from  messages m left join users u on m.recipient_id =u.id  group by u.email,u.id,u.message_setting", function(err, userrows) {
        if(err) {
            console.log(err);
            //res.send({ status: 'error',logs: {},message: 'Internal server error. Please try again'});
    }else{   
       // console.log(userrows.recordset.length);
        if (userrows.recordset.length>0) {                     
          
         for(i in userrows.recordset)
         {
            userId=userrows.recordset[i].id;
            userEmail=userrows.recordset[i].email;
            messageSetting=userrows.recordset[i].message_setting;
            if(messageSetting==1){
                _sendmessage(userId,userEmail);
            }
            
         }

        }
     
    } 
    })

     var _sendmessage=function(userId,userEmail){
         console.log(232323);
        mysqlTimestamp =moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        userModel.query("select max(ml.message_id) as message_id  from  messages_logs ml where ml.user_id="+userId+" group by ml.message_id", function(err, messagelogsrows) {
            if(err) {
                console.log(err);
                res.send({ status: 'error',logs: {},message: 'Internal server error. Please try again'});
        }else{   
            if (messagelogsrows.recordset.length>1) { 
                count=messagelogsrows.recordset.length-1;
                messageId=messagelogsrows.recordset[count].message_id;
                var travelTime = moment().add(-15, 'minutes').format('YYYY-MM-DD HH:mm:ss');
                userModel.query("select m.id,m.recipient_id,m.sender_id,m.created_at,m.message,u.photo,u.name from  messages m left join users u on u.id=m.sender_id where  (m.recipient_id="+userId+" or  m.sender_id="+userId+") and m.created_at>='"+travelTime+"' and m.updated_at is null and m.id>"+messageId, function(err, messagerows) {
                    if(err) {
                        console.log(err);
                        res.send({ status: 'error',logs: {},message: 'Internal server error. Please try again'});
                }else{ 
                 console.log(messagerows.recordset);
                    countlength=messagerows.recordset.length-1;
                    if (messagerows.recordset.length>=1) {  
                        dateTime = new Date(messagerows.recordset[0].created_at);
                        dateTime = moment(dateTime).utc().format("YYYY-MM-DD HH:mm:ss");
                        console.log(dateTime);
                        console.log(mysqlTimestamp);
                        var d = new Date(mysqlTimestamp).getTime() -new Date(dateTime).getTime();
                        console.log(d);
                        if(d>800000){  
                    for(i in messagerows.recordset)
                    {
                        messageId=messagerows.recordset[i].id;
                        userid=userId;
                        
                        var field="message_id,user_id,created_at";
                        var values="'"+messageId+"','"+userid+"','"+mysqlTimestamp+"'";
                        console.log(values);
                        userModel.query("Insert  into messages_logs ("+field+")  values("+values+")", function(err, rows) {
                        if(err) {
                            //res.send({ code: 100,message: 'User not found'}); 
                        }else{
                            newUser={};
                            newUser.message="";
                            newUser.name=messageId=messagerows.recordset[i].name;;
                            newUser.image=messageId=messagerows.recordset[i].photo;;
                            newUser.message+=messagerows.recordset[i].message+" "+messagerows.recordset[i].crerated_at+"<br>";
                          
                            if(countlength==i){
                           // emailHelper.message(newUser, function(err, info){
          //  return  res.send({ code: 200,message: 'Message Successfully send.'}); 
                            //    });
                            } 
                            
                            
                        }
                    })
                       
                    }
                     
                        
                      } 
                     }
                }
            })
                                  
            }else{
                var travelTime = moment().add(-15, 'minutes').format('YYYY-MM-DD HH:mm:ss');
                q="select m.id,m.recipient_id,m.sender_id,m.created_at,m.message u.photo,u.name from  messages m left join users u u.id=m.sender_id where (m.recipient_id="+userId+" or  m.sender_id="+userId+") and m.created_at>="+travelTime+" and m.updated_at is null";
                console.log(q);
                userModel.query("select m.id,m.recipient_id,m.sender_id,CONVERT (datetime, m.created_at) as created_at,m.message, u.photo,u.name from  messages m left join users u on u.id=m.sender_id where (m.recipient_id="+userId+" or  m.sender_id="+userId+") and m.created_at>='"+travelTime+"' and m.updated_at is null", function(err, messagerows) {
                    if(err) {
                        console.log(err);
                        res.send({ status: 'error',logs: {},message: 'Internal server error. Please try again'});
                }else{ 
                    
                  console.log(messagerows);
                    countlength=messagerows.recordset.length-1;
                    if (messagerows.recordset.length>=1) { 
                       // moment.tz.setDefault('PST');
                         dateTime = new Date(messagerows.recordset[0].created_at);
                        dateTime = moment(dateTime).utc().format("YYYY-MM-DD HH:mm:ss");
                        console.log(dateTime);
                        console.log(mysqlTimestamp);
                        var d = new Date(mysqlTimestamp).getTime() -new Date(dateTime).getTime();
                        console.log(d);
                        if(d>800000){  
                    for(i in messagerows.recordset)
                    {
                        messageId=messagerows.recordset[i].id;
                        userid=userId;
                     
                        
                        var field="message_id,user_id,created_at";
                        var values="'"+messageId+"','"+userid+"','"+mysqlTimestamp+"'";
                        console.log(values);
                        userModel.query("Insert  into messages_logs ("+field+")  values("+values+")", function(err, rows) {
                        if(err) {
                            //res.send({ code: 100,message: 'User not found'}); 
                        }else{
                            newUser={};
                            newUser.message+=messagerows.recordset[i].message;
                           
                            if(countlength==i){
                          //  emailHelper.message(newUser, function(err, info){
          //  return  res.send({ code: 200,message: 'Message Successfully send.'}); 
                            //    });
                            }
                        }
                    })
                       
                    }
               
                       
                     
                        
                }

                }
            }
            })
    
            }
         
        } 
        })

     }

});



/**
 *  Follwing routes for user registration,user login,
 *  user authentication, token verification, email varification
 *  create user, edit user, delete user, get users
 */

router.post('/user/signup', controllers.api.signup);
router.post('/user/register', controllers.api.register);
router.post('/user/login', controllers.api.login);
router.post('/user/validate', controllers.api.validate);
router.post('/user/request', controllers.api.reset_user_password);
router.post('/user/reset', controllers.api.update_password);
router.post('/user/check_requset', controllers.api.check_passwordrequest);
router.get('/user/me', controllers.api.get_user_details);
router.post('/user/update_profile', controllers.api.update_profile);
router.post('/user/get_trainers_listing', controllers.api.get_trainers_listing);
router.post('/user/get_trainers_detail', controllers.api.get_trainers_detail);
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



module.exports = router;