var MyAppModel      = require('../../models/dbconnection');
const emailHelper 	= require('../../helpers/email');
let fn 				= require('../../helpers/functions');
const bcrypt        = require('bcrypt-nodejs');
const moment        = require('moment');
let Promise = require('bluebird');
var dateFormatpattern = require('dateformat');
const config = require('../../config');
const siteUrl = config.app.siteUrl;
var request = require("request");
//var dateFormat = require('dateformat');
var monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function escape_string(str) {
    if(typeof str !== "undefined" && str!=='') {
        return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
            switch (char) {
                case "\0":
                    return "\\0";
                case "\x08":
                    return "\\b";
                case "\x09":
                    return "\\t";
                case "\x1a":
                    return "\\z";
                case "\n":
                    return "\\n";
                case "\r":
                    return "\\r";
                case "\"":
                case "'":
                case "\\":
                case "%":
                    return "\\"+char; // prepends a backslash to backslash, percent,
                                      // and double/single quotes
            }
        });
    }
    else {
        return "";
    }    
}

function addslashes(str) {
    if(str!=='') {
        str = str.replace(/'/g, "'\'");
        return str;
    }
    else {
        return str;
    }
    
  }



function dateformat(){
    var today = new Date();
    var dd = today.getDate();
    
    var mm = today.getMonth()+1; 
    var yyyy = today.getFullYear();
    if(dd<10) 
    {
        dd='0'+dd;
    } 
    
    if(mm<10) 
    {
        mm='0'+mm;
    } 
    return today = mm+'-'+dd+'-'+yyyy;
}



module.exports = {




    register: function(req, res, next){ 
       // //console.log(2323213);
        return res.send({
			code : 200,
			message :req.body
		});
    },
    signup: function(req, res, next){ 
        var post = req.body;  
        ////console.log(post);    
          
        if(post && post.action=='register' && post.role) {
            if(post.email!=='' && post.password!=='' && (post.role==1 || post.role==2 || post.role!="")) {
               
                var username = post.email;        
                var password = post.password; 
                var password = bcrypt.hashSync(post.password, null, null);
               // //console.log(password);
                var role = post.role;
                var auth_token=fn.getRandStr();
                var confirm_token=fn.getToken(auth_token);
                var  newUser={};
                userModel = new MyAppModel();
                userModel.query("select * from users where  email='"+username+"'", function(err, rows) {
                    if(err) {
                          //  //console.log(err);
                            res.send({ status: 'error',logs: {},message: 'Internal server error. Please try again'});
                    }else{   
                        if (rows.recordset.length>0) {                     
                            res.send({ code: 100,message: 'Email is already exist'});                  
                        }else{
                            var mysqlTimestamp =moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
                            var todaydate=dateformat();
                            if(post.facebook_id!=""){
                                var auth_token=fn.getRandStr();
                                var facebook_id=post.facebook_id;
                                var is_loggedin = 1;
                                var photo=post.photo;

                            }else{
                                var auth_token="";
                                var facebook_id="";
                                var is_loggedin = 0;
                                if(role==2){
                                    var photo=post.photo;
                                }else{
                                    var photo="";
                                }
                               
                            }
                           
                            var confirm_token=fn.getRandStr();
                            var name = post.first_name+" "+post.last_name;
                            var field="name,email,password,auth_token,confirmation_token,facebook_id,role,photo,is_loggedin,created_at";
                            var values="'"+addslashes(name)+"','"+addslashes(username)+"','"+password+"','"+auth_token+"','"+confirm_token+"','"+facebook_id+"','"+role+"','"+photo+"','"+is_loggedin+"','"+mysqlTimestamp+"'";
                          //  //console.log(values);
                            userModel.query("Insert  into users ("+field+") OUTPUT Inserted.ID values("+values+")", function(err, rows) {
                            if(err) {
                                    //console.log(err);
                                    res.send({ status: 'error',logs: {},message: 'Internal server error. Please try again'});
                            }else{ 
                            user_id=rows.recordset[0].ID
                            if(role==1){
                                var field="user_id,first_name,last_name,nick_name,birth_date,phone_number,perferred_languages,second_language,height,"+
                                "weight,units,start_week,time_format,sleep_sensitivity,syride_length,heart_rate,timezone,description,city,country,zip,street";
                                var values="'"+user_id+"','"+addslashes(post.first_name)+"','"+addslashes(post.last_name)+"','"+addslashes(post.nickname)+"','"+post.birth_date+"','"+post.phone_number+"','"+post.preferred_language+"',"+
                                "'"+post.second_language+"','"+post.height+"','"+post.weight+"','"+post.unit+"','"+post.start_week+"','"+post.time_format+"',"+
                                "'"+post.sleep_senstivity+"','"+post.stride_length+"','"+post.heart_rate_zones+"','"+post.timezone+"','"+addslashes(post.description)+"','"+post.city+"','"+post.country+"','"+post.zip+"','"+post.street+"'";
                                
                                userModel.query("Insert  into users_details ("+field+") OUTPUT Inserted.ID values("+values+")", function(err, rows) {
                                    if(err) {
                                        //console.log(err);
                                        res.send({ status: 'error',logs: {},message: 'Internal server error. Please try again'});
                                }else{    
                                    newUser.first_name = post.first_name;
                                        newUser.last_name = post.last_name;
                                        newUser.email = post.email;
                                        newUser.code=confirm_token;
                                        newUser.id=user_id;
                                        if(post.facebook_id!=""){
                                            return  res.send({ code: 200,token:auth_token,message: 'facebookuser'}); 
                                        }else{
                                            emailHelper.sendAccountConfirmation(newUser, function(err, info){
                                                return  res.send({ code: 200,message: 'webuser'}); 
                                            });
                                        }
                                        }
                                })
                            }
                            if(role==2){
                                for(i=0;i<post.addresses.length;i++){
                                    education22 +=","+post.addresses[i].education;
                                     education_name +=","+post.addresses[i].education_name;
                                     year +=","+post.addresses[i].year;
                                  }
                                 var education22=education22.slice(10);
                                  var  education_name=education_name.slice(10);
                                 var year=year.slice(10);
                                post.specialities=(post.specialities.length>0)?post.specialities.join(","):"";
                                post.certifications="";
                                post.video=(post.video.length>0)?post.video.join(","):"";
                                var field="trainer_id,first_name,last_name,nick_name,birth_date,phone_number,perferred_languages,additional_language,specialities,"+
                                "education,certifications,description,addtional_description,city,street,country,zip,weeklyprice,timezone,licence,price_premiumweek,pricesubscription_week,pricesubscription_premiumweek,bank_name,registration_number,account_number,swift,iban,cvr_vat,video,education_name,education_year";
                                var values="'"+user_id+"','"+addslashes(post.first_name)+"','"+addslashes(post.last_name)+"','"+addslashes(post.nickname)+"','"+post.birth_date+"','"+post.phone_number+"','"+post.preferred_language+"',"+
                                "'"+post.second_language+"','"+post.specialities+"','"+education22+"','"+post.certifications+"','"+addslashes(post.short_description)+"','"+addslashes(post.description)+"',"+
                                "'"+addslashes(post.city)+"','"+addslashes(post.street)+"','"+post.country+"','"+addslashes(post.zip)+"','"+post.price_week+"','"+post.timezone+"','"+post.licence+"','"+post.price_premiumweek+"','"+post.pricesubscription_week+"','"+post.pricesubscription_premiumweek+"','"+addslashes(post.bank_name)+"','"+addslashes(post.registration_number)+"','"+addslashes(post.account_number)+"','"+addslashes(post.swift)+"','"+addslashes(post.iban)+"','"+addslashes(post.cvr_vat)+"','"+post.video+"','"+addslashes(education_name)+"','"+addslashes(year)+"'";
                            
                                userModel.query("Insert  into trainers_details ("+field+") OUTPUT Inserted.ID values("+values+")", function(err, rows) {
                                    if(err) {
                                        //console.log(err);
                                        res.send({ status: 'error',logs: {},message: 'Internal server error. Please try again'});
                                   }else{ 
                                    newUser.first_name = post.first_name;
                                    newUser.last_name = post.last_name;
                                    newUser.email = post.email;
                                    newUser.code=confirm_token;
                                    newUser.id=user_id;
                                    if(post.facebook_id!=""){
                                        return  res.send({ code: 200,token:auth_token,message: 'facebookuser'}); 
                                    }else{
                                        data={};
                                        emailHelper.sendadminTrainerhire(data, function(err, info  ){
                                            return  res.send({ code: 200,message: 'webuser'}); 
                                        });
                                    }
                                }
                                })

                            }
                        }                 
                        });
                        }
            }                      
                });
            }
            else {
                res.send({ code: 100,message: 'Invalid Data'});   
            }
        }
        else {
            res.send({ code: 100,message: 'Invalid Data '});   
        }
    },
    login:function(req,res,next){
         
        var post = req.body;        
        if(post) {
            if(post.username!=='' && post.password!=='') {
                var username = post.username;        
                var password = post.password;

                userModel = new MyAppModel();
                userModel.query("select id,auth_token,password,email,role,confirmed_at from users where  email='"+username+"'", function(err, rows) {
                ////console.log(rows.recordset.length);
                    if(err) {
                        //console.log(err);
                        res.send({ code: 100,message: 'Internal server error. Please try again'});
                }else{ 
                    if (rows.recordset.length<1) {                   
                      res.send({ code: 100,message: 'username_notexist'});                  
                    }
                    else { 
                        if (rows.recordset[0].confirmed_at==null && rows.recordset[0].role=='1') {
                            res.send({ code: 100,message: 'account confirmation error'});
                        } else{                      
                        if (!bcrypt.compareSync(password, rows.recordset[0].password)) {
                            res.send({ code: 100,message: 'Oops! Wrong password'});
                        }
                       else {
                            delete rows.recordset[0].password;
                            var auth_token=fn.getRandStr();
                                var q = "UPDATE users SET auth_token='"+auth_token+"', is_loggedin = '" + 1 + "' WHERE id='" + rows.recordset[0].id+"'";   
                                    userModel.query(q,function(err, result) {
                                    if(err) {
                                        //console.log(err);
                                       res.send({ code: 100,message: 'Internal server error. Please try again'});
                                    }
                                    else {
                                   
                                        res.send({ code: 200,data: auth_token,message: 'Success'});                                        
                                    }
                                });    
                           
                       }
                   }
                }
                }                    
                });
            }
        }
        else {
            res.send({ code: 100,message: 'A valid username is required'});   
        }
    },

    validate:function(req,res,next){
        
       var post = req.body;        
       if(post) {   
           if(post.token!=='' && post.id!=='') {
              var token=post.token;
              var userId=post.id;
               userModel = new MyAppModel();
               userModel.query("select * from users where  confirmation_token='"+token+"' and id="+userId  , function(err, rows) {
                if (rows.recordset.length<1) {                   
                     res.send({ code: 100,message: 'A valid confirmation_token is required'});                  
                   }
                   else { 
                       if (rows.recordset[0].confirmed_at!=null ) {
                           res.send({ code: 100,message: 'Oops! Account Already Activate'});
                       }
                       else {
                           todaydate=dateformat();
                               var q = "UPDATE users SET confirmed_at = '" + todaydate + "' WHERE id='" +userId+"'";   
                                   userModel.query(q,function(err, result) {
                                   if(err) {
                                       //console.log(err);
                                      res.send({ code: 100,message: 'Internal server error. Please try again'});
                                   }
                                   else {
                                       res.send({ code: 200,message: 'Success'});                                        
                                   }
                               });    
                          
                       }
                   }                    
               });
           }
       }
       else {
           res.send({ code: 100,message: 'A valid username is required'});   
       }
   },

   reset_user_password: function(req, res, next){ 
    var post = req.body;        
    if(post) {
        if(post.email!=='') {
          
                userModel = new MyAppModel();
                var qd = "SELECT * FROM users WHERE email='"+post.email+"'";                            
                userModel.query(qd,function(err, rows) {
                    if(err) {
                        res.send({ code: 100,message: 'Oops! Email address does not exist in our database.'});                            
                    }
                    if (rows.recordset.length<1) {                   
                        res.send({ code: 100,message: 'A valid Email is required'});                  
                    }else{
                    if (rows.recordset[0].confirmed_at==null ) {
                        res.send({ code: 100,message: 'Oops! Account disable'});
                    }
                    else {                           
                        var rePass=parseInt(new Date().getTime().toString().substring(0, 10));                        
                        var q = "UPDATE users SET password_token='"+ rePass+"' WHERE email='"+post.email+"'";                                
                        userModel.query(q,function(err, urows) {
                            if(err) {
                               res.send({ code: 100,message: 'Password not updated. Please try again'});
                            }
                            else {
                                newUser={};
                                newUser.name = rows.recordset[0].name;
                                newUser.email = post.email;
                                newUser.code=rePass;
                                newUser.id= rows.recordset[0].id;
                                emailHelper.sendRequestPassword(newUser, function(err, info  ){
                                    res.send({ code: 200,message: 'Password reset instructions have been emailed to you, follow the link in the email to continue'});                                       
                                });                                      
                            }
                        });    
                        
                    }
                 }
                });
            
            } 
            else {
                 res.send({ status: 'error',logs: {},message: 'validation error'});
            }        
        }
    
},    

change_password: function(req, res, next){ 
    var post = req.body; 
    let accessToken = req.get('Authorization');       
    if(post) {
        if(post.old_password!=='' && post.password!=='') {
                userModel = new MyAppModel();
                var qd = "SELECT password,id FROM users  WHERE auth_token='"+accessToken+"'";                           
                userModel.query(qd,function(err, rows) {
                    if(err) {
                        res.send({ code: 100,message: 'User not found'});                            
                    }
                    if (rows.recordset.length<1) {                   
                        res.send({ code: 100,message: 'A valid user is required'});                  
                    } 
                    else {
                                            
                        if (!bcrypt.compareSync(post.oldpassword, rows.recordset[0].password)) {                               
                            res.send({ code: 100,logs: {},message: 'Oops! Wrong old password.'});          
                        }
                        else {
                            post.password = bcrypt.hashSync(post.password, null, null);  // use the generateHash function in our user model
                            var q = "UPDATE users SET password='"+ post.password+"' WHERE id='"+rows.recordset[0].id+"'";                                
                            userModel.query(q,function(err, rows) {
                                if(err) {
                                   res.send({ code: 100,message: 'Password not updated. Please try again'});
                                }
                                else {
                                    res.send({ code: 200,message: 'Password updated successfully'});                                       
                                }
                            });    
                        }
                    }
                });
                  
        }
    }
    else {
        res.send({ status: 'error',logs: {},message: 'Validation error'});   
    }
},  


update_password: function(req, res, next){ 
    var post = req.body;        
    if(post) {
        if(post.password!=='' && post.confirm_password!=='' && post.user_id!=='') { 
                userModel = new MyAppModel();
                var qd = "SELECT password FROM users WHERE id='"+post.user_id+"'";                            
                userModel.query(qd,function(err, rows) {
                    if(err) {
                        res.send({ code: 100,message: 'User not found'});                            
                    }
                    if (rows.recordset.length<1) {                   
                        res.send({ code: 100,message: 'A valid user is required'});                  
                    }
                    else {
                       
                            post.password = bcrypt.hashSync(post.password, null, null);  // use the generateHash function in our user model
                            var q = "UPDATE users SET password='"+ post.password+"' WHERE id='"+post.user_id+"'";                                
                            userModel.query(q,function(err, rows) {
                                if(err) {
                                   res.send({ code: 100,message: 'Password not updated. Please try again'});
                                }
                                else {
                                    res.send({ code: 200,message: 'Password updated successfully'});                                       
                                }
                            });    
                        
                    }
                });
            } 
            else {
                 res.send({ code: 100,message: 'validation error'});
            }        
        }
   },

   check_passwordrequest: function(req, res, next){ 
    var post = req.body;        
    if(post) {
        if(post.id!=='' && post.token!=='') { 
                userModel = new MyAppModel();
                var qd = "SELECT * FROM users WHERE id='"+post.id+"' and password_token='"+post.token+"'";                            
                userModel.query(qd,function(err, rows) {
                    if(err) {
                        res.send({ code: 100,message: 'User not found'});                            
                    }
                    if (rows.recordset.length<1) {                   
                        res.send({ code: 100,message: 'A valid user is required'});                  
                    }                      
                    
                    else {
                       res.send({ code: 200,user_id:post.id,message: 'Password Requset accept'});                                       
                          
                    }
                });
            } 
            else {
                 res.send({ code: 100,message: 'validation error'});
            }        
        }
   },



   check_emailexist: function(req, res, next){ 
    var post = req.body; 
     if(post) {
        if(post.email!=='') { 
                userModel = new MyAppModel();
                var qd = "SELECT * FROM users WHERE email='"+post.email+"'";                            
                userModel.query(qd,function(err, rows) {
                    if(err) {
                        res.send({ code: 100,message: 'User not found'});                            
                    }
                    if (rows.recordset.length<1) {                   
                        res.send({ code: 200,message: 'Email not exist in database'});                  
                    }                      
                    
                    else {
                       res.send({ code: 100,message: 'email exist'});                                       
                          
                    }
                });
            } 
            else {
                 res.send({ code: 100,message: 'validation error'});
            }        
        }
   },
   getunreadmessage:function(req, res, next){ 
       post=req.body;
    if(post){

        userModel = new MyAppModel();
    var qd = "select count(*) as message from messages where recipient_id="+post.id+" and updated_at is null";                            
    userModel.query(qd,function(err, userrows) {

        if(err) {
            res.send({ code: 100,message: 'User not found'});                            
        }
        if (userrows.recordset.length<1) {                   
            res.send({ code: 100,message: 'A valid user is required'});                  
        } else if(userrows.recordset[0].message>0){
            res.send({ code: 200,data:userrows.recordset[0].message,message: 'Trainers List'});    
        }else if(userrows.recordset[0].message==0){
            res.send({ code: 100,data:"",message: 'Trainers List'});    
        }
    })
}
   },

   get_user_details:function(req, res, next){ 
    console.log(23232323);
    var accessToken = req.get('Authorization');
   
    console.log(accessToken);
    //var post = req.body;        
    if(accessToken) {
        if(accessToken!=='') { 
                userModel = new MyAppModel();
                var qd = "SELECT role,id FROM users  WHERE auth_token='"+accessToken+"'";                            
                userModel.query(qd,function(err, rows) {
                    if(err) {
                        res.send({ code: 100,message: 'User not found'});                            
                    }
                    if (rows.recordset.length<1) {                   
                        res.send({ code: 100,message: 'A valid user is required'});                  
                    } 
                   
                    
                    else {
                                            
                       
                   role=rows.recordset[0].role;
                   userId=rows.recordset[0].id;
           
                if(role==1){
                 table="users_details  ud";
                 refer="ud";
                 key="user_id";
                 fields="ud.first_name,ud.last_name,ud.nick_name,ud.birth_date,ud.phone_number,ud.perferred_languages,ud.second_language,ud.height,"+
                 "ud.weight,ud.units,ud.start_week,ud.time_format,ud.sleep_sensitivity,ud.syride_length,ud.heart_rate,ud.timezone,ud.description,ud.state,ud.city,ud.country,ud.zip,ud.street,ud.age,ud.treatment,ud.activity_onjob,"+
                 "ud.activity_ontime,ud.motivating,ud.no_go,ud.neck,ud.shoulder,ud.days,ud.experience,ud.biceps,ud.chest,ud.waist,ud.hips,ud.thigh,ud.calf,ud.phyical,ud.bodyphoto,ud.skype_address,ud.clock_display";
                }
                if(role==2){
                    table="trainers_details  td";
                    refer="td";
                    key="trainer_id";
                     fields="td.first_name,td.video,td.licence,td.bank_name,td.account_number,td.iban,td.swift,td.cvr_vat,td.registration_number,td.timezone,td.last_name,td.nick_name,td.birth_date,td.phone_number,td.perferred_languages,td.additional_language,td.specialities,"+
                    "td.education,td.certifications,td.description,td.addtional_description,td.state,td.city,td.street,td.country,td.zip,td.weeklyprice,td.price_premiumweek,td.pricesubscription_week,td.pricesubscription_premiumweek,td.education_name,td.education_year";
                }
                var qd = "SELECT (select count(*) from trainers_hire where (trainer_id="+userId+" or user_id="+userId+") and status=1) as hiredata, (select count(*) from messages where recipient_id="+userId+" and updated_at is null) as message,u.id,u.approve,u.comment,u.availblity,u.photo,u.email,u.role,"+fields+" FROM users  u left join "+table+" on "+refer+"."+key+"=u.id WHERE  u.auth_token='"+accessToken+"'";                            
                userModel.query(qd,function(err, userrows) {
                    //console.log(userrows);
                    if(err) {
                        res.send({ code: 100,message: 'User not found'});                            
                    }
                    else {
                        if (userrows.recordset.length<1) {                   
                            res.send({ code: 100,message: 'A valid user is required'});                  
                        }                      
                        
                        else {
                           
                           res.send({ code: 200,data:userrows.recordset[0],message: 'User details'});  
                            if (rows.recordset[0].confirmed_at=='' || rows.recordset[0].confirmed_at==null) {
                       
                        todaydate=dateformat();
                            var q = "UPDATE users SET confirmed_at = '" + todaydate + "' WHERE id='" +rows.recordset[0].id+"'";   
                                userModel.query(q,function(err, result) {
                                
                            });    
                       
                    
                         }                                      
                            
                              
                        }
                    }
                });
            }
            });
            } 
            else {
                 res.send({ code: 100,message: 'validation error'});
            }        
        }else {
            res.send({ code: 100,message: 'validation error'});
       } 

   },

   update_profile:function(req,res,next){
    let accessToken = req.get('Authorization');
    var post = req.body; 
    // //console.log(post);
    // return res.send({
    //     code : 200,
    //     message :req.body
    // });  
    if(accessToken) {
        if(accessToken!=='' && post) { 
                userModel = new MyAppModel();
                var qd = "SELECT role,id FROM users  WHERE auth_token='"+accessToken+"'";                            
                userModel.query(qd,function(err, rows) {
                    if(err) {
                        res.send({ code: 100,message: 'User not found'});                            
                    }
                    if (rows.recordset.length<1) {                   
                        res.send({ code: 100,message: 'A valid user is required'});                  
                    } 
                    else 
                    {
                        if(post.update){
                           account=post.update;
                        }else{
                            account=""; 
                        }
                     name=addslashes(post.first_name)+" "+addslashes(post.last_name);
                     var q = "UPDATE  users SET photo='"+post.photo+"',name='"+name+"',account='"+account+"' WHERE id='"+rows.recordset[0].id+"'";                            
                     userModel.query(q,function(err, rows) {
                      if(err){
                              res.send({ code: 100,message: 'Error'});
                      }
                         })
                               
                         role=rows.recordset[0].role;
                            if(post.role==1){
                        post.birth_date=post.birth_date.replace(" ","/");
                        var data="first_name='"+addslashes(post.first_name)+"',last_name='"+addslashes(post.last_name)+"',nick_name='"+addslashes(post.nickname)+"',birth_date='"+post.birth_date+"',phone_number='"+post.phone_number+"',perferred_languages='"+post.perferred_languages+"',second_language='"+post.additional_language+"',height='"+post.height+"',weight='"+post.weight+"',units='"+addslashes(post.units)+"',start_week='"+post.start_week+"',time_format='"+post.time_format+"',sleep_sensitivity='"+addslashes(post.sleep_sensitivity)+"',syride_length='"+addslashes(post.syride_length)+"',heart_rate='"+addslashes(post.heart_rate_zones)+"',timezone='"+post.timezone+"',age='"+addslashes(post.age)+"',treatment='"+addslashes(post.treatment)+"',activity_onjob='"+post.activity_onjob+"',activity_ontime='"+post.activity_ontime+"',motivating='"+addslashes(post.motivating)+"',no_go='"+addslashes(post.no_go)+"',neck='"+addslashes(post.neck)+"',shoulder='"+addslashes(post.shoulder)+"',days='"+addslashes(post.days)+"',experience='"+addslashes(post.experience)+"',biceps='"+addslashes(post.biceps)+"',chest='"+addslashes(post.chest)+"',waist='"+addslashes(post.waist)+"',hips='"+addslashes(post.hips)+"',thigh='"+addslashes(post.thigh)+"',calf='"+addslashes(post.calf)+"',bodyphoto='"+post.bodyphoto+"',skype_address='"+addslashes(post.skype_address)+"',phyical='"+addslashes(post.phyical)+"',description='"+addslashes(post.addtional_description)+"',state='"+addslashes(post.state)+"',city='"+addslashes(post.city)+"',country='"+post.country+"',zip='"+addslashes(post.zip)+"',street='"+addslashes(post.street)+"',clock_display='"+post.clock_display+"'";
                                table="users_details";
                                id="user_id";
                            }
                            if(post.role==2){
                                for(i=0;i<post.addresses.length;i++){
                                   education22 +=","+post.addresses[i].education;
                                    education_name +=","+addslashes(post.addresses[i].education_name);
                                    year +=","+post.addresses[i].year;
                                 }
                                var education22=education22.slice(10);
                                 var  education_name=education_name.slice(10);
                                var year=year.slice(10);
                                post.birth_date=post.birth_date.replace(" ","/");
                                post.specialities=(post.specialities.length>0)?post.specialities.join(","):"";
                                post.certifications=(post.certifications.length>0)?post.certifications.join(","):"";
                                post.video=(post.video.length>0)?post.video.join(","):"";
                                var data="first_name='"+addslashes(post.first_name)+"',last_name='"+addslashes(post.last_name)+"',nick_name='"+addslashes(post.nickname)+"',birth_date='"+post.birth_date+"',phone_number='"+post.phone_number+"',perferred_languages='"+post.perferred_languages+"',additional_language='"+post.additional_language+"',specialities='"+post.specialities+"',education='"+education22+"',education_name='"+education_name+"',education_year='"+year+"',certifications='"+post.certifications+"',description='"+addslashes(post.description)+"',addtional_description='"+addslashes(post.addtional_description)+"',city='"+addslashes(post.city)+"',street='"+addslashes(post.street)+"',country='"+post.country+"',zip='"+addslashes(post.zip)+"',weeklyprice='"+addslashes(post.weeklyprice)+"',state='"+addslashes(post.state)+"',timezone='"+post.timezone+"',licence='"+post.licence+"',video='"+post.video+"',bank_name='"+addslashes(post.bank_name)+"',registration_number='"+addslashes(post.registration_number)+"',account_number='"+addslashes(post.account_number)+"',swift='"+addslashes(post.swift)+"',iban='"+addslashes(post.iban)+"',price_premiumweek='"+addslashes(post.price_premiumweek)+"',pricesubscription_week='"+addslashes(post.pricesubscription_week)+"',pricesubscription_premiumweek='"+addslashes(post.pricesubscription_premiumweek)+"',cvr_vat='"+addslashes(post.cvr_vat)+"'";
                                table="trainers_details";
                                id="trainer_id";
                            }
                            var q = "UPDATE  "+table+" SET "+data+" WHERE "+id+"='"+rows.recordset[0].id+"'";
                            //console.log(q);                            
                            userModel.query(q,function(err, rows) {
                                if(err){
                                        
                                    res.send({ code: 100,message: 'Error'});

                                }else{
                                    
                                    res.send({ code: 200,message: 'Profile Updated'}); 

                                }   
                            })

                    }
                
                });

            }
         }
    

   },


  
   get_trainers_listing:function(req, res, next){ 
    let accessToken = req.get('Authorization');
    //console.log(accessToken);
    post=req.body;
    //console.log(post);
        if(post) { 
            if(post.order!="" && post.order){
               orderby=post.order;
            }else{
                orderby="id DESC";
            }
            var q="";
            if(post.location!="" && post.location){
                term=post.location;
                wildcard="'%"+term+"%'";
                q+="and u.name like  "+wildcard;
             }
             if(post.speciality!="" && post.speciality){
                term=post.speciality;
                wildcard="'%"+term+"%'";
                q+="and td.specialities like  "+wildcard;
             }
             if(post.city!="" && post.city){
                term=post.city;
                wildcard="'%"+term+"%'";
                q+="and (td.city like  "+wildcard;
             }
             if(post.specialites!="" && post.specialites){
                term=post.specialites;
                wildcard="'%"+term+"%'";
                q+="or td.specialities like  "+wildcard+")";
             }
             

             if(post.rating!="" && post.rating){
                term=post.rating;
               // wildcard="'%"+term+"%'";
                q+="and ((select ROUND(avg(rating),0) from trainers_reviews where td.trainer_id=trainers_reviews.trainer_id)>"+term+" or (select ROUND(avg(rating),0) from trainers_reviews where td.trainer_id=trainers_reviews.trainer_id)="+term+")";
             }
                 userModel = new MyAppModel();
                 if(accessToken){
                 var qd = "SELECT role,id FROM users  WHERE auth_token='"+accessToken+"'";                            
                 userModel.query(qd,function(err, rows) {
                     if(err) {
                         res.send({ code: 100,message: 'User not found'});                            
                     }
                     if (rows.recordset.length<1) {                   
                         res.send({ code: 100,message: 'A valid user is required'});                  
                     } 
                     else 
                     {
                        userId=rows.recordset[0].id;
                        if(!post.page){
                            page=0;
                         }else{
                             page=post.page;
                             page=3*page;
                         }
                         //console.log()
                         var table="trainers_details  td";
                         var  refer="td";
                         var key="trainer_id";
                         var  fields="td.first_name,td.last_name,td.nick_name,td.birth_date,td.phone_number,td.perferred_languages,td.additional_language,td.specialities,"+
                         "td.education,td.certifications,td.description,td.addtional_description,td.city,td.street,td.country,td.zip,td.weeklyprice  ";
                  
                     var qd = "SELECT (select count(*) from trainers_hire where (user_id="+userId+" and trainer_id=u.id) and status=0) as isPending,(select count(*) from trainers_hire where ( user_id="+userId+" and trainer_id=u.id) and status=1) as isHired,u.id,u.photo,u.email,u.is_loggedin,u.role,(select count(*) from trainers_hire where trainers_hire.user_id=u.id or trainers_hire.trainer_id=u.id) as hire,(select ROUND(avg(rating),0) as rating from trainers_reviews where td.trainer_id=trainers_reviews.trainer_id) as rating,u.name,"+fields+" FROM users  u left join "+table+" on "+refer+"."+key+"=u.id where u.role=2 and u.approve='accept' and (u.availblity is null or u.availblity='Available')  and u.confirmed_at!=''  "+q+" order by "+orderby+" OFFSET "+page+" ROWS FETCH NEXT 3   ROWS ONLY";                            
                   console.log(qd);
                    
                     userModel.query(qd,function(err, rows) {
                         if(err) {
                             res.send({ code: 100,message: 'User not found'});                            
                         }
                         else {
                             if (rows.recordset.length<1) {                   
                                 res.send({ code: 100,message: 'Trainers not found'});                  
                             }     
     
                             
                             else {
      var qd = "SELECT count(u.id) as count FROM users  u left join "+table+" on "+refer+"."+key+"=u.id where u.role=2 and  u.approve='accept' and  (u.availblity is null or u.availblity='Available')  and  u.confirmed_at!='' "+q;                            
     userModel.query(qd,function(err, totalrows) {
                                 res.send({ code: 200,data:rows.recordset,totaldata:totalrows.recordset[0].count,message: 'Trainers List'});    
                         
                                })            
                             }
                         }
                     });
                     }

                    })
                }else{
                    if(!post.page){
                        page=0;
                     }else{
                         page=post.page;
                         page=3*page;
                     }
                     //console.log()
                     table="trainers_details  td";
                     refer="td";
                     key="trainer_id";
                      fields="td.first_name,td.last_name,td.nick_name,td.birth_date,td.phone_number,td.perferred_languages,td.additional_language,td.specialities,"+
                     "td.education,td.certifications,td.description,td.addtional_description,td.city,td.street,td.country,td.zip,td.weeklyprice  ";
              
                 var qd = "SELECT u.id,u.photo,u.email,u.role,(select ROUND(avg(rating),0) as rating from trainers_reviews where td.trainer_id=trainers_reviews.trainer_id) as rating,u.name,"+fields+" FROM users  u left join "+table+" on "+refer+"."+key+"=u.id where u.role=2  "+q+" order by "+orderby+" OFFSET "+page+" ROWS FETCH NEXT 3   ROWS ONLY";                            
               
                
                 userModel.query(qd,function(err, rows) {
                     if(err) {
                         res.send({ code: 100,message: 'User not found'});                            
                     }
                     else {
                         if (rows.recordset.length<1) {                   
                             res.send({ code: 100,message: 'Trainers not found'});                  
                         }     
 
                         
                         else {
  var qd = "SELECT count(u.id) as count FROM users  u left join "+table+" on "+refer+"."+key+"=u.id where u.role=2  "+q;                            
 userModel.query(qd,function(err, totalrows) {
                             res.send({ code: 200,data:rows.recordset,totaldata:totalrows.recordset[0].count,message: 'Trainers List'});    
                     
                            })            
                         }
                     }
                 });
                }
                            
                  
             } 
            else {
                 res.send({ code: 100,message: 'validation error'});
            }        
        
   

   }, 

   get_trainers_detail:function(req, res, next){ 
    let accessToken = req.get('Authorization');
   var  post=req.body;
    if(post) {
       trainerId=post.id;
            
                    userModel = new MyAppModel();
                    if(accessToken){
                        var qd = "SELECT role,id FROM users  WHERE auth_token='"+accessToken+"'";                            
                        userModel.query(qd,function(err, rows) {
                            if(err) {
                                res.send({ code: 100,message: 'User not found'});                            
                            }
                            if (rows.recordset.length<1) {                   
                                res.send({ code: 100,message: 'A valid user is required'});                  
                            } 
                            else 
                            {
                                userId=rows.recordset[0].id;
                                table="trainers_details  td";
                                refer="td";
                                key="trainer_id";
                                 fields="td.first_name,td.video,td.last_name,td.nick_name,td.birth_date,td.phone_number,td.perferred_languages,td.additional_language,td.specialities,"+
                                "td.education,td.certifications,td.description,td.addtional_description,td.city,td.street,td.country,td.zip,td.weeklyprice,td.pricesubscription_week,td.pricesubscription_premiumweek,td.price_premiumweek,td.education_name,td.education_year";
                           
                            var qd = "SELECT (select count(*) from trainers_hire where (user_id="+userId+" and trainer_id=u.id) and status=0) as isPending,(select count(*) from trainers_hire where ( user_id="+userId+" and trainer_id=u.id) and status=1) as isHired,u.id,u.photo,u.email,u.is_loggedin,u.role,(select avg(rating) from trainers_reviews where td.trainer_id=trainers_reviews.trainer_id) as rating,u.name,"+fields+" FROM users  u left join "+table+" on "+refer+"."+key+"=u.id where u.role=2 and u.id="+trainerId;                            
                            userModel.query(qd,function(err, rows) {
                                if(err) {
                                    res.send({ code: 100,message: 'User not found'});                            
                                }
                                else {
                                    if (rows && rows.recordset.length<1) {                   
                                        res.send({ code: 100,message: 'Trainers not found'});                  
                                    }     
            
                                    
                                    else {
                                        var qd = "SELECT trainers_reviews.*,users.name from trainers_reviews join users on users.id=trainers_reviews.user_id where trainers_reviews.status=1 and trainers_reviews.trainer_id="+rows.recordset[0].id;                            
                                        userModel.query(qd,function(err, reviwsdata) {
                                            if(err) {
                                                res.send({ code: 100,message: 'User not found'});                            
                                            }
                                            else {
                                                if (rows.recordset.length<1) {                   
                                                    res.send({ code: 100,message: 'Trainers not found'});                  
                                                }     
                        
                                                
                                                else {
                                                    var output=reviwsdata.recordset;
                                                    var temp = {};
                                                    for(i in reviwsdata.recordset){
                                                        for(Field in reviwsdata.recordset[i])
                                                        {
                                                             if(Field == "created_at") {
                                                               var created =dateFormatpattern(reviwsdata.recordset[i]['created_at'], "mmmm dS, yyyy");
                                                               var time =dateFormatpattern(reviwsdata.recordset[i]['created_at'], "h:MM:ss TT");
                                                               output[i].created=created;
                                                               output[i].time=time;
                                                            }
                                                           
                                                        }
                                                    }
                                                    res.send({ code: 200,data:rows.recordset,reviewdata:output,totalreview:reviwsdata.recordset.length,message: 'Trainers Details'});     
                                            
                                                               
                                                }
                                            }
                                        });
            
                                          
                                
                                                   
                                    }
                              
                        }
                        });

                            }
                        })
                    }else{
                    table="trainers_details  td";
                    refer="td";
                    key="trainer_id";
                     fields="td.first_name,td.last_name,td.nick_name,td.birth_date,td.phone_number,td.perferred_languages,td.additional_language,td.specialities,"+
                    "td.education,td.certifications,td.description,td.addtional_description,td.city,td.street,td.country,td.zip,td.weeklyprice  ";
               
                var qd = "SELECT u.id,u.photo,u.email,u.is_loggedin,u.role,(select avg(rating) from trainers_reviews where td.trainer_id=trainers_reviews.trainer_id) as rating,u.name,"+fields+" FROM users  u left join "+table+" on "+refer+"."+key+"=u.id where u.role=2 and td.trainer_id="+post.id;                            
                userModel.query(qd,function(err, rows) {
                    if(err) {
                        res.send({ code: 100,message: 'User not found'});                            
                    }
                    else {
                        if (rows.recordset.length<1) {                   
                            res.send({ code: 100,message: 'Trainers not found'});                  
                        }     

                        
                        else {
                            var qd = "SELECT trainers_reviews.*,users.name from trainers_reviews join users on users.id=trainers_reviews.user_id where trainers_reviews.status=1 and trainers_reviews.trainer_id="+rows.recordset[0].id;                            
                            userModel.query(qd,function(err, reviwsdata) {
                                if(err) {
                                    res.send({ code: 100,message: 'User not found'});                            
                                }
                                else {
                                    if (rows.recordset.length<1) {                   
                                        res.send({ code: 100,message: 'Trainers not found'});                  
                                    }     
            
                                    
                                    else {
                                        var output=reviwsdata.recordset;
                                        var temp = {};
                                        for(i in reviwsdata.recordset){
                                            for(Field in reviwsdata.recordset[i])
                                            {
                                                 if(Field == "created_at") {
                                                   var created =dateFormatpattern(reviwsdata.recordset[i]['created_at'], "mmmm dS, yyyy");
                                                   var time =dateFormatpattern(reviwsdata.recordset[i]['created_at'], "h:MM:ss TT");
                                                   output[i].created=created;
                                                   output[i].time=time;
                                                }
                                               
                                            }
                                        }
                                        res.send({ code: 200,data:rows.recordset,reviewdata:output,totalreview:reviwsdata.recordset.length,message: 'Trainers Details'});     
                                
                                                   
                                    }
                                }
                            });

                              
                    
                                       
                        }
                  
            }
            });
        }       
        }else {
            res.send({ code: 100,message: 'validation error'});
       } 
   

   },

   getuser_detail:function(req, res, next){ 
    let accessToken = req.get('Authorization');
    var  post=req.body;
    if(post) {
             user_Id=post.id;
                    userModel = new MyAppModel();
                    if(accessToken){
                        var qd = "SELECT role,id FROM users  WHERE auth_token='"+accessToken+"'";                            
                        userModel.query(qd,function(err, rows) {
                            if(err) {
                                res.send({ code: 100,message: 'User not found'});                            
                            }
                            if (rows.recordset.length<1) {                   
                                res.send({ code: 100,message: 'A valid user is required'});                  
                            } 
                            else 
                            {
                                userId=rows.recordset[0].id;
                                table="users_details  td";
                                refer="td";
                                key="user_id";
                                 fields="td.*";
                           
                            var qd = "SELECT u.id,u.photo,u.email,u.is_loggedin,u.role,u.name,"+fields+" FROM users  u left join "+table+" on "+refer+"."+key+"=u.id where u.role=1 and td.user_id="+user_Id;                            
                            userModel.query(qd,function(err, rows) {
                                if(err) {
                                    res.send({ code: 100,message: 'User not found'});                            
                                }
                                else {
                                    if (rows.recordset.length<1) {                   
                                        res.send({ code: 100,message: 'Trainers not found'});                  
                                    }     
            
                                    
                                    else {
                                       
                                                    res.send({ code: 200,data:rows.recordset,message: 'Trainers Details'});     
                                            
            
                                          
                                
                                                   
                                    }
                              
                        }
                        });

                            }
                        })
                    }  
        }else {
            res.send({ code: 100,message: 'validation error'});
       } 
   

   },


   connect:function(req,res,next){
    var post = req.body;
    console.log(23233);      
    if(post) {
        if(post.id!=='' && post.provider!=='' && post.email!=='') { 
                userModel = new MyAppModel();
                if(post.provider=="FACEBOOK"){
                    var qd = "SELECT * FROM users WHERE facebook_id='"+post.id+"'  or email='"+post.email+"'";  
                    google_id="";
                    facebook_id=post.id; 
                }
                if(post.provider=="GOOGLE"){
                    var qd = "SELECT * FROM users WHERE google_id='"+post.id+"' or email='"+post.email+"'";  
                    google_id=post.id;
                    facebook_id="";   
                }
                                       
                userModel.query(qd,function(err, rows) {
                    if(err) {
                        res.send({ code: 100,message: 'User not found'});                            
                    }
                    if (rows.recordset.length<1) {                   
                    //     var mysqlTimestamp =moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
                    //     var todaydate=dateformat();
                    //     var name = post.name;
                    //       fname=name.split(" ");
                    //     var auth_token=fn.getRandStr();
                    //     todaydate=dateformat();
                    //     var field="name,email,password,auth_token,role,facebook_id,google_id,confirmed_at,photo,created_at";
                    //     var values="'"+name+"','"+post.email+"','','"+auth_token+"','1','"+facebook_id+"','"+google_id+"',"+todaydate+",'"+post.photoUrl+"','"+mysqlTimestamp+"'";
                    //     //console.log(values);
                    //     userModel.query("Insert  into users ("+field+") OUTPUT Inserted.ID values("+values+")", function(err, rows) {
                    //     if(err) {
                    //         res.send({ code: 100,message: 'User not found'}); 
                    //     }else{
                    //         user_id=rows.recordset[0].ID
                    //         var field="user_id,first_name,last_name";
                    //         var values="'"+user_id+"','"+fname[0]+"','"+fname[1]+"'";
                    //         userModel.query("Insert  into users_details ("+field+") OUTPUT Inserted.ID values("+values+")", function(err, rows) {
                    //             if(err) {
                    //                 res.send({ code: 100,message: 'User not found'}); 
                    //             }else{
                                   
                    //                 res.send({ code: 200,token:auth_token,message: 'Login success'});  
                    //             }
                    //         })
                            
                    //     }
                    // }) 
                    res.send({ code: 200,message: 'newuser'});
                    
                    }else {
                        id=rows.recordset[0].id;
                        var auth_token=fn.getRandStr();
                        todaydate=dateformat();
                        var qd = "UPDATE users SET auth_token='"+ auth_token+"',email='"+ post.email+"',facebook_id='"+ facebook_id+"',google_id='"+ google_id +"',confirmed_at='"+todaydate+"',photo='"+ post.photoUrl +"'  WHERE id='"+id+"'"; 
                       console.log(qd);
                        userModel.query(qd,function(err, rows) {
                            if(err) {
                                res.send({ code: 100,message: 'User not found'});                            
                            }else{
                                res.send({ code: 200,token:auth_token,message: 'existuser'}); 
                            }
                        })
                                                             
                          
                    }
                });
            } 
            else {
                 res.send({ code: 100,message: 'validation error'});
            }        
        }
   },

//    uploadvideo: function(req, res, next){
//     upload(req, res, function (err) {
//     console.log(2222);
//     console.log(req.files);
//     })
    //    var formidable=require("formidable");
    // var form = new formidable.IncomingForm();
    // console.log(form);
    // var azure = require('azure');
    // var accessKey = '6h3dY22tndMG0osMtVvtuE9qRYN/yoXk2jaUOUUjPOGujj3LaGht9iDr1CxVkn5r1M1cZCZIkpCnz1D07Gu2+g==';
    // var storageAccount = 'wellfasterstore';
  
    // var blobService = azure.createBlobService(storageAccount, accessKey);
    // form.parse(req, function(err, fields, files) {
    //     var options = {
    //             contentType: files.image.type,
    //             metadata: { fileName: files.image.name }
    //     };
    //     blobService.createBlockBlobFromLocalFile('images', files.image  .name, files.image.path, options, function(error, result, response) {
    //         if(!error){
    //         // file uploaded
    //             res.send({"resp":response});
    //         }
    //     });
    // });
  
        
//    },
   uploadImage: function(req, res, next){ 
    image=req.body.image;
    if(image){
        uploaduserimage(function(image){
                
                imageurl='https://wellfasterstore.blob.core.windows.net/images/'+image;
                res.send({code:"200",imageurl:imageurl});
            });
    }else{
        photourfl="";
        res.send({code:"200",data:photourfl});
        }
  
        
   },

   savereview:function(req,res,next){
    let accessToken = req.get('Authorization');
    var post = req.body;        
    if(accessToken) {
        if(accessToken!=='' && post.review) { 
                userModel = new MyAppModel();
                var qd = "SELECT role FROM users  WHERE auth_token='"+accessToken+"'";                            
                userModel.query(qd,function(err, rows) {
                    if(err) {
                        res.send({ code: 100,message: 'User not found'});                            
                    }
                    if (rows.recordset.length<1) {                   
                        res.send({ code: 100,message: 'A valid user is required'});                  
                    } 
                    else 
                    {
                        if(post.reviewid!=""){

                            var values="review='"+addslashes(post.review)+"',rating='"+post.rate+"'";
                            //console.log(values);
                            userModel.query("Update  trainers_reviews set "+values+" where review_id="+post.reviewid, function(err, rows) {
                            if(err) {
                                res.send({ code: 100,message: 'User not found'}); 
                            }else{
                               
                                       
                                        res.send({ code: 200,message: 'Update success'});  
                                
                                
                            }
                        })

                        }else{
                        var mysqlTimestamp =moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
                        
                        var field="trainer_id,user_id,review,rating,status,created_at";
                        var values="'"+post.trainer_id+"','"+post.user_id+"','"+addslashes(post.review)+"','"+post.rate+"','1','"+mysqlTimestamp+"'";
                        //console.log(values);
                        userModel.query("Insert  into trainers_reviews ("+field+")  values("+values+")", function(err, rows) {
                        if(err) {
                            res.send({ code: 100,message: 'User not found'}); 
                        }else{
                           
                                   
                                    res.send({ code: 200,message: 'Insert success'});  
                            
                            
                        }
                    })
                }
                    }
                
                });

            }
         }
   },

   send_mail:function(req,res,next){
    let accessToken = req.get('Authorization');
    var post = req.body;        
    if(accessToken) {
        if(accessToken!=='' && post.review) { 
                userModel = new MyAppModel();
                var qd = "SELECT role,email,name FROM users  WHERE auth_token='"+accessToken+"'";                            
                userModel.query(qd,function(err, rows) {
                    if(err) {
                        res.send({ code: 100,message: 'User not found'});                            
                    }
                    if (rows.recordset.length<1) {                   
                        res.send({ code: 100,message: 'A valid user is required'});                  
                    } 
                    else 
                    {
                        useremail=rows.recordset[0].email;
                        username=rows.recordset[0].name;
                        userModel.query("SELECT role,email,name FROM users  WHERE id='"+post.trainer_id+"'", function(err, trainerrows) {
                        if(err) {
                            res.send({ code: 100,message: 'User not found'}); 
                        }else{
                            traineremail=trainerrows.recordset[0].email;
                            name=trainerrows.recordset[0].name;
                            newUser={};    
                            newUser.name = name;
                            newUser.email = traineremail;
                            newUser.useremail = useremail;
                            newUser.username = username;
                            newUser.subject=post.subject;
                            newUser.message=post.review;
                           
                                emailHelper.sendtrainermessage(newUser, function(err, info){
                                    return  res.send({ code: 200,message: 'webuser'}); 
                                });
                           
                            
                            
                        }
                    })
                }
                    
                
                });
            }
         }
   },

   hire_trainer:function(req,res,next){
    let accessToken = req.get('Authorization');
    var post = req.body;        
    if(accessToken) {
        if(accessToken!=='' && post.trainer_id && post.user_id) { 
                userModel = new MyAppModel();
                var qd = "SELECT u.role,u.id,u.name,u.photo,ud.height  FROM users u left join users_details ud on u.id=ud.user_id  WHERE u.auth_token='"+accessToken+"'";                            
                userModel.query(qd,function(err, rows) {
                    if(err) {
                        res.send({ code: 100,message: 'User not found'});                            
                    }
                    if (rows.recordset.length<1) {                   
                        res.send({ code: 100,message: 'A valid user is required'});                  
                    } 
                    
                    else 
                    {
                         console.log(rows.recordset[0].height);
                        if (rows.recordset[0].height==0) {                   
                            res.send({ code: 200,message: 'account_pending'});                  
                        } else{
                        
                        fromname=rows.recordset[0].name;
                        photo=rows.recordset[0].photo;
                        if (rows.recordset[0].role==2) {                   
                            res.send({ code: 100,message: 'Trainer have no permission to subscribe'});                  
                        }else{
                        var mysqlTimestamp =moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
                        
                        var field="trainer_id,user_id,status,created_at";
                        var values="'"+post.trainer_id+"','"+post.user_id+"','','"+mysqlTimestamp+"'";
                        //console.log(values);
                        userModel.query("Insert  into trainers_hire ("+field+") OUTPUT Inserted.ID  values("+values+")", function(err, rows) {
                        if(err) {
                            res.send({ code: 100,message: 'User not found'}); 
                        }else{
                            hire_id=rows.recordset[0].ID;
                            var qd = "SELECT email,name FROM users  WHERE id='"+post.trainer_id+"'";                            
                            userModel.query(qd,function(err, rows) {
                                if(err) {
                                    res.send({ code: 100,message: 'User not found'});                            
                                }
                                if (rows.recordset.length<1) {                   
                                    res.send({ code: 100,message: 'A valid user is required'});                  
                                } else{
                                    newUser={};
                                    newUser.name = rows.recordset[0].name;
                                    newUser.email = rows.recordset[0].email;
                                    newUser.id= fromname;
                                    newUser.photo= photo;
                                    newUser.hire= hire_id;
                                    emailHelper.sendTrainerhire(newUser, function(err, info  ){
                                       // data={};
                                        //emailHelper.sendadminTrainerhire(data, function(err, info  ){
                                            res.send({ code: 200,message: 'Insert success'});  
                                        //});
                                       
                                    });
                            
                            }
                        })  
                            
                            
                        }
                    })
                }
                
                    }
                }
                });
            

            }
         }

   },

   get_hire_trainer_user:function(req,res,next){
    let accessToken = req.get('Authorization');
        if(accessToken) { 
           
                userModel = new MyAppModel();
                var qd = "SELECT role,id,message_setting FROM users  WHERE auth_token='"+accessToken+"'";                            
                userModel.query(qd,function(err, rows) {
                    if(err) {
                        res.send({ code: 100,message: 'User not found'});                            
                    }
                    if (rows.recordset.length<1) {                   
                        res.send({ code: 200,data:"",message: 'User not found'});                  
                    }
                    else {
                        if (rows.recordset[0].role==1) {                   
                            id="user_id";  
                            idtrainer="trainer_id";              
                        }
                        if (rows.recordset[0].role==2) {                   
                           id="trainer_id";  
                           idtrainer="user_id";                
                        }

                   var  setting=   rows.recordset[0].message_setting;
                   var travelTime = moment().format('YYYY-MM-DD HH:mm:ss');
                   var qd = "update users set updated_at='"+travelTime+"' where id="+rows.recordset[0].id;
                   console.log(qd);
                    userModel.query(qd,function(err, qrows) {
                        if(err) {
                            res.send({ code: 100,message: 'User not found'});                            
                        }
                        else {
                      
                   
                var qd = "SELECT (select count(id) from orders where status is not null and "+id+"="+rows.recordset[0].id+"  and end_date>'"+travelTime+"'  and "+idtrainer+"=t."+idtrainer+") as payment,us.availblity,us.id,us.auth_token as token,us.photo,us.email,us.is_loggedin as isOnline,us.role,us.name,(select count(id) from messages where recipient_id="+rows.recordset[0].id+" and updated_at is null and sender_id=t."+idtrainer+")as counter FROM trainers_hire  t left join users u on t."+id+"=u.id left join users us on t."+idtrainer+"=us.id   where t.status=1 and u.id="+rows.recordset[0].id;                            
               console.log(qd);
                userModel.query(qd,function(err, rows) {
                    if(err) {
                        res.send({ code: 100,message: 'User not found'});                            
                    }
                    else {
                        if (rows.recordset.length<1) {                   
                            res.send({ code: 100,message: 'Trainers not found'});                  
                        }     

                        
                        else {
                            res.send({ code: 200,data:rows.recordset,message_setting:setting,message: 'Trainers List'});    
                              
                        }
                    }
                });
            }
        })
            // }
            // });
            } 
        
        })
        
   
  }  else {
                 res.send({ code: 100,message: 'validation error'});
            }    

   },


   addmessage:function(req,res,next){
    let accessToken = req.get('Authorization');
    var post = req.body;        
    if(accessToken) {
        if(accessToken && post.trainer_id && post.user_id && post.message) { 
                userModel = new MyAppModel();
                var qd = "SELECT role,id,name,photo FROM users  WHERE auth_token='"+accessToken+"'";                            
                userModel.query(qd,function(err, userrows) {
                    if(err) {
                        res.send({ code: 100,message: 'User not found'});                            
                    }
                    if (userrows.recordset.length<1) {                   
                        res.send({ code: 100,message: 'A valid user is required'});                  
                    } 
                    
                    else 
                    {
                      
                        userId=userrows.recordset[0].id;
                       // fromname=userrows.recordset[0].name;
                        photo=userrows.recordset[0].photo;
                        var mysqlTimestamp =moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
                        var qd = "update users set updated_at='"+mysqlTimestamp+"' where id="+userrows.recordset[0].id;
                        console.log(qd);
                         userModel.query(qd,function(err, qrows) {
                             if(err) {
                                 res.send({ code: 100,message: 'User not found'});                            
                             }
                             else {   
                        var field="recipient_id,sender_id,message,status,created_at";
                        var values="'"+post.trainer_id+"','"+post.user_id+"','"+post.message+"','1','"+mysqlTimestamp+"'";
                        //console.log(values);
                        userModel.query("Insert  into messages ("+field+")  values("+values+")", function(err, rows) {
                        if(err) {
                            res.send({ code: 100,message: 'User not found'}); 
                        }else{

                            fromname=userrows.recordset[0].name;
                           // //console.log(fromname);
                            var qd = "SELECT email,name FROM users  WHERE id='"+post.trainer_id+"'";                            
                            userModel.query(qd,function(err, rows) {
                                if(err) {
                                    res.send({ code: 100,message: 'User not found'});                            
                                }
                                if (rows.recordset.length<1) {                   
                                    res.send({ code: 100,message: 'A valid user is required'});                  
                                } else{
                                    newUser={};
                                    newUser.name = rows.recordset[0].name;
                                    newUser.email = rows.recordset[0].email;
                                    newUser.message=post.message;
                                    ////console.log(fromname);
                                    newUser.sender= fromname;
                                    newUser.photo= photo;
                                   // emailHelper.sendMessage(newUser, function(err, info  ){
                                        res.send({ code: 200,message: 'Insert success'});  
                                   // });
                            
                            }
                        })
                            
                        }
                    })
                }
            })
                
                    }
                
                });

            }
         }
   },

   get_message_trainer_user:function(req,res,next){
    let accessToken = req.get('Authorization');
    post=req.body;
        if(accessToken && post.trainer_id && post.user_id) { 
           
                userModel = new MyAppModel();
                var qd = "SELECT role,id FROM users  WHERE auth_token='"+accessToken+"'";                            
                userModel.query(qd,function(err, rows) {
                    if(err) {
                        res.send({ code: 100,message: 'User not found'});                            
                    }
                    if (rows.recordset.length<1) {                   
                        res.send({ code: 200,data:"",message: 'User not found'});                  
                    }
                    else {
                       
                        var mysqlTimestamp =moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
                        var qd = "update users set updated_at='"+mysqlTimestamp+"' where id="+rows.recordset[0].id;
                        console.log(qd);
                         userModel.query(qd,function(err, qrows) {
                             if(err) {
                                 res.send({ code: 100,message: 'User not found'});                            
                             }
                             else {   
var qd = "Select m.message,m.recipient_id,m.sender_id,m.id,m.created_at,u.name as messageto,u.photo as phototo,us.photo as photofrom,us.name as messagefrom from messages m left join users u on u.id=m.recipient_id left join users us on us.id=m.sender_id  where (recipient_id="+post.trainer_id+" and sender_id="+post.user_id+") or (recipient_id="+post.user_id+" and sender_id="+post.trainer_id+") order by m.id";
                userModel.query(qd,function(err, rows) {
                    if(err) {
                        res.send({ code: 100,message: 'User not found'});                            
                    }
                    else {
                        var mysqlTimestamp =moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
                        q="update messages set updated_at='"+mysqlTimestamp+"' where sender_id="+post.trainer_id+" and recipient_id="+post.user_id+" and updated_at is null";
                        userModel.query(q,function(err, wrows) {
                            if(err) {
                                res.send({ code: 100,message: 'User not found'});                            
                            }
                            else {
                                   
           
                                      
                              
                            } 
                        })    
 
                    }
                    res.send({ code: 200,data:rows.recordset,message: 'Trainers List'});       
                })  
                       
                              
                      
                    }
                });
            // }
            // });
            } 
        
        })
        
   
  }  else {
                 res.send({ code: 100,message: 'validation error'});
            }    

   },


   gettrainername:function(req,res,next){
    req.params.search=( req.params.search=="all")?"": req.params.search;
    if(req.params.search){
        userModel = new MyAppModel();
        if(req.params.search!="" && req.params.search){
            term=req.params.search;
            wildcard="'%"+term+"%'";
            q="name like  "+wildcard;
         }
      qr="SELECT * from users where  "+q+" and  confirmed_at!='' and role='2' and approve='accept'";
      userModel.query(qr,function(err,result){ //foe view the data
        if(err) {
            res.send({ code: 100,message: 'User not found'});                            
        }else{
            res.send({ code: 200,data:result.recordset,message: 'Trainers List'}); 
        }
          
      });
    }else{
      res.json([]);
    }
   },

   paymentsucessplan:function(req,res,next){
    
   var post = req.body;        
  
          let accessToken = req.get('Authorization');      
          if(accessToken) {
            userId=post.id;
            trainerId=post.trainerid;
                      userModel = new MyAppModel();
                      var qd = "SELECT * FROM users  WHERE auth_token='"+accessToken+"'";  
                      console.log(qd);                          
                      userModel.query(qd,function(err, userrows) {
                          if(err) {
                              res.send({ code: 100,message: 'User not found'});                            
                          }
                          if (userrows.recordset.length<1) {                   
                              res.send({ code: 100,message: 'A valid user is required'});                  
                          } 
                          
                          else    
                          {
                              var qd="select u.id,u.name,u.email,u.photo,us.email as fromemail,us.name as fromname from trainers_hire th left join users u  on th.user_id=u.id left join users us on th.trainer_id=us.id where    th.user_id="+userId+" and th.trainer_id="+trainerId;
                              console.log(qd);
                        userModel.query("select u.id,u.name,u.email,us.email as fromemail,u.photo,us.name as fromname,ts.zip as zip,ts.city as city,ts.street as street,ts.cvr_vat as cvr_vat from trainers_hire th left join users u  on th.user_id=u.id left join users us on th.trainer_id=us.id left join trainers_details ts on ts.trainer_id=us.id  where    th.user_id="+userId+" and th.trainer_id="+trainerId, function(err, rows) {
                            if (rows.recordset.length<1) {                   
                                res.send({ code: 100,message: 'A valid user is required'});                  
                            }
                            else { 
                          
                              
                                    userModel.query("select o.order_id,o.subscription_plan,o.userplan,o.amount,o.start_date,us.zip,us.street,us.city from orders o left join users_details us on us.user_id=o.user_id  where   o.user_id="+rows.recordset[0].id+" and o.trainer_id="+trainerId+" and o.status='active'", function(err, orderrows) {
                                        if (rows.recordset.length<1) {                   
                                            res.send({ code: 100,message: 'A valid user is required'});                  
                                        }
                                        else { 
                                            newUser={};
                                            newUser.id = rows.recordset[0].id;
                                            newUser.name = rows.recordset[0].name;
                                            newUser.email = rows.recordset[0].fromemail;
                                            newUser.bytrainer= rows.recordset[0].fromname;
                                            var cvrvat= rows.recordset[0].cvr_vat;
                                            if(orderrows.recordset[0].userplan=="entry"){
                                                newUser.planstate="Downgraded";
                                                newUser.plan="Basic plan";
                                            }else if(orderrows.recordset[0].userplan=="premium"){
                                                newUser.planstate="Upgraded";
                                                newUser.plan="Premium Plan";
                                            } 
                                     
                                            if(orderrows.recordset[0].userplan=="entry"){
                                               // emailHelper.send_payment(newUser, function(err, info  ){
                                                    newUser22={};
                                                    newUser22.orderid = orderrows.recordset[0].order_id;
                                                    newUser22.city= orderrows.recordset[0].city;
                                                    orderrows.recordset[0].subscription_plan=Number(orderrows.recordset[0].subscription_plan);
                                                    subscription_plan=number_format(orderrows.recordset[0].subscription_plan,2);
                                                    amountplan=Number(orderrows.recordset[0].amount)-Number(orderrows.recordset[0].subscription_plan);
                                                    newUser22.subscription_plan= number_format(orderrows.recordset[0].subscription_plan,2);
                                                    newUser22.name = rows.recordset[0].name;
                                                    newUser22.email = rows.recordset[0].email;
                                                    newUser22.zip= orderrows.recordset[0].zip;
                                                    newUser22.street= orderrows.recordset[0].street;
                                                    newUser22.trainercity= rows.recordset[0].city;
                                                    newUser22.trainerzip= rows.recordset[0].zip;
                                                   // newUser22.traineremail = rows.recordset[0].fromemail;
                                                    newUser22.start_date=   new Date( orderrows.recordset[0].start_date).toLocaleString("en", { day: "numeric" })+ ' ' +
                                                    new Date( orderrows.recordset[0].start_date).toLocaleString("en", { month: "long"  }) + ' ' +
                                                    new Date( orderrows.recordset[0].start_date).toLocaleString("en", { year: "numeric"});
                                                    newUser22.trainerstreet= rows.recordset[0].street;
                                                    amount= number_format(Number(orderrows.recordset[0].amount),2);
                                                     //console.log(1212);
                                                    if(orderrows.recordset[0].userplan=="entry"){
                                                        newUser22.plan="Entry plan subscription";
                                                    }else if(orderrows.recordset[0].userplan=="premium"){
                                                        newUser22.plan="Premium plan subscription";
                                                    }
                                                    var plan=orderrows.recordset[0].userplan;
                                                    newUser22.traineremail = rows.recordset[0].fromemail;
                                                    newUser22.cvrvat="34455058";
                                                    // newUser22.start_date=   new Date( orderrows.recordset[0].start_date).toLocaleString("en", { day: "numeric" })+ ' ' +
                                                    // new Date( orderrows.recordset[0].start_date).toLocaleString("en", { month: "long"  }) + ' ' +
                                                    // new Date( orderrows.recordset[0].start_date).toLocaleString("en", { year: "numeric"});
                                                    //newUser.start_date= orderrows.recordset[0].start_date;
                                                    newUser22.trainername= rows.recordset[0].fromname;
                                                    // newUser22.cvrvat="34455058";
                                                   
                                                    // if(cvrvat!=""){
                                                        console.log(1212);
                                                           //  newUser22.cvrvat=cvrvat;
                                                             vatamount=((Number(amount) * 20) / 100).toFixed(2);
                                                             totalamount= Number(amount);
                                                             amountplan=Number(amountplan);
                                                             newUser22.vatamount=number_format(Number(vatamount),2);
                                                             console.log(22);
                                                             amount=Number(number_format(Number(amount),2));
                                                             console.log(33);
                                                             newUser22.amountplan=number_format(amountplan,2);
                                                             console.log(44);
                                                             newUser22.subscription_plan=number_format(Number(subscription_plan),2);
                                                             console.log(55);
                                                             newUser22.totalamount=number_format(totalamount,2);
                                                             console.log(66);
                                                             newUser22.amount=number_format(amount,2);
                                                             console.log(77);
                                                              emailHelper.sendInvoicewithvatplan(newUser22, function(err, info  ){
                                                                  res.send({ code: 200,status: 'accepted'}); 
                                                              
                                                              })
                                                        
                                                    //  }
                                                    //  else if(cvrvat=="" ){
                                                    //      amountplan=Number(amountplan);
                                                    //      newUser22.amountplan=number_format(amountplan,2);
                                                    //      amount=Number(amountplan)+Number(subscription_plan);
                                                    //      newUser22.subscription_plan=number_format(Number(subscription_plan),2);
                                                    //    //  var amount=Number(amount);
                                                    //      newUser22.amount=number_format(amount,2);
                                                    //      emailHelper.sendInvoicetrainerplan(newUser22, function(err, info  ){
                                                    //          res.send({ code: 200,status: 'accepted'}); 
                                                         
                                                    //      })
                                                        
                                                    //  }
                                                     
                                                 //   }) 
                                            }
                                            if(orderrows.recordset[0].userplan=="premium"){
                                                emailHelper.send_payment(newUser, function(err, info  ){
                                                    newUser22={};
                                                    newUser22.orderid = orderrows.recordset[0].order_id;
                                                    newUser22.city= orderrows.recordset[0].city;
                                                    orderrows.recordset[0].subscription_plan=Number(orderrows.recordset[0].subscription_plan);
                                                    subscription_plan=number_format(orderrows.recordset[0].subscription_plan,2);
                                                    amountplan=Number(orderrows.recordset[0].amount)-Number(orderrows.recordset[0].subscription_plan);
                                                    newUser22.subscription_plan= number_format(orderrows.recordset[0].subscription_plan,2);
                                                    newUser22.name = rows.recordset[0].name;
                                                    newUser22.email = rows.recordset[0].email;
                                                    newUser22.zip= orderrows.recordset[0].zip;
                                                    newUser22.street= orderrows.recordset[0].street;
                                                    newUser22.trainercity= rows.recordset[0].city;
                                                    newUser22.trainerzip= rows.recordset[0].zip;
                                                    newUser22.trainerstreet= rows.recordset[0].street;
                                                    amount= number_format(Number(orderrows.recordset[0].amount),2);
                                                     //console.log(1212);
                                                    if(orderrows.recordset[0].userplan=="entry"){
                                                        newUser22.plan="Entry plan subscription";
                                                    }else if(orderrows.recordset[0].userplan=="premium"){
                                                        newUser22.plan="Premium plan subscription";
                                                    }
                                                    var plan=orderrows.recordset[0].userplan;
                                                    newUser22.traineremail = rows.recordset[0].fromemail;
                                                    newUser22.start_date=   new Date( orderrows.recordset[0].start_date).toLocaleString("en", { day: "numeric" })+ ' ' +
                                                    new Date( orderrows.recordset[0].start_date).toLocaleString("en", { month: "long"  }) + ' ' +
                                                    new Date( orderrows.recordset[0].start_date).toLocaleString("en", { year: "numeric"});
                                                    // newUser22.start_date=   new Date( orderrows.recordset[0].start_date).toLocaleString("en", { day: "numeric" })+ ' ' +
                                                    // new Date( orderrows.recordset[0].start_date).toLocaleString("en", { month: "long"  }) + ' ' +
                                                    // new Date( orderrows.recordset[0].start_date).toLocaleString("en", { year: "numeric"});
                                                    //newUser.start_date= orderrows.recordset[0].start_date;
                                                    newUser22.trainername= rows.recordset[0].fromname;
                                                    newUser22.cvrvat=cvrvat;
                                                   
                                                    if(cvrvat!=""){
                                                        console.log(1212);
                                                            // newUser22.cvrvat=cvrvat;
                                                             vatamount=((Number(amount) * 20) / 100).toFixed(2);
                                                             totalamount= Number(amount);
                                                             amountplan=Number(amountplan);
                                                             newUser22.vatamount=number_format(Number(vatamount),2);
                                                             console.log(22);
                                                             amount=Number(number_format(Number(amount),2));
                                                             console.log(33);
                                                             newUser22.amountplan=number_format(amountplan,2);
                                                             console.log(44);
                                                             newUser22.subscription_plan=number_format(Number(subscription_plan),2);
                                                             console.log(55);
                                                             newUser22.totalamount=number_format(totalamount,2);
                                                             console.log(66);
                                                             newUser22.amount=number_format(amount,2);
                                                             console.log(77);
                                                              emailHelper.sendInvoicewithvatplantrainer(newUser22, function(err, info  ){
                                                                  res.send({ code: 200,status: 'accepted'}); 
                                                              
                                                              })
                                                        
                                                     }else if(cvrvat=="" ){
                                                         amountplan=Number(amountplan);
                                                         newUser22.amountplan=number_format(amountplan,2);
                                                         amount=Number(amountplan)+Number(subscription_plan);
                                                         newUser22.subscription_plan=number_format(Number(subscription_plan),2);
                                                       //  var amount=Number(amount);
                                                         newUser22.amount=number_format(amount,2);
                                                         emailHelper.sendInvoicetrainerplantrainer(newUser22, function(err, info  ){
                                                             res.send({ code: 200,status: 'accepted'}); 
                                                         
                                                         })
                                                        
                                                     }
                                                     
                                                    }) 
                                            }
                                          
                                            
                                        }
                                  
                                });
                                 
                      
                   
               }                    
           });
        }
    })
}
   },

   paymentsucess:function(req,res,next){
    
   var post = req.body;        
  
          let accessToken = req.get('Authorization');      
          if(accessToken) {
            userId=post.id;
            trainerId=post.trainerid;
                      userModel = new MyAppModel();
                      var qd = "SELECT * FROM users  WHERE auth_token='"+accessToken+"'";  
                      console.log(qd);                          
                      userModel.query(qd,function(err, userrows) {
                          if(err) {
                              res.send({ code: 100,message: 'User not found'});                            
                          }
                          if (userrows.recordset.length<1) {                   
                              res.send({ code: 100,message: 'A valid user is required'});                  
                          } 
                          
                          else    
                          {
                              var qd="select u.id,u.name,u.email,u.photo,us.email as fromemail,us.name as fromname from trainers_hire th left join users u  on th.user_id=u.id left join users us on th.trainer_id=us.id where    th.user_id="+userId+" and th.trainer_id="+trainerId;
                              console.log(qd);
                        userModel.query("select u.id,u.name,u.email,us.email as fromemail,u.photo,us.name as fromname,ts.zip as zip,ts.city as city,ts.street as street,ts.cvr_vat as cvr_vat from trainers_hire th left join users u  on th.user_id=u.id left join users us on th.trainer_id=us.id left join trainers_details ts on ts.trainer_id=us.id  where    th.user_id="+userId+" and th.trainer_id="+trainerId, function(err, rows) {
                            if (rows.recordset.length<1) {                   
                                res.send({ code: 100,message: 'A valid user is required'});                  
                            }
                            else { 
                          
                                newUser={};
                                newUser.id = rows.recordset[0].id;
                                newUser.name = rows.recordset[0].name;
                                newUser.email = rows.recordset[0].fromemail;
                                newUser.bytrainer= rows.recordset[0].fromname;
                                cvrvat= rows.recordset[0].cvr_vat;
                                emailHelper.sendpayment(newUser, function(err, info  ){
                                    userModel.query("select o.order_id,o.subscription_plan,o.userplan,o.amount,o.start_date,us.zip,us.street,us.city from orders o left join users_details us on us.user_id=o.user_id  where   o.user_id="+rows.recordset[0].id+" and o.trainer_id="+trainerId+" and o.status='active'", function(err, orderrows) {
                                        if (rows.recordset.length<1) {                   
                                            res.send({ code: 100,message: 'A valid user is required'});                  
                                        }
                                        else { 
                                            newUser22={};
                                            newUser22.orderid = orderrows.recordset[0].order_id;
                                            newUser22.city= orderrows.recordset[0].city;
                                            orderrows.recordset[0].subscription_plan=Number(orderrows.recordset[0].subscription_plan);
                                            subscription_plan=number_format(orderrows.recordset[0].subscription_plan,2);
                                            amountplan=Number(orderrows.recordset[0].amount)-Number(orderrows.recordset[0].subscription_plan);
                                            newUser22.subscription_plan= number_format(orderrows.recordset[0].subscription_plan,2);
                                            newUser22.name = rows.recordset[0].name;
                                            newUser22.email = rows.recordset[0].email;
                                            newUser22.zip= orderrows.recordset[0].zip;
                                            newUser22.street= orderrows.recordset[0].street;
                                            newUser22.trainercity= rows.recordset[0].city;
                                            newUser22.trainerzip= rows.recordset[0].zip;
                                            newUser22.trainerstreet= rows.recordset[0].street;
                                            amount= number_format(Number(orderrows.recordset[0].amount),2);
                                            if(orderrows.recordset[0].userplan=="entry"){
                                                newUser22.plan="Entry plan subscription";
                                            }else if(orderrows.recordset[0].userplan=="premium"){
                                                newUser22.plan="Premium plan subscription";
                                            }
                                            var plan=orderrows.recordset[0].userplan;
                                            newUser22.traineremail = rows.recordset[0].fromemail;
                                            newUser22.start_date=   new Date( orderrows.recordset[0].start_date).toLocaleString("en", { day: "numeric" })+ ' ' +
                                            new Date( orderrows.recordset[0].start_date).toLocaleString("en", { month: "long"  }) + ' ' +
                                            new Date( orderrows.recordset[0].start_date).toLocaleString("en", { year: "numeric"});
                                            //newUser.start_date= orderrows.recordset[0].start_date;
                                            newUser22.trainername= rows.recordset[0].fromname;
                                            newUser22.cvrvat="34455058";
                                           
                                            if(cvrvat!="" && plan=="premium"){
                                                
                                                     newUser22.cvrvat=cvrvat;
                                                     vatamount=((Number(amount) * 20) / 100).toFixed(2);
                                                     totalamount= Number(amount);
                                                     amountplan=Number(amountplan);
                                                     newUser22.vatamount=number_format(Number(vatamount),2);
                                                     amount=Number(number_format(Number(amount),2));
                                                     newUser22.amountplan=number_format(amountplan,2);
                                                     newUser22.subscription_plan=number_format(Number(subscription_plan),2);
                                                     newUser22.totalamount=number_format(totalamount,2);
                                                     newUser22.amount=number_format(amount,2);
                                                      emailHelper.sendInvoicetrainertvat(newUser22, function(err, info  ){
                                                          res.send({ code: 200,status: 'accepted'}); 
                                                      
                                                      })
                                                
                                             }else if(cvrvat=="" && plan=="premium"){
                                                 amountplan=Number(amountplan);
                                                 newUser22.amountplan=number_format(amountplan,2);
                                                 amount=Number(amountplan)+Number(subscription_plan);
                                                 newUser22.subscription_plan=number_format(Number(subscription_plan),2);
                                               //  var amount=Number(amount);
                                                 newUser22.amount=number_format(amount,2);
                                                 emailHelper.sendInvoicetrainer(newUser22, function(err, info  ){
                                                     res.send({ code: 200,status: 'accepted'}); 
                                                 
                                                 })
                                                
                                             }else if(cvrvat!="" && plan=="entry"){
                                                newUser22.amountplan=number_format(Number(amountplan),2);
                                                vatamount=((Number(orderrows.recordset[0].subscription_plan) * 20) / 100).toFixed(2);
                                                totalamount=Number(orderrows.recordset[0].subscription_plan);
                                                newUser22.vatamount=number_format(Number(vatamount),2);
                                                newUser22.totalamount=number_format(Number(totalamount),2);
                                                newUser22.amount=number_format(Number(subscription_plan),2);
                                                emailHelper.sendInvoicewithvat(newUser22, function(err, info  ){
                                                     newUser22.cvrvat=cvrvat;
                                                     vatamount=((Number(amountplan) * 20) / 100).toFixed(2);
                                                     totalamount= Number(amountplan);
                                                     newUser22.amountplan=number_format(Number(totalamount),2);
                                                     newUser22.vatamount=number_format(Number(vatamount),2);
                                                     newUser22.amount=number_format(Number(amountplan),2);
                                                     newUser22.totalamount=number_format(Number(totalamount),2);
                                                      emailHelper.sendInvoicetrainertvat22(newUser22, function(err, info  )
                                                      {
                                                          res.send({ code: 200,status: 'accepted'}); 
                                                      
                                                      })
                                                   })
                                             }else if(cvrvat=="" && plan=="entry"){
                                                newUser22.amountplan=number_format(amountplan,2);
                                                vatamount=((Number(orderrows.recordset[0].subscription_plan) * 20) / 100).toFixed(2);
                                                totalamount=Number(orderrows.recordset[0].subscription_plan)
                                                newUser22.vatamount=number_format(vatamount,2);
                                                // newUser22.subscription_plan22= totalamount;  
                                                newUser22.totalamount=number_format(totalamount,2);
                                                newUser22.amount=number_format(subscription_plan,2);
                                                emailHelper.sendInvoicewithvat(newUser22, function(err, info  ){
                                                     newUser22.amountplan=number_format(amountplan,2);
                                                      emailHelper.sendInvoice(newUser22, function(err, info  ){
                                                          res.send({ code: 200,status: 'accepted'}); 
                                                      
                                                      })
                                                   })
                                             }
                                             

                                            
                                        }
                                    }) 
                                });
                                 
                      
                   
               }                    
           });
        }
    })
}
   },


   accept_trainer:function(req,res,next){
    
   var post = req.body;        
   if(post) {   
       if( post.id!=='') {
          var userId=post.id;
           userModel = new MyAppModel();
           if(post.action=="1"){
           userModel.query("select u.id,u.name,u.email,u.photo,us.name as fromname from trainers_hire th left join users u  on th.user_id=u.id left join users us on th.trainer_id=us.id where    th.id="+userId  , function(err, rows) {
            if (rows.recordset.length<1) {                   
                 res.send({ code: 100,message: 'A valid user is required'});                  
               }
               else { 
                           var q = "UPDATE trainers_hire SET status = '1' WHERE id='" +userId+"'";   
                               userModel.query(q,function(err, result) {
                               if(err) {
                                   //console.log(err);
                                  res.send({ code: 100,message: 'Internal server error. Please try again'});
                               }
                               else {
                                newUser={};
                                newUser.id = rows.recordset[0].id;
                                newUser.name = rows.recordset[0].name;
                                newUser.email = rows.recordset[0].email;
                                newUser.message="Your request has been approved by "+rows.recordset[0].fromname;
                                newUser.bytrainer= rows.recordset[0].fromname;
                                newUser.photo= rows.recordset[0].photo;
                                emailHelper.sendAccept(newUser, function(err, info  ){
                                    console.log(newUser);
                                    console.log(21212122);
                                    res.send({ code: 200,status: 'accepted',name:newUser.name,id:newUser.id});  
                                });
                                 //  res.send({ code: 200,message: 'Success'});                                        
                               }
                           });    
                      
                   
               }                    
           });
        }else{

            userModel.query("select u.id,u.name,u.email,u.photo,us.name as fromname from trainers_hire th left join users u  on th.user_id=u.id left join users us on th.trainer_id=us.id where    th.id="+userId  , function(err, rows) {
                if (rows.recordset.length<1) {                   
                     res.send({ code: 100,message: 'A valid user is required'});                  
                   }
                   else { 
                               var q = "delete from  trainers_hire  WHERE id='" +userId+"'";   
                                   userModel.query(q,function(err, result) {
                                   if(err) {
                                       //console.log(err);
                                      res.send({ code: 100,message: 'Internal server error. Please try again'});
                                   }
                                   else {
                                    newUser={};
                                    newUser.name = rows.recordset[0].name;
                                    newUser.email = rows.recordset[0].email;
                                    newUser.message="Your request has been rejected by "+rows.recordset[0].fromname;
                                    newUser.bytrainer= rows.recordset[0].fromname;
                                    newUser.photo= rows.recordset[0].photo;
                                    emailHelper.sendReject(newUser, function(err, info  ){
                                        res.send({ code: 200,status: 'rejected'});  
                                    });
                                      // res.send({ code: 200,message: 'Success'});                                        
                                   }
                               });    
                          
                       
                   }                    
               });


        }
       }
   }
   else {
       res.send({ code: 100,message: 'A valid username is required'});   
   }
},


create_subscription:function(req,res,next){
    let accessToken = req.get('Authorization');      
    if(accessToken) {
                userModel = new MyAppModel();
                var qd = "SELECT * FROM users  WHERE auth_token='"+accessToken+"'";                            
                userModel.query(qd,function(err, userrows) {
                    if(err) {
                        res.send({ code: 100,message: 'User not found'});                            
                    }
                    if (userrows.recordset.length<1) {                   
                        res.send({ code: 100,message: 'A valid user is required'});                  
                    } 
                    
                    else    
                    {
                        var post=req.body;
                        trid=post.id;
                        var onetime=post.amount;
                        amount=Number(post.amount) + Number(post.subscriptionplan);
                        var qd = "SELECT * FROM orders  WHERE trainer_id='"+trid+"' and user_id='"+post.user_id+"' and status='active'";                            
                        userModel.query(qd,function(err, userrows) {
                            if(err) {
                                res.send({ code: 100,message: 'User not found'});                            
                            }
                            if (userrows.recordset.length>0) {                   
                                res.send({ code: 100,message: 'A valid user is required'});                  
                            } 
                            
                            else    
                            {
                     
                        randonnumber=fn.getRandNum(6);
                        userModel = new MyAppModel();
                        var headers= config.headers;
                        var options = { method: 'POST',
                        url: config.payment.link+'subscriptions/',
                        qs: { currency: 'dkk', order_id:randonnumber , description: 'paye' },
                        headers: headers
                        };
                        
                        request(options, function (error, response, body) {
                        if (error) throw new Error(error);
                       var body=JSON.parse(body);
                       var enddate=moment(body.created_at).add(1, 'months').format('YYYY-MM-DD');
                        var field="user_id,trainer_id,subscription_id,userplan,amount,subscription_plan,accepted,order_id,currency,created_at,updated_at,start_date,end_date,onetime_payment";
                        var values="'"+post.user_id+"','"+trid+"','"+body.id+"','"+post.plan+"','"+amount+"','"+post.subscriptionplan+"','"+body.accepted+"','"+body.order_id+"','"+body.currency+"','"+body.created_at+"',"+
                        "'"+body.updated_at+"','"+body.created_at+"','"+enddate+"','"+onetime+"'";
                       var we= "Insert  into orders ("+field+") OUTPUT Inserted.ID values("+values+")";
                       console.log(we);
                        userModel.query("Insert  into orders ("+field+") OUTPUT Inserted.ID values("+values+")", function(err, rows) {
                            if(err) {
                                res.send({ status: 'error',logs: {},message: 'Internal server error. Please try again'});
                            }else{ 
                        
                            _update_subscription(body.id,trid)
                           }
                        })
                        
                        });
                        _update_subscription=function(id,trid){
                            var options = { method: 'PUT',
                            url: config.payment.link+'subscriptions/'+id+'/link',
                            qs: { amount:amount,continue_url: 'http://52.169.249.146:3001/payment_status/'+trid+'/'+id},
                             headers: config.headers };
                        
                        request(options, function (error, response, body) {

                            if (error) throw new Error(error);
                            validdata=JSON.parse(response.body);
                            
                            res.send({ code: 200,url: validdata.url});
                        });
                        }
                        
                        }
                    })
                    }
                    })
        }else{
            res.send({ code: 100,message: 'User not found'}); 
        }
     
},

checkpayment:function(req,res,next){
    var post=req.body;
    var request = require("request");
    if(post){
            userModel = new MyAppModel();
            var token=post.token;
            var User_Id=post.user_id;
            var qd = "SELECT * FROM orders  WHERE subscription_id='"+post.token+"'";                            
            userModel.query(qd,function(err, userrows) {
                if(err) {
                    res.send({ code: 100,message: 'User not found'});                            
                }
                if (userrows.recordset[0].accepted=='true') {                   
                    res.send({ code: 100,message: 'A valid user is required'});                  
                } 
                
                else 
                {

                    console.log(userrows);
           var headers= config.headers;
           var newrandonnumber=fn.getRandNum(6);
           var userId=userrows.recordset[0].user_id;
           var trainerId=userrows.recordset[0].trainer_id;
           var amount=userrows.recordset[0].subscription_plan;
           var onetime_payment=userrows.recordset[0].onetime_payment;
           var amount22=userrows.recordset[0].amount;
           var userPlan=userrows.recordset[0].userplan;
           var currency=userrows.recordset[0].currency;
           var orderid=userrows.recordset[0].order_id;
                    var options = { method: 'POST',
                    url: config.payment.link+'subscriptions/'+token+'/recurring',
                    qs: { amount:amount,auto_capture:true,order_id:newrandonnumber},
                    headers: headers };
                request(options, function (error, response, body) {
                    // console.log(body);
                    // console.log(response);
                    if (error) throw new Error(error);
                });
            var options = { method: 'GET',
            url: config.payment.link+'subscriptions/'+token,
            headers:headers
        };
            
            request(options, function (error, response, body) {
            if (error) throw new Error(error);
            body=JSON.parse(body);
            if(body.state=='active'){
                var mysqlTimestamp =moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
                var field="user_id,trainer_id,subscription_id,amount,accepted,order_id,currency,created_at,userplan,subscription_plan,onetime_payment";
                var values="'"+userId+"','"+trainerId+"','"+token+"','"+amount22+"','"+body.accepted+"','"+orderid+"','"+currency+"','"+body.created_at+"','"+userPlan+"','"+amount+"','"+onetime_payment+"'";
               var we= "Insert  into order_history ("+field+") OUTPUT Inserted.ID values("+values+")";
               //console.log(we);
                userModel.query("Insert  into order_history ("+field+") OUTPUT Inserted.ID values("+values+")", function(err, rows) {
                    if(err) {
                        res.send({ code: 100,message: 'User not found'}); 
                    }else{

                  
              
                userModel = new MyAppModel();
                var qd = "SELECT u.role,u.id,u.name,u.photo,ud.height  FROM users u left join users_details ud on u.id=ud.user_id  WHERE u.id='"+User_Id+"'";                            
                userModel.query(qd,function(err, rows) {
                    if(err) {
                        res.send({ code: 100,message: 'User not found'});                            
                    }
                    if (rows.recordset.length<1) {                   
                        res.send({ code: 100,message: 'A valid user is required'});                  
                    } 
                    
                    else 
                    {
                        console.log(rows.recordset[0].height);
                        if (rows.recordset[0].height==0) {                   
                            res.send({ code: 200,message: 'account_pending'});                  
                        } else{
                        
                       var fromname=rows.recordset[0].name;
                       var photo=rows.recordset[0].photo;
                var id=body.id;
                var values="accepted='"+body.accepted+"',status='active'";

                //console.log(values);
                userModel.query("Update  orders set "+values+" where subscription_id="+id, function(err, rows) {
                if(err) {
                    res.send({ code: 100,message: 'User not found'}); 
                }else{
                    var mysqlTimestamp =moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
                    res.send({code:200,response:body});  
                                      
                   }
                })
             }
            }
        })
    }
})
                }else{
                    res.send({code:100,message:"Payment Error"});  
                }
        });
        }
            })
        }else{
            res.send({code:100,message:"Payment Error"});  
        }
},

changestatus:function(req,res,next){
      
    let accessToken = req.get('Authorization');
    post=req.body;      
    if(accessToken) {
        if(accessToken!=='') { 
                userModel = new MyAppModel();
                var qd = "SELECT id FROM users  WHERE auth_token='"+accessToken+"'";  
                                        
                userModel.query(qd,function(err, rows) {
                   // console.log(rows); 
                    if(err) {
                        res.send({ code: 100,message: 'User not found'});                            
                    }
                    if (rows.recordset.length<1) {                   
                        res.send({ code: 100,message: 'A valid user is required'});                  
                    } 
                    else 
                    {
                            id=rows.recordset[0].id;
                            var values="availblity='"+post.status+"'";

                            //console.log(values);
                            userModel.query("Update  users set "+values+" where id="+id, function(err, rows) {
                            if(err) {
                                res.send({ code: 100,message: 'User not found'}); 
                            }else{
                               
                                       
                                        res.send({ code: 200,message: 'Update success'});  
                                
                                
                            }
                        })
               
                }
            })
        }else{
            res.send({ code: 100,message: 'User not found'}); 
        }
    }else{
        res.send({ code: 100,message: 'User not found'}); 
    }


},

getsubscription:function(req,res,next){

    let accessToken = req.get('Authorization');  
    console.log(accessToken);  
    console.log(2434343); 
    if(accessToken) {
        if(accessToken!=='') { 
                userModel = new MyAppModel();
                var qd = "SELECT role,id FROM users  WHERE auth_token='"+accessToken+"'";                            
                userModel.query(qd,function(err, rows) {
                    if(err) {
                        res.send({ code: 100,message: 'User not found'});                            
                    }
                    if (rows.recordset.length<1) {                   
                        res.send({ code: 100,message: 'A valid user is required'});                  
                    } 
                    else 
                    {
                        id=rows.recordset[0].id;
                        orderrows22=[];
                        userModel.query("select ts.pricesubscription_week,us.name,us.photo,us.email,u.id as id,trainers_hire.trainer_id as trainerId  from trainers_hire  left join users u on u.id=trainers_hire.user_id left join trainers_details ts on ts.trainer_id=trainers_hire.trainer_id left join users us on us.id=trainers_hire.trainer_id  where trainers_hire.status=1 and trainers_hire.user_id="+id, function(err, orderrows) {

                            if(err) {
                                res.send({ code: 100,message: 'User not found'}); 
                            }else{
                                let promiseArr = [];
                                if(orderrows.recordset && orderrows.recordset.length > 0){
                                    orderrows.recordset.forEach(rec => {
                                        let promise = new Promise((resolve, reject) => {
                                            userModel.query("select orders.*  from orders where orders.user_id="+id+" and orders.trainer_id="+rec.trainerId+" order by orders.id desc OFFSET 0 ROWS FETCH NEXT 1  ROWS ONLY", function(err, statusrows) {
                                                    if(err) return reject(err);
                                                    else return  resolve(statusrows);
                                            })
                                        });
                                        promiseArr.push(promise);
                                    })
                                }

                                Promise.all(promiseArr).then(resp => {
                                    if(orderrows.recordset && orderrows.recordset.length >0){
                                        orderrows.recordset.forEach((order,index) => {
                                            var _orderSubs = resp[index].recordset[0];
                                            for(let key in _orderSubs)
                                                order[key] = _orderSubs[key];
                                        });
                                    }
                                    console.log(orderrows);
                                    res.send({ code: 200,orders:orderrows.recordset,message: 'Update success'})
                                });
                                
                                

                              
                               
                                  
                            }
                        })
               
                }
            })
        }else{
            res.send({ code: 100,message: 'User not found'}); 
        }
    }else{
        res.send({ code: 100,message: 'User not found'}); 
    }


},


pendingrequset:function(req,res,next){
    
        let accessToken = req.get('Authorization');  
        console.log(accessToken);  
        console.log(2434343); 
        if(accessToken) {
            if(accessToken!=='') { 
                    userModel = new MyAppModel();
                    var qd = "SELECT role,id FROM users  WHERE auth_token='"+accessToken+"'";                            
                    userModel.query(qd,function(err, rows) {
                        if(err) {
                            res.send({ code: 100,message: 'User not found'});                            
                        }
                        if (rows && rows.recordset.length<1) {                   
                            res.send({ code: 100,message: 'A valid user is required'});                  
                        } 
                        else 
                        {
                                id=rows.recordset[0].id;
                                userModel.query("SELECT h.id,u.email,u.id as userId,u.name,us.height,us.weight,us.city,us.street,h.status FROM trainers_hire h left join users u on u.id=h.user_id  left join users_details us on us.user_id=h.user_id where h.status=0 and h.trainer_id="+id, function(err, orderrows) {
                                if(err) {
                                    res.send({ code: 100,message: 'User not found'}); 
                                }else{
                                    // userModel.query("select status from orders   where user_id="+id, function(err, statusrows) {
                                    //     if(err) {
                                    //         res.send({ code: 100,message: 'User not found'}); 
                                    //     }else{
                                            res.send({ code: 200,orders:orderrows.recordset,message: 'Update success'});  
                                    //       }
                                    // })
                                      
                                }
                            })
                   
                    }
                })
            }else{
                res.send({ code: 100,message: 'User not found'}); 
            }
        }else{
            res.send({ code: 100,message: 'User not found'}); 
        }
    
    
    },

    getacceptedrequests:function(req,res,next){
        
            let accessToken = req.get('Authorization');  
            console.log(accessToken);  
            console.log(2434343); 
            if(accessToken) {
                if(accessToken!=='') { 
                        userModel = new MyAppModel();
                        var qd = "SELECT role,id FROM users  WHERE auth_token='"+accessToken+"'";                            
                        userModel.query(qd,function(err, rows) {
                            if(err) {
                                res.send({ code: 100,message: 'User not found'});                            
                            }
                            if (rows.recordset.length<1) {                   
                                res.send({ code: 100,message: 'A valid user is required'});                  
                            } 
                            else 
                            {
                                    id=rows.recordset[0].id;
                                    userModel.query("SELECT (select start_date from orders where trainer_id="+id+" and user_id=u.id order by id desc OFFSET 0 ROWS FETCH NEXT 1  ROWS ONLY ) as startdate,(select end_date from orders where trainer_id="+id+" and user_id=u.id order by id desc OFFSET 0 ROWS FETCH NEXT 1  ROWS ONLY ) as canceldate,(select status from orders where trainer_id="+id+" and user_id=u.id order by id desc OFFSET 0 ROWS FETCH NEXT 1  ROWS ONLY ) as paymentstatus,h.id,u.email,u.id as userId,u.name,us.height,us.weight,us.city,us.street,h.status FROM trainers_hire h left join users u on u.id=h.user_id left join users_details us on us.user_id=h.user_id where h.status=1 and h.trainer_id="+id, function(err, orderrows) {
                                    if(err) {
                                        res.send({ code: 100,message: 'User not found'}); 
                                    }else{
                                        // userModel.query("select status from orders   where user_id="+id, function(err, statusrows) {
                                        //     if(err) {
                                        //         res.send({ code: 100,message: 'User not found'}); 
                                        //     }else{
                                                res.send({ code: 200,orders:orderrows.recordset,message: 'Update success'});  
                                        //       }
                                        // })
                                          
                                    }
                                })
                       
                        }
                    })
                }else{
                    res.send({ code: 100,message: 'User not found'}); 
                }
            }else{
                res.send({ code: 100,message: 'User not found'}); 
            }
        
        
        },

cancelsubscription:function(req,res,next){
    let accessToken = req.get('Authorization'); 
  var  post=req.body;
    var user_Id=post.id;
   var  name=post.name;
  var email=post.email;;
    if(accessToken) {
        if(accessToken!=='') { 
                userModel = new MyAppModel();
                var qd = "SELECT role,id,email,name FROM users  WHERE auth_token='"+accessToken+"'";                            
                userModel.query(qd,function(err, rows) {
                    if(err) {
                        res.send({ code: 100,message: 'User not found'});                            
                    }
                    if (rows.recordset.length<1) {                   
                        res.send({ code: 100,message: 'A valid user is required'});                  
                    } 
                    else 
                    {
                        var headers= config.headers;
                        var options = { method: 'POST',
                        url: config.payment.link+'subscriptions/'+user_Id+'/cancel',
                       // qs: { id: post.id, order_id:randonnumber , description: 'paye' },
                        headers: headers
                        };
                     console.log(options);
                        request(options, function (error, response, body) {
                        if (error) throw new Error(error);
                       var body=JSON.parse(body);
                       console.log(body);
                      if(body.state=="pending"){
                        _cancel(user_Id);
                      }
                      
                        })

                        var _cancel=function(user_Id){
                            var options22 = { method: 'GET',
                            url: config.payment.link+'subscriptions/'+user_Id,
                            headers:headers
                            };
                            request(options22, function (error, response, body22) {
                                console.log(options22);
                                console.log(body22);
                                var body22=JSON.parse(body22);
                                 if(body22.state=='cancelled' || body22.state=='pending'){
                                     userModel.query("update orders set status='cancel' where subscription_id="+user_Id, function(err, orderrows) {
                                         if(err) {
                                             res.send({ code: 100,message: 'User not found'}); 
                                         }else{
                                             newUser={};
                                             newUser.trainername = name;
                                             newUser.email =email;
                                             newUser.name= rows.recordset[0].name;
                                             emailHelper.cancelSubscription(newUser, function(err, info  ){
                                               res.send({ code: 200,message: 'Update success'});   
                                             });
                                                
                                         }
                                         
                                     })
                                 }
                             })
                        }
                      
                     
                }
            })
        }else{
            res.send({ code: 100,message: 'User not found'}); 
        }
    }else{
        res.send({ code: 100,message: 'User not found'}); 
    }
},
cancelsubscriptionplan:function(req,res,next){
    let accessToken = req.get('Authorization'); 
  var  post=req.body;
    var user_Id=post.id;
   var  name=post.name;
  var email=post.email;;
    if(accessToken) {
        if(accessToken!=='') { 
                userModel = new MyAppModel();
                var qd = "SELECT role,id,email,name FROM users  WHERE auth_token='"+accessToken+"'";                            
                userModel.query(qd,function(err, rows) {
                    if(err) {
                        res.send({ code: 100,message: 'User not found'});                            
                    }
                    if (rows.recordset.length<1) {                   
                        res.send({ code: 100,message: 'A valid user is required'});                  
                    } 
                    else 
                    {
                        var headers= config.headers;
                        var options = { method: 'POST',
                        url: config.payment.link+'subscriptions/'+user_Id+'/cancel',
                       // qs: { id: post.id, order_id:randonnumber , description: 'paye' },
                        headers: headers
                        };
                        console.log(options);
                        request(options, function (error, response, body) {
                        if (error) throw new Error(error);
                        var body=JSON.parse(body);
                        console.log(body);
                       if(body.state=="pending"){
                         _cancel(user_Id);
                       }
                       
                         })
 
                         var _cancel=function(user_Id){
                             var options22 = { method: 'GET',
                             url: config.payment.link+'subscriptions/'+user_Id,
                             headers:headers
                             };
                             request(options22, function (error, response, body22) {
                                 console.log(options22);
                                 console.log(body22);
                                 var body22=JSON.parse(body22);
                                  if(body22.state=='cancelled'  || body22.state=='pending'){
                                      userModel.query("update orders set status='cancel' where subscription_id="+user_Id, function(err, orderrows) {
                                          if(err) {
                                              res.send({ code: 100,message: 'User not found'}); 
                                          }else{
                                            //   newUser={};
                                            //   newUser.trainername = name;
                                            //   newUser.email =email;
                                            //   newUser.name= rows.recordset[0].name;
                                            //   emailHelper.cancelSubscription(newUser, function(err, info  ){
                                                res.send({ code: 200,message: 'Update success'});   
                                             // });
                                                 
                                          }
                                          
                                      })
                                  }
                              })
                         }
                      
                     
                }
            })
        }else{
            res.send({ code: 100,message: 'User not found'}); 
        }
    }else{
        res.send({ code: 100,message: 'User not found'}); 
    }
},
deletephoto:function(req,res,next){
    let accessToken = req.get('Authorization');      
    if(accessToken) {
        if(accessToken!=='') { 
                userModel = new MyAppModel();
                var qd = "SELECT role,id FROM users  WHERE auth_token='"+accessToken+"'";                            
                userModel.query(qd,function(err, rows) {
                    if(err) {
                        res.send({ code: 100,message: 'User not found'});                            
                    }
                    if (rows.recordset.length<1) {                   
                        res.send({ code: 100,message: 'A valid user is required'});                  
                    } 
                    else 
                    {
                            id=rows.recordset[0].id;
                            var values="photo=0";

                            console.log("Update  users set "+values+" where id="+id);
                            userModel.query("Update  users set "+values+" where id="+id, function(err, rows) {
                            if(err) {
                                res.send({ code: 100,message: 'User not found'}); 
                            }else{
                               
                                       
                                        res.send({ code: 200,message: 'Update success'});  
                                
                                
                            }
                        })
               
                }
            })
        }else{
            res.send({ code: 100,message: 'User not found'}); 
        }
    }else{
        res.send({ code: 100,message: 'User not found'}); 
    }

},



logout:function(req,res,next){

    let accessToken = req.get('Authorization');      
    if(accessToken) {
        if(accessToken!=='') { 
                userModel = new MyAppModel();
                var qd = "SELECT role,id FROM users  WHERE auth_token='"+accessToken+"'";                            
                userModel.query(qd,function(err, rows) {
                    if(err) {
                        res.send({ code: 100,message: 'User not found'});                            
                    }
                    if (rows.recordset.length<1) {                   
                        res.send({ code: 100,message: 'A valid user is required'});                  
                    } 
                    else 
                    {
                            id=rows.recordset[0].id;
                            var values="is_loggedin=0,auth_token=''";

                            //console.log(values);
                            userModel.query("Update  users set "+values+" where id="+id, function(err, rows) {
                            if(err) {
                                res.send({ code: 100,message: 'User not found'}); 
                            }else{
                               
                                       
                                        res.send({ code: 200,message: 'Update success'});  
                                
                                
                            }
                        })
               
                }
            })
        }else{
            res.send({ code: 100,message: 'User not found'}); 
        }
    }else{
        res.send({ code: 100,message: 'User not found'}); 
    }
},

save_setting:function(req,res,next){
    
    let accessToken = req.get('Authorization');
    var post = req.body;        
    if(accessToken) {
        if(accessToken) { 
                userModel = new MyAppModel();
                var qd = "SELECT id FROM users  WHERE auth_token='"+accessToken+"'";                            
                userModel.query(qd,function(err, userrows) {
                    if(err) {
                        res.send({ code: 100,message: 'User not found'});                            
                    }
                    if (userrows.recordset.length<1) {                   
                        res.send({ code: 100,message: 'A valid user is required'});                  
                    } 
                    
                    else 
                    {
                        userId=userrows.recordset[0].id;
                        var mysqlTimestamp =moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
                        var qd = "update users set updated_at='"+mysqlTimestamp+"' where id="+userrows.recordset[0].id;
                        console.log(qd);
                         userModel.query(qd,function(err, rows) {
                             if(err) {
                                 res.send({ code: 100,message: 'User not found'});                            
                             }
                             else { 
                           var q = "UPDATE users SET message_setting = '" + post.setting + "' WHERE id='" +userId+"'";   
                               userModel.query(q,function(err, result) {
                               if(err) {
                                   //console.log(err);
                                  res.send({ code: 100,message: 'Internal server error. Please try again'});
                               }
                               else {
                                   res.send({ code: 200,message: 'Success'});                                        
                               }
                           });
                        }
                    })    
                      
                   }
                                   
           });
       }
   }
   else {
       res.send({ code: 100,message: 'A valid username is required'});   
   }
},

update_messagetime:function(req,res,next){
    
   var post = req.body;        
   if(post) {   
       if(post.user_id!=='' && post.reciver_id!=='') {
          var token=post.token;
          var userId=post.id;
           userModel = new MyAppModel();
           userModel.query("select * from messages where  recipient_id='"+post.reciver_id+"' and sender_id="+post.user_id+" order by id desc ", function(err, rows) {
            if (rows.recordset.length<1) {                   
                 res.send({ code: 100,message: 'A valid confirmation_token is required'});                  
               }
               else { 
                   if (rows.recordset[0].confirmed_at!=null ) {
                       res.send({ code: 100,message: 'Oops! Account Already Activate'});
                   }
                   else {
                       todaydate =moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
                           var q = "UPDATE messages SET updated_at = '" + todaydate + "' WHERE id='" +rows.recordset[0].id+"'";   
                               userModel.query(q,function(err, result) {
                               if(err) {
                                   //console.log(err);
                                  res.send({ code: 100,message: 'Internal server error. Please try again'});
                               }
                               else {
                                   res.send({ code: 200,message: 'Success'});                                        
                               }
                           });    
                      
                   }
               }                    
           });
       }
   }
   else {
       res.send({ code: 100,message: 'A valid username is required'});   
   }
},


}


function number_format(number, decimals, dec_point, thousands_point) {
    
        if (number == null || !isFinite(number)) {
            throw new TypeError("number is not valid");
        }
    
        if (!decimals) {
            var len = number.toString().split('.').length;
            decimals = len > 1 ? len : 0;
        }
    
        if (!dec_point) {
            dec_point = '.';
        }
    
        if (!thousands_point) {
            thousands_point = ',';
        }
    
        number = parseFloat(number).toFixed(decimals);
    
        number = number.replace(".", dec_point);
    
        var splitNum = number.split(dec_point);
        splitNum[0] = splitNum[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousands_point);
        number = splitNum.join(dec_point);
    
        return number;
    }
function uploaduserimage(cb){
    var base64Img = require('base64-img');
        // Regular expression for image type:
   // This regular image extracts the "jpeg" from "image/jpeg"
   var imageTypeRegularExpression      = /\/(.*?)$/;      
   
      // Generate random string
      var crypto                          = require('crypto');
      var seed                            = crypto.randomBytes(20);
      var uniqueSHA1String                = crypto
                                             .createHash('sha1')
                                              .update(seed)
                                               .digest('hex');
                                             //  console.log(343434);
   //console.log(image);
      var base64Data = image;
   
    //   var imageBuffer                      = decodeBase64Image(base64Data);
    //   var userUploadedFeedMessagesLocation = 'server/uploads/users/';
   
      var uniqueRandomImageName            = 'image-' + uniqueSHA1String;
      // This variable is actually an array which has 5 values,
      // The [1] value is the real image extension
    //   var imageTypeDetected                = imageBuffer
    //                                           .type
    //                                            .match(imageTypeRegularExpression);
   
    //   var userUploadedImagePath            = userUploadedFeedMessagesLocation + 
    //                                          uniqueRandomImageName +
    //                                          '.' + 
    //                                          imageTypeDetected[1];
   
      // Save decoded binary image to disk
      console.log(22);
      try
      {

        var azure = require('azure');
        var accessKey = '6h3dY22tndMG0osMtVvtuE9qRYN/yoXk2jaUOUUjPOGujj3LaGht9iDr1CxVkn5r1M1cZCZIkpCnz1D07Gu2+g==';
        var storageAccount = 'wellfasterstore';
        var matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        var type = matches[1];
        var buffer = new Buffer(matches[2], 'base64');
        var uploadimage=uniqueRandomImageName +
        '.' + 
        type;
        var blobService = azure.createBlobService(storageAccount, accessKey);
        var uploadOptions = {
            container: 'images',
            blob: uploadimage, 
            text: image 
        }
        console.log(uploadOptions);
        blobService.createBlockBlobFromText(uploadOptions.container, 
                                                   uploadOptions.blob,buffer, {contentType:type}, 
                             
                              function(error, result, response) {
                                   if (error) {
                                       res.send(error);
                                   }
                                   cb(result.name);
                                   console.log("response", result);
                                   console.log("response", response);
                              });
          
    
      }
      catch(error)
      {
          //console.log('ERROR:', error);
      }
}

function decodeBase64Image(dataString) 
{
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  var response = {};

  if (matches.length !== 3) 
  {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');

  return response;
}