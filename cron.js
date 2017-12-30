
var cron = require('node-cron');
cron.schedule('* * * * *', function(req,res){
    userModel = new MyAppModel();
    userModel.query("select u.email,u.id,u.message_setting from  messages m left join users u on m.recipient_id =u.id  group by u.email,u.id,u.message_setting", function(err, userrows) {
        if(err) {
            console.log(err);
            //res.send({ status: 'error',logs: {},message: 'Internal server error. Please try again'});
    }else{   
        if (userrows.recordset.length<1) {                     
           // res.send({ code: 100,message: 'Email is already exist'});                  
        }else{
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
        userModel.query("select max(ml.message_id) as message_id  from  messages_logs ml where ml.user_id="+userId+" group by ml.message_id", function(err, messagelogsrows) {
            if(err) {
                console.log(err);
                res.send({ status: 'error',logs: {},message: 'Internal server error. Please try again'});
        }else{   
            if (messagelogsrows.recordset.length>1) { 
                count=messagelogsrows.recordset.length-1;
                messageId=messagelogsrows.recordset[count].message_id;
                userModel.query("select m.id,m.recipient_id,m.sender_id,m.created_at,m.message,u.photo,u.name from  messages m left join users u u.id=m.sender_id where  (m.recipient_id="+userId+" or  m.sender_id="+userId+") and m.created_at<DATEADD(minute,-5,GETDATE()) and m.id>"+messageId, function(err, messagerows) {
                    if(err) {
                        console.log(err);
                        res.send({ status: 'error',logs: {},message: 'Internal server error. Please try again'});
                }else{ 
                    console.log(messagerows.recordset.length);
                    countlength=messagerows.recordset.length-1;
                    if (messagerows.recordset.length>=1) {   
                    for(i in messagerows.recordset)
                    {
                        messageId=messagerows.recordset[i].id;
                        userid=userId;
                        mysqlTimestamp =moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
                        
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
                            emailHelper.message(newUser, function(err, info){
          //  return  res.send({ code: 200,message: 'Message Successfully send.'}); 
                                });
                            } 
                            
                            
                        }
                    })
                       
                    }
                     
                        
                      } 

                }
            })
                                  
            }else{
                userModel.query("select m.id,m.recipient_id,m.sender_id,m.created_at,m.message u.photo,u.name from  messages m left join users u u.id=m.sender_id where (m.recipient_id="+userId+" or  m.sender_id="+userId+") and m.created_at<DATEADD(minute,-5,GETDATE())", function(err, messagerows) {
                    if(err) {
                        console.log(err);
                        res.send({ status: 'error',logs: {},message: 'Internal server error. Please try again'});
                }else{ 
                    console.log(messagerows.recordset.length);
                    countlength=messagerows.recordset.length-1;
                    if (messagerows.recordset.length>=1) {   
                    for(i in messagerows.recordset)
                    {
                        messageId=messagerows.recordset[i].id;
                        userid=userId;
                        mysqlTimestamp =moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
                        
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
                            emailHelper.message(newUser, function(err, info){
          //  return  res.send({ code: 200,message: 'Message Successfully send.'}); 
                                });
                            }
                        }
                    })
                       
                    }
               
                       
                     
                        
                      } 

                }
            })
    
            }
         
        } 
        })

     }

    // emailHelper.sendAccountConfirmation(newUser, function(err, info){
    //         return  res.send({ code: 200,message: 'Message Successfully send.'}); 
    // });

});