const dateFormat = require('dateformat');
const nodemailer = require('nodemailer');

const dbconfig = require('../../database');
const MyAppModel = require('../../models/dbconnection');
userModel = new MyAppModel();

module.exports = {      

    index: function(req, res, next){   
        var message='';
        if(req.session.success) {
            message=req.session.success;
            delete req.session.success;
        } 
        var error='';
        if(req.session.error) {
            error=req.session.error;
            delete req.session.error;
        }         

		res.render('admin/users.ejs',{ success: message,errors: error});
    },

    edit: function(req, res, next){          
        var getId = req.params.id;        
        if(typeof getId!=='undefined') {
            userModel.read(getId, function(err, rows) {
                if(rows) {
                    res.render('admin/edit-user.ejs',{user_id:getId,message: '',errors: {},result:rows});
                }
                else {
                    res.redirect('/admin/users');
                }      
            });
        }
        else {
            res.render('admin/edit-user.ejs',{ user_id:'',message: '',errors: {},result:{}});
        }       
    },

    delete: function(req, res, next){          
        var getId = req.params.id;  
        
        if(typeof getId!=='undefined') {
            
            var qd = "SELECT * FROM users WHERE id='"+getId+"'";     
            
            userModel.query(qd, function(err, rows) {            
                if(rows && rows.length > 0) {                  
                    var qd = "DELETE FROM users WHERE id='"+getId+"'"; 
                    userModel.query(qd,function(err, rows) {
                        if(err) {
                            req.session.error="Sorry! user not deleted. Please try again";
                            res.redirect('/admin/users');
                        }
                        else {
                            req.session.success="User deleted successfully";
                            res.redirect('/admin/users');
                        }
                    });
                                     
                }else {
                    res.redirect('/admin/users');
                }   
            });
        }
        else {
            res.redirect('/admin/users');
        }       
    },

    update: function(req, res, next) {
        var getId = req.params.id;
        var post = req.body;
        if(post && post.submit=='Submit') {
            if(typeof getId!=='undefined') {                
                //VALIDATE FORM
                req.assert('username', 'A valid email address is required').isEmail();  //Validate username
                req.assert('first_name', 'First name is required').notEmpty();     //Validate first_name
                req.assert('last_name', 'Last name is required').notEmpty();     //Validate last_name                
                
                var errors = req.validationErrors();           
                if(!errors){
                    //CHECK FOR DUPLICATE
                    var qd = "SELECT id FROM users WHERE username='"+post.username+"' AND id!='"+getId+"'";
                    //console.log("==="+qd);
                    userModel.query(qd,function(err, rows) {
                        if(rows.length>0) {
                            res.render('admin/edit-user.ejs',{user_id:getId, message: 'Sorry! Email Address already exists in our database. Please enter another Email Address.',errors: {},result:post});
                        }
                        else {
                            var q = "UPDATE users SET username='"+post.username+"',first_name='"+addslashes(post.first_name)+"',last_name='"+addslashes(post.last_name)+"',updated=now() WHERE id='"+getId+"'";
                            userModel.query(q,function(err, rows) {
                                if(err) {
                                   res.render('admin/edit-user.ejs',{ user_id:getId,message: 'Sorry! record not updated. Please try again.',errors: {},result:post});
                                }
                                else {
                                    req.session.success="User updated successfully.";
                                    res.redirect('/admin/users');
                                }
                            });
                        }
                    });                    
                    
                }
                else {
                    res.render('admin/edit-user.ejs',{user_id:getId, message: '',errors: errors,result:post});
                }    
            }
            else {                
                //VALIDATE FORM
                req.assert('username', 'A valid email address is required').isEmail();  //Validate username
                req.assert('password', 'Password is required').notEmpty();     //Validate password
                req.assert('password_again', 'Re Password is required').notEmpty();     //Validate Re Password
                req.assert('first_name', 'First name is required').notEmpty();     //Validate first_name
                req.assert('last_name', 'Last name is required').notEmpty();     //Validate last_name                
                req.assert('password_again', 'Passwords do not match').equals(req.body.password);               
                var errors = req.validationErrors();           
                if(!errors){
                    var qd = "SELECT id FROM users WHERE username='"+post.username+"'";
                    userModel.query(qd,function(err, rows) {
                        if(rows.length>0) {
                            res.render('admin/edit-user.ejs',{user_id:'', message: 'Sorry! Email Address already exists in our database. Please enter another Email Address.',errors: {},result:post});
                        }
                        else {
                            post.password = bcrypt.hashSync(post.password, null, null);  // use the generateHash function in our user model
                            var q = "INSERT INTO users SET username='"+post.username+"',password='"+post.password+"',first_name='"+addslashes(post.first_name)+"',last_name='"+addslashes(post.last_name)+"',time_zone='',start_time='',created=now()";
                            userModel.query(q,function(err, rows) {
                                if(err) {
                                   res.render('admin/edit-user.ejs',{user_id:'', message: 'Sorry! record not added. Please try again.',errors: {},result:post});
                                }
                                else {
                                    //SEND EMAIL TO NOTIFY USERS
                                    var transport = nodemailer.createTransport({ 
                                        host: dbconfig.mailer.host, 
                                        port: dbconfig.mailer.port, 
                                        auth: { user: dbconfig.mailer.user, pass: dbconfig.mailer.password },
                                        secure: true
                                    });  
                                    var message="Hi "+capitalizeFirstLetter(post.first_name)+" "+capitalizeFirstLetter(post.last_name)+",<br /><br />Your account has been successfully activated on Focus! app. Please find below login detail.<br /><br />Email: "+post.username+"<br />Password: "+post.password_again+"<br /><br />Thanks,<br />Focus! App Support";

                                    var mailOptions = {
                                        from: dbconfig.mailer.from, // sender address
                                        to: post.username, //, // list of receivers
                                        subject: "User Registration - Focus!", // Subject line                               
                                        html:message // html body
                                    };
                                    transport.sendMail(mailOptions);


                                    req.session.success="New user Created successfully.";
                                    res.redirect('/admin/users');
                                }
                            });
                        }
                    });
                }
                else {
                    res.render('admin/edit-user.ejs',{ user_id:'',message: '',errors: errors,result:post});
                }
            }
        }
        else {
            res.redirect('/admin/users');
        }
    },

    change_password: function(req, res, next) {
        var getId = req.params.id;
        var post = req.body;       
        if(typeof post!=='undefined' && post.submit=='Submit') {
            //VALIDATE FORM           
            req.assert('new_password', 'Password is required').notEmpty();           //Validate password
            req.assert('password_again', 'Re Password is required').notEmpty();     //Validate Re Password
            req.assert('password_again', 'Passwords do not match').equals(req.body.new_password);
            var errors = req.validationErrors();           
            if(!errors){
                var qd = "SELECT password FROM users WHERE id='"+getId+"'";                            
                adminModel.query(qd,function(err, rows) {
                    if(err) {
                        res.render('admin/change-password.ejs',{message: "Sorry! record not updated. Please try again.",errors: {}});
                    }
                    else { 
                        post.password = bcrypt.hashSync(post.new_password, null, null);  // use the generateHash function in our user model
                        var q = "UPDATE users SET password='"+ post.password+"' WHERE id='"+getId+"'";
                        settingsModel.query(q,function(err, rows) {
                            if(err) {
                               res.render('admin/change-password.ejs',{ message: 'Sorry! record not updated. Please try again.',errors: {}});
                            }
                            else {
                                req.session.success="Password updated successfully.";
                                res.redirect('/admin/users');
                            }
                        });
                    }
                });
            }
            else {
               res.render('admin/change-password.ejs',{message: '',errors: errors});
            }
        }
        else {
             res.render('admin/change-password.ejs',{message: '',errors: {}});
        }
    },

    cycle: function(req, res, next){          
        var getId = req.params.id;        
        if(typeof getId!=='undefined') {
           var qd = "SELECT * FROM users WHERE id='"+getId+"'";
            userModel.query(qd,function(err, rows) {
                if(rows) { 
                    //console.log(rows[0].start_time);
                    if(rows[0].start_time!=='0000-00-00 00:00:00') {
                        rows[0]['start_time']=dateFormat(rows[0].start_time, "yyyy-mm-dd h:MM TT");
                    }                    
                    res.render('admin/edit-cycle.ejs',{user_id:getId,message: '',errors: {},result:rows[0]});
                }
                else {
                    res.redirect('/admin/users');
                }      
            });
        }
        else {
            res.redirect('/admin/users');
        }       
    },

    update_cycle: function(req, res, next){
        var getId = req.params.id;
        var post = req.body;
        if(post && post.submit=='Submit') {
            if(typeof getId!=='undefined') {                
                //VALIDATE FORM
                req.assert('cycle', 'Cycle is required').notEmpty();     //Validate Cycle
                req.assert('time_zone', 'Time Zone is required').notEmpty();     //Validate time_zone
                req.assert('start_time', 'Session Start Day/Time is required').notEmpty();     //Validate Session Start Day/Time
                var errors = req.validationErrors();           
                if(!errors){
                    if(post.start_time!=='' && post.time_zone!=='') {   
                       var getDate = dateFormat(post.start_time, "yyyy-mm-dd HH:MM:ss");                            
                        sql="SELECT CONVERT_TZ('"+getDate+"', '"+post.time_zone+"', '-00:00' ) as dbstartdate,now() as todayDate";                       
                        userModel.query(sql,function(err, rows) { 
                            var d=new Date(rows[0].dbstartdate);                         
                            var today = new Date(rows[0].todayDate);
                            if(today.getTime()>d.getTime()) {
                                var error="Start Time must be greater than the current time";
                                res.render('admin/edit-cycle.ejs',{user_id:getId,message: error,errors: {},result:post});
                            }
                            else {
                                var getSelectedSessionDate = dateFormat(post.start_time, "yyyy-mm-dd HH:MM:ss");
                                var getNextSessionDate = dateFormat(rows[0].dbstartdate, "yyyy-mm-dd HH:MM:ss"); 
                                var q = "UPDATE users SET cycle='"+post.cycle+"',time_zone='"+post.time_zone+"',start_time='"+getSelectedSessionDate+"',db_session_date='"+getNextSessionDate+"',updated=now() WHERE id='"+getId+"'";
                                userModel.query(q,function(err, rows) {
                                    if(err) {
                                       res.render('admin/edit-cycle.ejs',{ user_id:getId,message: 'Sorry! record not updated. Please try again.',errors: {},result:post});
                                    }
                                    else {
                                        req.session.success="User reminder cycle updated successfully.";
                                        res.redirect('/admin/users');
                                    }
                                });
                            }
                        });

                    }
                }
            }
        }
    },

    logs: function(req, res, next){   
        var getId = req.params.id;        
        if(typeof getId!=='undefined') {
           var qd = "SELECT id FROM users WHERE id='"+getId+"'";
            userModel.query(qd,function(err, rows) {
                if(rows) {                                        
                    res.render('admin/logs.ejs',{user_id:getId,message: '',errors: {},result:rows[0]});
                }
                else {
                    res.redirect('/admin/users');
                }      
            });
        }
        else {
            res.redirect('/admin/users');
        } 
    },

    logs_delete: function(req, res, next){   
        var userId = req.params.userid; 
        var getId = req.params.id;        
        
        if(typeof getId!=='undefined' && typeof userId!=='undefined') {
           var qd = "DELETE FROM events_log WHERE id='"+getId+"' AND user_id = '"+ userId+"'";
            userModel.query(qd,function(err, result) {
                if(! err) {                                        
                    res.redirect('/admin/users/logs/' + userId);
                }else{
                    res.redirect('/admin/users/logs/' + userId);
                }      
            });
        }
        else {
            res.redirect('/admin/users/logs/' + userId);
        } 
    },

    prompts: function(req, res, next){   
        var getId = req.params.id;        
        var resultData = {};
        var user_tz = "+00:00";
        if(typeof getId!=='undefined') {

            getTimezone(req, res, next);

            function getTimezone(req, res, next){
                var tzQuery = "SELECT timezone FROM common_settings";
                userModel.query(tzQuery, function(err, rows) {
                    if(rows){
                        user_tz = rows[0].timezone; 
                    }
                    getPromptPercentForWeek(req, res, next);
                }); 
            }

            function getPromptPercentForWeek(req, res, next){
                var qd = "SELECT response, count(*) as count FROM prompts WHERE user_id='"+getId+"' and DATE(created_at) > (NOW() - INTERVAL 7 DAY) and DATE(created_at) < CURDATE() GROUP BY response";
                userModel.query(qd,function(err, prrows) {
                    if(prrows) {
                        var count = 0;
                        var response_count = 0;
                        prrows.forEach(function(row){
                            count += row.count;
                            if(row.response == 1){
                                response_count += row.count;
                            }
                        });    
                        resultData.prompt_week_percent = ((response_count * 100) / count );    
                    }
                    getPromptPercent(req, res, next);    
                });
            }

            function getPromptPercent(req, res, next){
                var qd = "SELECT response, count(*) as count FROM prompts WHERE user_id='"+getId+"' GROUP BY response";
                userModel.query(qd,function(err, prrows) {
                    if(prrows) {
                        var count = 0;
                        var response_count = 0;
                        prrows.forEach(function(row){
                            count += row.count;
                            if(row.response == 1){
                                response_count += row.count;
                            }
                        });    
                        resultData.prompt_percent = ((response_count * 100) / count );    
                    }
                    getUserIntervention(req, res, next);    
                });
            }

            function getUserIntervention(req, res, next){
                var qd = "SELECT window1, window2, window3 FROM users WHERE id='"+getId+"'";
                userModel.query(qd,function(err, rows) {
                    if(rows) {   
                        resultData['intervention'] = rows[0];
                        
                    }
                    getPromptResposnseSummary(req, res, next);
                });
            }

            function getPromptResposnseSummary(req, res, next){
                var qd = "SELECT * FROM events_log WHERE user_id='"+getId+"' and is_prompt='1' and submodule like '%assessment1%' and DATE(created_at) > (NOW() - INTERVAL 7 DAY)";
                userModel.query(qd,function(err, prows) {
                    if(prows) {
                        var arr = {
                            voice : {
                                count : 0,
                                response1: 0,
                                response2: 0,
                                response3: 0,
                                response4: 0,
                            },
                            sleep : {
                                count : 0,
                                response1: 0,
                                response2: 0,
                                response3: 0,
                                response4: 0,
                            },
                            medication:{
                                count : 0,
                                response1: 0,
                                response2: 0,
                                response3: 0,
                                response4: 0,
                            },
                            mood:{
                                count : 0,
                                response1: 0,
                                response2: 0,
                                response3: 0,
                                response4: 0,
                            },
                            social:{
                                count : 0,
                                response1: 0,
                                response2: 0,
                                response3: 0,
                                response4: 0,
                            }
                        }; 
                        prows.forEach(function(row){
                            if( row.submodule == "Voices:assessment1"){
                                arr['voice']['count'] += 1; 
                                if(row.response == "response1"){
                                    arr['voice']['response1'] += 1; 
                                }
                                if(row.response == "response2"){
                                    arr['voice']['response2'] += 1; 
                                }
                                if(row.response == "response3"){
                                    arr['voice']['response3'] += 1; 
                                }
                                if(row.response == "response4"){
                                    arr['voice']['response4'] += 1; 
                                }
                            }else if( row.submodule == "Mood:assessment1"){
                                arr['mood']['count'] += 1; 
                                if(row.response == "response1"){
                                    arr['mood']['response1'] += 1; 
                                }
                                if(row.response == "response2"){
                                    arr['mood']['response2'] += 1; 
                                }
                                if(row.response == "response3"){
                                    arr['mood']['response3'] += 1; 
                                }
                                if(row.response == "response4"){
                                    arr['mood']['response4'] += 1; 
                                }
                            }else if( row.submodule == "Sleep:assessment1"){
                                arr['sleep']['count'] += 1; 
                                if(row.response == "response1"){
                                    arr['sleep']['response1'] += 1; 
                                }
                                if(row.response == "response2"){
                                    arr['sleep']['response2'] += 1; 
                                }
                                if(row.response == "response3"){
                                    arr['sleep']['response3'] += 1; 
                                }
                                if(row.response == "response4"){
                                    arr['sleep']['response4'] += 1; 
                                }
                            }else if( row.submodule == "Social:assessment1"){
                                arr['social']['count'] += 1; 
                                if(row.response == "response1"){
                                    arr['social']['response1'] += 1; 
                                }
                                if(row.response == "response2"){
                                    arr['social']['response2'] += 1; 
                                }
                                if(row.response == "response3"){
                                    arr['social']['response3'] += 1; 
                                }
                                if(row.response == "response4"){
                                    arr['social']['response4'] += 1; 
                                }
                            }else if( row.submodule == "Medication:assessment1"){
                                arr['medication']['count'] += 1; 
                                if(row.response == "response1"){
                                    arr['medication']['response1'] += 1; 
                                }else if(row.response =="response2"){
                                    arr['medication']['response2'] += 1; 
                                }else if(row.response == "response3"){
                                    arr['medication']['response3'] += 1; 
                                }else if(row.response == "response4"){
                                    arr['medication']['response4'] += 1; 
                                }
                            }
                        });      
           
                        // Calculate percentage
                           
                        var percentArr = {
                            medication : {
                                resp1 :0,
                                resp2 :0,
                                resp3 :0,
                                resp4:0 
                            },
                            mood : {
                                resp1 :0,
                                resp2 :0,
                                resp3 :0,
                                resp4:0 
                            },
                            voice: {
                                resp1 :0,
                                resp2 :0,
                                resp3 :0,
                                resp4:0 
                            },
                            sleep : {
                                resp1 :0,
                                resp2 :0,
                                resp3 :0,
                                resp4:0 
                            },
                            social : {
                                resp1 :0,
                                resp2 :0,
                                resp3 :0,
                                resp4:0 
                            }
                        };

                        percentArr['medication']['resp1'] =  ((arr['medication']['response1'] * 100 ) / arr['medication']['count']);
                        percentArr['medication']['resp2'] =  ((arr['medication']['response2'] * 100 ) / arr['medication']['count']);
                        percentArr['medication']['resp3'] =  ((arr['medication']['response3'] * 100 ) / arr['medication']['count']);
                        percentArr['medication']['resp4'] =  ((arr['medication']['response4'] * 100 ) / arr['medication']['count']);

                        percentArr['voice']['resp1'] =  ((arr['voice']['response1'] * 100 ) / arr['voice']['count']);
                        percentArr['voice']['resp2'] =  ((arr['voice']['response2'] * 100 ) / arr['voice']['count']);
                        percentArr['voice']['resp3'] =  ((arr['voice']['response3'] * 100 ) / arr['voice']['count']);
                        percentArr['voice']['resp4'] =  ((arr['voice']['response4'] * 100 ) / arr['voice']['count']);

                        percentArr['mood']['resp1'] =  ((arr['mood']['response1'] * 100 ) / arr['mood']['count']);
                        percentArr['mood']['resp2'] =  ((arr['mood']['response2'] * 100 ) / arr['mood']['count']);
                        percentArr['mood']['resp3'] =  ((arr['mood']['response3'] * 100 ) / arr['mood']['count']);
                        percentArr['mood']['resp4'] =  ((arr['mood']['response4'] * 100 ) / arr['mood']['count']);


                        percentArr['sleep']['resp1'] =  ((arr['sleep']['response1'] * 100 ) / arr['sleep']['count']);
                        percentArr['sleep']['resp2'] =  ((arr['sleep']['response2'] * 100 ) / arr['sleep']['count']);
                        percentArr['sleep']['resp3'] =  ((arr['sleep']['response3'] * 100 ) / arr['sleep']['count']);
                        percentArr['sleep']['resp4'] =  ((arr['sleep']['response4'] * 100 ) / arr['sleep']['count']);

                        percentArr['social']['resp1'] =  ((arr['social']['response1'] * 100 ) / arr['social']['count']);
                        percentArr['social']['resp2'] =  ((arr['social']['response2'] * 100 ) / arr['social']['count']);
                        percentArr['social']['resp3'] =  ((arr['social']['response3'] * 100 ) / arr['social']['count']);
                        percentArr['social']['resp4'] =  ((arr['social']['response4'] * 100 ) / arr['social']['count']);
                        resultData['percentArr'] = percentArr;
                    }
                    getPromptLog(req, res, next);
                });
            }
            
            function getPromptLog(req, res, next){
                var qd = "SELECT id, user_id, contact_type, intervention, event, response, responded, convert_tz(sending_at, '+00:00', '"+user_tz+"') as sending_at FROM prompts WHERE user_id='"+getId+"' and DATE(created_at) > (NOW() - INTERVAL 14 DAY)  ORDER BY created_at DESC";
                
                userModel.query(qd,function(err, prrows) {
                    if(prrows) {
                        resultData['prompts_log'] = prrows; 
                    }
                    getPromptResponseLog(req, res, next);    
                });   
            }

            function getPromptResponseLog(req, res, next){
                var qd = "SELECT id, user_id, 'Prompt' as contact_type, intervention, event, response, responded, sending_at, convert_tz(received_at, '+00:00', '"+user_tz+"') as received_at FROM prompts WHERE user_id='"+getId+"' AND response='1' and DATE(created_at) > (NOW() - INTERVAL 14 DAY)  ORDER BY created_at DESC";
                userModel.query(qd,function(err, rrows) {
                    if(rrows) {
                        resultData['response_log'] = rrows;
                    }
                    getResponseLog(req, res, next);     
                });   
            }

            function getResponseLog(req, res, next){
                var qd = "SELECT 'On Demand' as contact_type, module, submodule as intervention, '-' as response, convert_tz(created_at, '+00:00', '"+user_tz+"') as created_at FROM events_log WHERE user_id='"+getId+"' AND is_prompt='0' and (module = 'Home' or module = 'Toolbox') and submodule != '' and DATE(created_at) > (NOW() - INTERVAL 14 DAY) ORDER BY created_at DESC";
                
                userModel.query(qd,function(err, rrows) {
                    if(rrows) {
                        rrows.forEach(function(row){
                            if(row.module == 'Toolbox'){
                                row.intervention = 'Toolbox -' + row.intervention;
                            }
                        });
                        resultData['ondemand_response_log'] = rrows;
                    }    
                }); 
                getToolboxLog(req, res, next); 
            }

            function getToolboxLog(req, res, next){
                var toolboxLog = {
                    "count" : 0,
                    "Introduction" : 0,
                    "MoodSupport" : 0,
                    "SocialBoost" : 0, 
                    "ThoughtChallenges" : 0,
                    "Relax" : 0
                };

                var qd = "SELECT * FROM events_log WHERE user_id='"+getId+"' AND module ='Toolbox' and submodule != '' and action = 'clicked' and DATE(created_at) > (NOW() - INTERVAL 7 DAY)";
                userModel.query(qd,function(err, trows) {
                    if(trows) {
                        toolboxLog["count"] = trows.length; 
                        trows.forEach( function(row){
                            if(row.submodule == "Introduction"){
                               toolboxLog["Introduction"] += 1;      
                            }else if(row.submodule == "Mood Support"){
                                toolboxLog["MoodSupport"] += 1; 
                            }else if(row.submodule == "Social Boost"){
                                toolboxLog["SocialBoost"] += 1; 
                            }else if(row.submodule == "Thought Challenges"){
                                toolboxLog["ThoughtChallenges"] += 1; 
                            }else if(row.submodule == "Relax"){
                                toolboxLog["Relax"] += 1; 
                            }
                        });           
                        resultData['toolboxLog'] = toolboxLog;
                    }
                    renderPage(req, res, next);    
                });   
            }
            
            function renderPage(req, res, next){

                res.render('admin/prompts.ejs',{
                    dateFormat:dateFormat,
                    user_id:getId,
                    message: '',
                    errors: {},
                    resultData:resultData
                });
            }   
        }
        else {
            res.redirect('/admin/users');
        } 
 
    },
    
    exports_log: function(req, res, next){  
        
        var defaultTimeZone = "+00:00";
        //var userId = req.params.id; 
        resultcsv_head = {
            username : 'Username',
            first_name : 'First Name',
            last_name : 'Last Name',
            created_at : 'Created At',
            responded_at : 'Responded At',
            intervention_module : 'Intervention Module',
            answer_identifier : 'Answer Identifier',
            contact_type : 'Contact Type',
            feedback_type : 'Feedback Type',
            module_assigned : 'Module Assigned'
        }; 
        var resultcsv = [];

        var resultRows = [];

        function checkUserParams(){
            return Q.Promise(function(resolve, reject) {
                if(req.params.id !== "undefined"){
                    resolve(req.params.id);
                }else{
                    reject("Invalid Params.");
                }
            });      
        }

        function checkUser(userId){
            return Q.Promise(function(resolve, reject) {
                var sQuery = "SELECT id FROM users WHERE id='"+userId+"'";
                
                userModel.query(sQuery,function(err, rows){
                    if(rows && rows.length > 0){
                        resolve(rows[0].id);
                    }
                    else{
                        reject("Invalid User.");
                    }
                });
            });      
        }

        function getTimezone(user){
            return Q.Promise(function(resolve, reject) {
                var tzQuery = "SELECT timezone FROM common_settings";
                userModel.query(tzQuery, function(err, rows) {
                    if(err){
                        reject("Timezone error"); 
                    }
                    else if(rows && rows.length > 0){
                        resolve({
                            tz : rows[0].timezone, 
                            user : user
                        });
                    }
                    else{
                        resolve({
                            tz : defaultTimeZone, 
                            user:username
                        });
                    }
                });
            });     
        }

        function getOnDemandRows(result){
            return Q.Promise(function(resolve, reject) {
                var sQuery = "SELECT e.id, e.user_id, e.module, e.submodule, e.action, e.prompt_id, e.response, convert_tz(e.created_at, '+00:00', '"+result.tz+"') as created_at, u.username, u.first_name, u.last_name, u.window1, u.window2,u.window3 from events_log as e left join users as u on u.id = e.user_id WHERE e.user_id = '"+ result.user +"' and e.module = 'Slides' and e.is_prompt = '0'";
                userModel.query(sQuery,function(err, rows) {
                    if(err){
                        reject("getOnDemandRows"); 
                    }
                    else{
                        result.records = rows;
                        resolve(result); 
                    }
                    
                });
                
            });    
        }

        function getPromptRows(result){
            return Q.Promise(function(resolve, reject) {
                var qd = "SELECT e.id, e.user_id, e.module, e.submodule, e.action, e.prompt_id, e.response, convert_tz(e.created_at, '+00:00', '"+result.tz+"') as created_at, u.username, u.first_name, u.last_name, u.window1, u.window2,u.window3, convert_tz(p.created_at, '+00:00', '"+result.tz+"') as prompt_created_at FROM events_log as e inner join prompts as p on e.prompt_id = p.id left join users as u on e.user_id = u.id WHERE e.user_id = '"+ result.user +"' and e.module = 'Slides' and is_prompt = '1'";
                userModel.query(qd,function(err, rows) {
                    if(err){
                        reject("getPromptRows");
                    }
                    else{
                        if(rows.length > 0) {
                            array_merge_sort(result.records, rows);
                        }
                        resolve(result);    
                    } 
                });
            });    
        }

        function getPromptMissRows(result){
            return Q.Promise(function(resolve, reject) {
                var qd1 = "SELECT  p.id, p.user_id, p.contact_type,p.intervention, p.event, p.response, p.responded, convert_tz(p.received_at, '+00:00', '"+result.tz+"') as received_at, convert_tz(p.created_at, '+00:00', '"+result.tz+"') as created_at, u.username, u.first_name, u.last_name, u.window1, u.window2,u.window3 from prompts as p  left join users as u on p.user_id = u.id WHERE p.user_id = '"+ result.user +"' and p.response = '0'";
                
                userModel.query(qd1,function(err, mrows) {
                    if(err){
                        reject("getPromptMissRows");
                    }   
                    else{
                        result.missed_prompts = []; 
                        if(mrows.length > 0) {
                            mrows.forEach(function(mrow){
                                var obj = {
                                    username : mrow.username,
                                    first_name : mrow.first_name,
                                    last_name : mrow.last_name,
                                    created_at : dateFormat(new Date(mrow.created_at), "yyyy-mm-dd HH:MM:ss"),
                                    responded_at : (mrow.received_at == null) ? mrow.received_at : dateFormat(new Date(mrow.received_at), "yyyy-mm-dd HH:MM:ss"),
                                    intervention_module : mrow.intervention,
                                    answer_identifier : '',
                                    contact_type : 'Prompt',
                                    feedback_type : mrow.responded
                                }
                                if( obj.intervention_module ==  mrow.window1 || obj.intervention_module ==  mrow.window2 || obj.intervention_module ==  mrow.window3){
                                    obj.module_assigned = '1';
                                }else{
                                    obj.module_assigned = '0';
                                }
                                result.missed_prompts.push(obj);
                            });
                        }
                        resolve(result);
                    } 
                    
                });
            });
        }
        
        function getToolboxLog(result){
            return Q.Promise(function(resolve, reject) {
                var toolboxLog = {
                    "count" : 0,
                    "Introduction" : 0,
                    "MoodSupport" : 0,
                    "SocialBoost" : 0, 
                    "ThoughtChallenges" : 0,
                    "Relax" : 0
                };

                var qd = "SELECT * from events_log left join users on users.id = events_log.user_id WHERE user_id = '"+ result.user +"' and module ='Toolbox' and submodule != '' and action = 'clicked'";

                //var qd = "SELECT * FROM events_log WHERE user_id='"+getId+"' AND module ='Toolbox' and submodule != '' and action = 'clicked'";
                
                userModel.query(qd,function(err, trows) {
                    if(err){
                        reject("getToolboxLog");   
                    }else{
                        result.toolbox_records = [];
                        if(trows.length > 0) {
                            toolboxLog["count"] = trows.length; 
                            trows.forEach( function(row){
                                if(row.submodule == "Introduction"){
                                   toolboxLog["Introduction"] += 1;      
                                }else if(row.submodule == "Mood Support"){
                                    toolboxLog["MoodSupport"] += 1; 
                                }else if(row.submodule == "Social Boost"){
                                    toolboxLog["SocialBoost"] += 1; 
                                }else if(row.submodule == "Thought Challenges"){
                                    toolboxLog["ThoughtChallenges"] += 1; 
                                }else if(row.submodule == "Relax"){
                                    toolboxLog["Relax"] += 1; 
                                }
                            });           
                            var toolboxFeedbaack = "Introduction = " + toolboxLog["Introduction"];
                            toolboxFeedbaack += ", Mood Support = " + toolboxLog["MoodSupport"];
                            toolboxFeedbaack += ", Social boost = " + toolboxLog["SocialBoost"];
                            toolboxFeedbaack += ", Thought Challenges = " + toolboxLog["ThoughtChallenges"];
                            toolboxFeedbaack += ", Relax = " + toolboxLog["Relax"];
                            var user_toolbox_record = {};
                            user_toolbox_record.username = trows[0].username;
                            user_toolbox_record.first_name = trows[0].first_name;
                            user_toolbox_record.last_name = trows[0].last_name;
                            user_toolbox_record.created_at = '';
                            user_toolbox_record.responded_at = '';
                            user_toolbox_record.intervention_module = 'Toolbox';
                            user_toolbox_record.answer_identifier = '';
                            user_toolbox_record.contact_type = '';
                            user_toolbox_record.feedback_type = toolboxFeedbaack;
                            result.toolbox_records.push(user_toolbox_record);  
                        }
                        resolve(result);
                    }        
                });
            });       
        }

        function createCSV(result){
            return Q.Promise(function(resolve, reject) {    
                try{
                    if(result.records.length > 0){
                        _.each(result.records, function(row){
                            if( row.submodule == 'Medication:assessment1' || 
                                row.submodule == 'Voices:assessment1' || 
                                row.submodule == 'Mood:assessment1' || 
                                row.submodule == 'Social:assessment1' || 
                                row.submodule == 'Sleep:assessment1'
                            ){
                                
                                var record = {
                                    username : '',
                                    first_name : '',
                                    last_name : '',
                                    created_at : '',
                                    responded_at : '',
                                    intervention_module : '',
                                    answer_identifier : '',
                                    contact_type : '',
                                    feedback_type : '',
                                    module_assigned : ''    
                                }

                                // Populate Record
                                
                        
                                record.username = row.username;
                                record.first_name = row.first_name;
                                record.last_name = row.last_name;
                                
                                if(row.is_prompt){
                                    record.contact_type = 'Prompt';  
                                    record.created_at = dateFormat(new Date(row.prompt_created_at), "yyyy-mm-dd HH:MM:ss"); 
                                    record.responded_at = dateFormat(new Date(row.created_at), "yyyy-mm-dd HH:MM:ss");
                                }else{
                                   record.contact_type = 'On Demand'; 
                                   record.created_at = dateFormat(new Date(row.created_at), "yyyy-mm-dd HH:MM:ss");
                                   record.responded_at = dateFormat(new Date(row.created_at), "yyyy-mm-dd HH:MM:ss");
                                }
                                
                                if(row.submodule == 'Medication:assessment1'){  
                                    record.intervention_module = 'Medication';
                                }else if(row.submodule == 'Voices:assessment1'){   
                                    record.intervention_module = 'Voices'; 
                                }else if(row.submodule == 'Mood:assessment1'){
                                    record.intervention_module = 'Mood';
                                }else if(row.submodule == 'Social:assessment1'){
                                    record.intervention_module = 'Social';
                                }else if(row.submodule == 'Sleep:assessment1'){
                                    record.intervention_module = 'Sleep';
                                }

                                if( record.intervention_module ==  row.window1 || 
                                    record.intervention_module ==  row.window2 || 
                                    record.intervention_module ==  row.window3
                                ){
                                    record.module_assigned = '1';
                                }else{
                                    record.module_assigned = '0';
                                }

                                record.answer_identifier = row.response.replace('response', '');

                                resultcsv.push(record); 
                            }
                            else if(resultcsv.length > 0){
                                var last_record = resultcsv.pop();
                                if(row.action == 'Clicked Video'){
                                    if(last_record.feedback_type){
                                        last_record.feedback_type = 'Video';   
                                    }
                                    resultcsv.push(last_record); 
                                }else if(row.action == 'Clicked Words Only'){
                                    if(last_record.feedback_type){
                                        last_record.feedback_type = 'Text';   
                                    }
                                    resultcsv.push(last_record);
                                }
                            }        
                        });
                    }
                    if(result.missed_prompts.length > 0){
                        for( i in result.missed_prompts){
                            resultcsv.push(result.missed_prompts[i]);
                        }
                    }
                    if(resultcsv.length > 1){  
                        resultcsv.sort(function (a, b) {
                            return new Date(a.created_at) - new Date(b.created_at);    
                        });

                        if(result.toolbox_records.length >0){
                            resultcsv.push(result.toolbox_records[0]);    
                        }
                        if(resultcsv_head){
                            resultcsv.unshift(resultcsv_head);     
                        }
                    }else{
                       resultcsv.push({"No Data Available":""}); 
                    }
                    resolve(resultcsv);    
                }catch(e){
                    reject(e);
                }   
            });
        }

        function array_merge_sort(arr1, arr2){
                for( i in arr2){
                    arr1.push(arr2[i]);
                }

                arr1.sort(function(a, b){
                    return a.id - b.id;   
                });
        }

        checkUserParams()
        .then(function(userId){
            return checkUser(userId);
        })
        .then(function(user){
            return getTimezone(user);
        })
        .then(function(result){
            return getOnDemandRows(result);
        })
        .then(function(result){
            return getPromptRows(result);
        })
        .then(function(result){
            return getPromptMissRows(result);
        })
        .then(function(result){
            return getToolboxLog(result);
        })
        .then(function(result){
            return createCSV(result);
        })
        .then(function(resultCSV){
            res.csv(resultcsv);
            //res.send(resultcsv);
        })
        .catch(function(err){
            console.log(err);
            req.session.error="Sorry! Unable to generate CSV. Please try again.";
            res.redirect('/admin/users');
        })
        



        /*if(typeof userId!=='undefined') {

            getTimezone(req, res, next);

            function getTimezone(req, res, next){
                var tzQuery = "SELECT timezone FROM common_settings";
                userModel.query(tzQuery, function(err, rows) {
                    if(rows){
                        user_tz = rows[0].timezone; 
                    }
                    getOnDemandRows();
                }); 
            }

            
            function getOnDemandRows(){

                var qd =  "SELECT e.id, e.user_id, e.module, e.submodule, e.action, e.prompt_id, e.response, convert_tz(e.created_at, '+00:00', '"+user_tz+"') as created_at, u.username, u.first_name, u.last_name, u.window1, u.window2,u.window3 from events_log as e left join users as u on u.id = e.user_id WHERE e.user_id = '"+ userId +"' and e.module = 'Slides' and e.is_prompt = '0'";

                userModel.query(qd,function(err, rows) {
                    if(rows.length > 0) {
                        user_records = rows;
                    } 
                    getPromptRows();     
                });

            };

            function getPromptRows(){

                var qd = "SELECT e.id, e.user_id, e.module, e.submodule, e.action, e.prompt_id, e.response, convert_tz(e.created_at, '+00:00', '"+user_tz+"') as created_at, u.username, u.first_name, u.last_name, u.window1, u.window2,u.window3, convert_tz(p.created_at, '+00:00', '"+user_tz+"') as prompt_created_at FROM events_log as e inner join prompts as p on e.prompt_id = p.id left join users as u on e.user_id = u.id WHERE e.user_id = '"+ userId +"' and e.module = 'Slides' and is_prompt = '1'";

                userModel.query(qd,function(err, rows) {
                    if(rows.length > 0) {
                        array_merge_sort(user_records, rows);
                    } 
                    getPromptMissRows();     
                });

            };

            function getPromptMissRows(){

                var qd1 = "SELECT  p.id, p.user_id, p.contact_type,p.intervention, p.event, p.response, p.responded, convert_tz(p.received_at, '+00:00', '"+user_tz+"') as received_at, convert_tz(p.created_at, '+00:00', '"+user_tz+"') as created_at, u.username, u.first_name, u.last_name, u.window1, u.window2,u.window3 from prompts as p  left join users as u on p.user_id = u.id WHERE p.user_id = '"+ userId +"' and p.response = '0'";


                userModel.query(qd1,function(err, mrows) {
                    if(mrows.length > 0) {
                        mrows.forEach(function(mrow){
                            
                            var obj = {
                                username : mrow.username,
                                first_name : mrow.first_name,
                                last_name : mrow.last_name,
                                created_at : dateFormat(new Date(mrow.created_at), "yyyy-mm-dd HH:MM:ss"),
                                responded_at : (mrow.received_at == null) ? mrow.received_at : dateFormat(new Date(mrow.received_at), "yyyy-mm-dd HH:MM:ss"),
                                intervention_module : mrow.intervention,
                                answer_identifier : '',
                                contact_type : 'Prompt',
                                feedback_type : mrow.responded
                            }
                            if( obj.intervention_module ==  mrow.window1 || obj.intervention_module ==  mrow.window2 || obj.intervention_module ==  mrow.window3){
                            	obj.module_assigned = '1';
                            }else{
                            	obj.module_assigned = '0';
                            }
                            user_missed_prompt.push(obj);

                        });
                    } 
                    getToolboxLog();     
                });

            };

            function getToolboxLog(){
                var toolboxLog = {
                    "count" : 0,
                    "Introduction" : 0,
                    "MoodSupport" : 0,
                    "SocialBoost" : 0, 
                    "ThoughtChallenges" : 0,
                    "Relax" : 0
                };

                var qd =  "SELECT * from events_log left join users on users.id = events_log.user_id WHERE user_id = '"+ userId +"' and module ='Toolbox' and submodule != '' and action = 'clicked'";

                //var qd = "SELECT * FROM events_log WHERE user_id='"+getId+"' AND module ='Toolbox' and submodule != '' and action = 'clicked'";
                
                userModel.query(qd,function(err, trows) {
                    if(trows.length > 0) {
                        toolboxLog["count"] = trows.length; 
                        trows.forEach( function(row){
                            if(row.submodule == "Introduction"){
                               toolboxLog["Introduction"] += 1;      
                            }else if(row.submodule == "Mood Support"){
                                toolboxLog["MoodSupport"] += 1; 
                            }else if(row.submodule == "Social Boost"){
                                toolboxLog["SocialBoost"] += 1; 
                            }else if(row.submodule == "Thought Challenges"){
                                toolboxLog["ThoughtChallenges"] += 1; 
                            }else if(row.submodule == "Relax"){
                                toolboxLog["Relax"] += 1; 
                            }
                        });           
                        
                        var toolboxFeedbaack = "Introduction = " + toolboxLog["Introduction"];
                        toolboxFeedbaack += ", Mood Support = " + toolboxLog["MoodSupport"];
                        toolboxFeedbaack += ", Social boost = " + toolboxLog["SocialBoost"];
                        toolboxFeedbaack += ", Thought Challenges = " + toolboxLog["ThoughtChallenges"];
                        toolboxFeedbaack += ", Relax = " + toolboxLog["Relax"];

                        user_toolbox_record.username = trows[0].username;
                        user_toolbox_record.first_name = trows[0].first_name;
                        user_toolbox_record.last_name = trows[0].last_name;
                        user_toolbox_record.created_at = '';
                        user_toolbox_record.responded_at = '';
                        user_toolbox_record.intervention_module = 'Toolbox';
                        user_toolbox_record.answer_identifier = '';
                        user_toolbox_record.contact_type = '';
                        user_toolbox_record.feedback_type = toolboxFeedbaack;
                          
                        createCSV();     
                    }    
                });   
            }

            function createCSV(){
                if(user_records.length > 0){
                    user_records.forEach(function(row){
                        if( row.submodule == 'Medication:assessment1' || row.submodule == 'Voices:assessment1' || row.submodule == 'Mood:assessment1' || row.submodule == 'Social:assessment1' || row.submodule == 'Sleep:assessment1'){
                            
                            // var record = {
                            //     participant_id : '',
                            //     created_at : '',
                            //     responded_at : '',
                            //     intervention_module : '',
                            //     answer_identifier : '',
                            //     contact_type : '',
                            //     feedback_type : ''
                            // }

                            var record = {
                                username : '',
                                first_name : '',
                                last_name : '',
                                created_at : '',
                                responded_at : '',
                                intervention_module : '',
                                answer_identifier : '',
                                contact_type : '',
                                feedback_type : '',
                                module_assigned : ''	
                            }

                            // Populate Record
                            
                            //record.participant_id = row.user_id;

                            record.username = row.username;
                            record.first_name = row.first_name;
                            record.last_name = row.last_name;
                            
                            if(row.is_prompt){
                                record.contact_type = 'Prompt';  
                                record.created_at = dateFormat(new Date(row.prompt_created_at), "yyyy-mm-dd HH:MM:ss"); 
                                record.responded_at = dateFormat(new Date(row.created_at), "yyyy-mm-dd HH:MM:ss");
                            }else{
                               record.contact_type = 'On Demand'; 
                               record.created_at = dateFormat(new Date(row.created_at), "yyyy-mm-dd HH:MM:ss");
                               record.responded_at = dateFormat(new Date(row.created_at), "yyyy-mm-dd HH:MM:ss");
                            }
                            
                            if(row.submodule == 'Medication:assessment1'){  
                                record.intervention_module = 'Medication';
                            }else if(row.submodule == 'Voices:assessment1'){   
                                record.intervention_module = 'Voices'; 
                            }else if(row.submodule == 'Mood:assessment1'){
                                record.intervention_module = 'Mood';
                            }else if(row.submodule == 'Social:assessment1'){
                                record.intervention_module = 'Social';
                            }else if(row.submodule == 'Sleep:assessment1'){
                                record.intervention_module = 'Sleep';
                            }

                            if( record.intervention_module ==  row.window1 || record.intervention_module ==  row.window2 || record.intervention_module ==  row.window3){
                            	record.module_assigned = '1';
                            }else{
                            	record.module_assigned = '0';
                            }

                            record.answer_identifier = row.response.replace('response', '');

                            resultcsv.push(record); 
                        }
                        else if(row.action == 'Clicked Video'){
                            var last_record = resultcsv.pop();
                            last_record.feedback_type = 'Video';
                            resultcsv.push(last_record); 
                        }else if(row.action == 'Clicked Words Only'){
                            var last_record = resultcsv.pop();
                            last_record.feedback_type = 'Text';
                            resultcsv.push(last_record);
                        }    
                    });
                    
                }



                for( i in user_missed_prompt){
                    resultcsv.push(user_missed_prompt[i]);
                }
                
                    
                    
                if(resultcsv.length > 1){  
                    resultcsv.sort(function (a, b) {
                        return new Date(a.created_at) - new Date(b.created_at);    
                    });

                    resultcsv.push(user_toolbox_record);

                    resultcsv.unshift(resultcsv_head);    

                    //res.csv(resultcsv);

                    res.send(resultcsv);
                }else{
                    res.redirect('/admin/users');
                }    
            };
    

            function array_merge_sort(arr1, arr2){
                for( i in arr2){
                    arr1.push(arr2[i]);
                }

                arr1.sort(function(a, b){
                    return a.id - b.id;   
                });
            }   

        }
        else {
            res.redirect('/admin/users');
        }*/ 
        function array_merge_sort(arr1, arr2){
                for( i in arr2){
                    arr1.push(arr2[i]);
                }

                arr1.sort(function(a, b){
                    return a.id - b.id;   
                });
            }
    },
    
    exports_users_log: function(req, res, next){  
        
        function getEvents(user_id, cb){
            var temp = [];
            var query = "SELECT * FROM ( SELECT  user_id, contact_type, intervention, null as module, null as submodule, response as action, created_at FROM prompts WHERE user_id = "+user_id+" UNION SELECT  user_id,  is_prompt as contact_type,  null as intervention, module, submodule, action, created_at FROM events_log WHERE user_id = "+user_id+") as t left join users on user_id = id order by created_at"; 

             userModel.query(query, function(err, rows) {
                if(rows.length > 0){
	                rows.forEach(function(row, index){
	                    if(row.contact_type == 'prompt')
	                    { 
	                        var _temp = {
	                            username : row.username,
	                            first_name : row.first_name,
	                            last_name : row.last_name,
	                            send_at : dateFormat(new Date(row.created_at), "dd/mm/yyyy HH:MM:ss"),
	                            received_at : '',
	                            intervention_module : row.intervention,
	                            answer_identifier:'',
	                            contact_type : row.contact_type,
	                            feedback_type : '',
	                            answer_identifier:''
	                        };

	                        if( row.intervention ==  row.window1 || 
	                            row.intervention ==  row.window2 || 
	                            row.intervention ==  row.window3
	                        ){
	                            _temp.module_assigned = '1';
	                        }else{
	                            _temp.module_assigned = '0';
	                        }

	                        temp.push(_temp);

	                    }else {
	                        var tempLength = temp.length;
	                        var module = row.submodule.split(":")[0].trim();

	                        if(
	                            module == 'Voices' ||
	                            module == 'Mood' ||
	                            module == 'Social' ||
	                            module == 'Medication' ||
	                            module == 'Sleep')
	                        {
	                            if(row.contact_type == '1'){
	                                if( 
	                                    tempLength > 0 && 
	                                    temp[tempLength -1].intervention_module == module && 
	                                    temp[tempLength -1].contact_type == 'prompt')
	                                {  
	                                    if(module == 'Voices'){
	                                        if(row.action.indexOf('Not at all') >= 0){
	                                            temp[tempLength -1].answer_identifier = 1;  
	                                        }else if(row.action.indexOf('A little') >= 0){
	                                            temp[tempLength -1].answer_identifier = 2;  
	                                        }else if(row.action.indexOf('Moderately') >= 0){
	                                            temp[tempLength -1].answer_identifier = 3;
	                                        }else if(row.action.indexOf('Extremely') >= 0){
	                                            temp[tempLength -1].answer_identifier = 4;
	                                        }
	                                    }

	                                    else if(module == 'Mood'){
	                                        if(row.action.indexOf('Very good') >= 0){
	                                            temp[tempLength -1].answer_identifier = 1;  
	                                        }else if(row.action.indexOf('Some ups') >= 0){
	                                            temp[tempLength -1].answer_identifier = 2;  
	                                        }else if(row.action.indexOf('Not good') >= 0){
	                                            temp[tempLength -1].answer_identifier = 3;
	                                        }else if(row.action.indexOf('Very bad') >= 0){
	                                            temp[tempLength -1].answer_identifier = 4;
	                                        }
	                                    }

	                                    else if(module == 'Social'){

	                                        if(row.action.indexOf('mostly positive') >= 0){
	                                            temp[tempLength -1].answer_identifier = 1;  
	                                        }else if(row.action.indexOf('mostly negative') >= 0){
	                                            temp[tempLength -1].answer_identifier = 2;  
	                                        }else if(row.action.indexOf('A little') >= 0){
	                                            temp[tempLength -1].answer_identifier = 3;
	                                        }else if(row.action.indexOf('No') >= 0){
	                                            temp[tempLength -1].answer_identifier = 4;
	                                        }
	                                    }

	                                    else if(module == 'Medication'){

	                                        if(row.action.indexOf('took all') >= 0){
	                                            temp[tempLength -1].answer_identifier = 1;  
	                                        }else if(row.action.indexOf('took some') >= 0){
	                                            temp[tempLength -1].answer_identifier = 2;  
	                                        }else if(row.action.indexOf('not take') >= 0){
	                                            temp[tempLength -1].answer_identifier = 3;
	                                        }else if(row.action.indexOf('remember') >= 0){
	                                            temp[tempLength -1].answer_identifier = 4;
	                                        }
	                                    }

	                                    else if(module == 'Sleep'){

	                                        if(row.action.indexOf('rested') >= 0){
	                                            temp[tempLength -1].answer_identifier = 1;  
	                                        }else if(row.action.indexOf('feel tired') >= 0){
	                                            temp[tempLength -1].answer_identifier = 2;  
	                                        }else if(row.action.indexOf('very tired') >= 0){
	                                            temp[tempLength -1].answer_identifier = 3;
	                                        }else if(row.action.indexOf('last night') >= 0){
	                                            temp[tempLength -1].answer_identifier = 4;
	                                        }
	                                    }


	                                    if(row.action == 'Clicked Video'){
	                                        temp[tempLength -1].feedback_type = 'Clicked Video';
	                                    }else if(row.action == 'Clicked Words Only'){
	                                        temp[tempLength -1].feedback_type = 'Clicked Text';
	                                    }

	                                    if( module ==  row.window1 || 
	                                        module ==  row.window2 || 
	                                        module ==  row.window3
	                                    ){
	                                        temp[tempLength -1].module_assigned = '1';
	                                    }else{
	                                        temp[tempLength -1].module_assigned = '0';
	                                    }

	                                    temp[tempLength -1].received_at = dateFormat(new Date(row.created_at), "dd/mm/yyyy HH:MM:ss")
	                                }
	                            }
	                            else{
	                                var tempLength = temp.length;
	                                var module = row.submodule.split(":")[0].trim();
	                                if( 
	                                    tempLength > 0 && 
	                                    temp[tempLength -1].intervention_module == module && 
	                                    temp[tempLength -1].contact_type == 'on demand')
	                                {
	                                    if(module == 'Voices'){
	                                        if(row.action.indexOf('Not at all') >= 0){
	                                            temp[tempLength -1].answer_identifier = 1;  
	                                        }else if(row.action.indexOf('A little') >= 0){
	                                            temp[tempLength -1].answer_identifier = 2;  
	                                        }else if(row.action.indexOf('Moderately') >= 0){
	                                            temp[tempLength -1].answer_identifier = 3;
	                                        }else if(row.action.indexOf('Extremely') >= 0){
	                                            temp[tempLength -1].answer_identifier = 4;
	                                        }
	                                    }

	                                    else if(module == 'Mood'){
	                                        if(row.action.indexOf('Very good') >= 0){
	                                            temp[tempLength -1].answer_identifier = 1;  
	                                        }else if(row.action.indexOf('Some ups') >= 0){
	                                            temp[tempLength -1].answer_identifier = 2;  
	                                        }else if(row.action.indexOf('Not good') >= 0){
	                                            temp[tempLength -1].answer_identifier = 3;
	                                        }else if(row.action.indexOf('Very bad') >= 0){
	                                            temp[tempLength -1].answer_identifier = 4;
	                                        }
	                                    }

	                                    else if(module == 'Social'){

	                                        if(row.action.indexOf('mostly positive') >= 0){
	                                            temp[tempLength -1].answer_identifier = 1;  
	                                        }else if(row.action.indexOf('mostly negative') >= 0){
	                                            temp[tempLength -1].answer_identifier = 2;  
	                                        }else if(row.action.indexOf('A little') >= 0){
	                                            temp[tempLength -1].answer_identifier = 3;
	                                        }else if(row.action.indexOf('No') >= 0){
	                                            temp[tempLength -1].answer_identifier = 4;
	                                        }
	                                    }

	                                    else if(module == 'Medication'){

	                                        if(row.action.indexOf('took all') >= 0){
	                                            temp[tempLength -1].answer_identifier = 1;  
	                                        }else if(row.action.indexOf('took some') >= 0){
	                                            temp[tempLength -1].answer_identifier = 2;  
	                                        }else if(row.action.indexOf('not take') >= 0){
	                                            temp[tempLength -1].answer_identifier = 3;
	                                        }else if(row.action.indexOf('remember') >= 0){
	                                            temp[tempLength -1].answer_identifier = 4;
	                                        }
	                                    }     

	                                    else if(module == 'Sleep'){

	                                        if(row.action.indexOf('rested') >= 0){
	                                            temp[tempLength -1].answer_identifier = 1;  
	                                        }else if(row.action.indexOf('feel tired') >= 0){
	                                            temp[tempLength -1].answer_identifier = 2;  
	                                        }else if(row.action.indexOf('very tired') >= 0){
	                                            temp[tempLength -1].answer_identifier = 3;
	                                        }else if(row.action.indexOf('last night') >= 0){
	                                            temp[tempLength -1].answer_identifier = 4;
	                                        }
	                                    }


	                                    if(row.action == 'Clicked Video'){
	                                        temp[tempLength -1].feedback_type = 'Clicked Video';
	                                    }else if(row.action == 'Clicked Words Only'){
	                                        temp[tempLength -1].feedback_type = 'Clicked Text';
	                                    }

	                                    if( module ==  row.window1 || 
	                                        module ==  row.window2 || 
	                                        module ==  row.window3
	                                    ){
	                                        temp[tempLength -1].module_assigned = '1';
	                                    }else{
	                                        temp[tempLength -1].module_assigned = '0';
	                                    }

	                                }else{
	                                    var _temp = {
	                                        username : row.username,
	                                        first_name : row.first_name,
	                                        last_name : row.last_name,
	                                        send_at : dateFormat(new Date(row.created_at), "dd/mm/yyyy HH:MM:ss"),
	                                        received_at : dateFormat(new Date(row.created_at), "dd/mm/yyyy HH:MM:ss"),
	                                        intervention_module : module,
	                                        answer_identifier:'',
	                                        contact_type : 'on demand',
	                                        feedback_type : '',
	                                        answer_identifier:''
	                                    };

	                                    if( row.intervention ==  row.window1 || 
	                                        row.intervention ==  row.window2 || 
	                                        row.intervention ==  row.window3
	                                    ){
	                                        _temp.module_assigned = '1';
	                                    }else{
	                                        _temp.module_assigned = '0';
	                                    }

	                                    temp.push(_temp);  
	                                }
	                            }

	                        }
	                    }
	                });
					cb(temp);
				}else{
					cb(null);
				}				
            }); 
		}

        function getToolboxEvents(user_id, cb){
            var toolboxLog = {
                "count" : 0,
                "Introduction" : 0,
                "MoodSupport" : 0,
                "SocialBoost" : 0, 
                "ThoughtChallenges" : 0,
                "Relax" : 0
            };
            var qd = "SELECT * from events_log left join users on users.id = events_log.user_id WHERE user_id = '"+ user_id +"' and module ='Toolbox' and submodule != '' and action = 'clicked'";
               
            userModel.query(qd,function(err, trows) {
                var user_toolbox_record = {};
                if(trows.length > 0) {
                    toolboxLog["count"] = trows.length; 
                    trows.forEach( function(row){
                        if(row.submodule == "Introduction"){
                           toolboxLog["Introduction"] += 1;      
                        }else if(row.submodule == "Mood Support"){
                            toolboxLog["MoodSupport"] += 1; 
                        }else if(row.submodule == "Social Boost"){
                            toolboxLog["SocialBoost"] += 1; 
                        }else if(row.submodule == "Thought Challenges"){
                            toolboxLog["ThoughtChallenges"] += 1; 
                        }else if(row.submodule == "Relax"){
                            toolboxLog["Relax"] += 1; 
                        }
                    });           
                    
                    var toolboxFeedbaack = "Introduction = " + toolboxLog["Introduction"];
                    toolboxFeedbaack += ", Mood Support = " + toolboxLog["MoodSupport"];
                    toolboxFeedbaack += ", Social boost = " + toolboxLog["SocialBoost"];
                    toolboxFeedbaack += ", Thought Challenges = " + toolboxLog["ThoughtChallenges"];
                    toolboxFeedbaack += ", Relax = " + toolboxLog["Relax"];
                    
                    user_toolbox_record.username = trows[0].username;
                    user_toolbox_record.first_name = trows[0].first_name;
                    user_toolbox_record.last_name = trows[0].last_name;
                    user_toolbox_record.created_at = '';
                    user_toolbox_record.responded_at = '';
                    user_toolbox_record.intervention_module = 'Toolbox';
                    user_toolbox_record.answer_identifier = '';
                    user_toolbox_record.contact_type = "on demand";
                    user_toolbox_record.feedback_type = toolboxFeedbaack;
                 
                 	cb(user_toolbox_record);    
                }else{
                	cb(null);
                }
                        
            });
        }

        var query = "SELECT * FROM users where id not in (4,1,13,15,53,54,55,56,59,65,66,83)"; 
        userModel.query(query, function(err, rows) {
            
            var results = [];
            
            results.push({
                username : "Username",
                first_name : "First Name",
                last_name : "Last Name",
                send_at : "Created At",
                received_at : "Responded At",
                intervention_module : "Intervention Module",
                answer_identifier : "Answer Identifier",
                contact_type : "Contact Type",
                feedback_type : "Feedback Type",
                module_assigned : "Module_assigned"
            });

            rows.forEach(function(row, index) {
                let i = index+1;
                getEvents(row.id, function(temp) {
                    if(temp && temp.length > 0){
                    	temp.forEach(function(obj){
	                    	if(obj){
	                    		if(obj.intervention_module == 'on demand' && obj.answer_identifier == '' && obj.feedback_type == '')
		                        {
		                            //do Nothing
		                        }
		                        else{
		                            results.push(obj);   
		                        }	
	                    	}	                        
	                    })	
                    }
                    
                    getToolboxEvents(row.id,function(temp){
                        if(temp){
							results.push(temp);	
                        }
                        if(i == rows.length){
                        	res.csv(results)
                        }
                    });
				});    
            });
        });    


         
    
        
    


        
      //   var defaultTimeZone = "+00:00";
      //   //var userId = req.params.id; 
      //   resultcsv_head = {
      //       username : 'Username',
      //       first_name : 'First Name',
      //       last_name : 'Last Name',
      //       created_at : 'Created At',
      //       responded_at : 'Responded At',
      //       intervention_module : 'Intervention Module',
      //       answer_identifier : 'Answer Identifier',
      //       contact_type : 'Contact Type',
      //       feedback_type : 'Feedback Type',
      //       module_assigned : 'Module Assigned'
      //   }; 
      //   var resultcsv = [];

      //   var resultRows = [];


      //   function getTimezone(user){
      //       return Q.Promise(function(resolve, reject) {
      //           var tzQuery = "SELECT timezone FROM common_settings";
      //           userModel.query(tzQuery, function(err, rows) {
      //               if(err){
      //                   reject("Timezone error"); 
      //               }
      //               else if(rows && rows.length > 0){
      //                   resolve({
      //                       tz : rows[0].timezone, 
      //                       user : user
      //                   });
      //               }
      //               else{
      //                   resolve({
      //                       tz : defaultTimeZone, 
      //                       user:username
      //                   });
      //               }
      //           });
      //       });     
      //   }

      //   function getOnDemandRows(result){
      //       return Q.Promise(function(resolve, reject) {
      //           var sQuery = "SELECT e.id, e.user_id, e.module, e.submodule, e.action, e.prompt_id, e.is_prompt, e.response, convert_tz(e.created_at, '+00:00', '"+result.tz+"') as created_at, u.username, u.first_name, u.last_name, u.window1, u.window2,u.window3 from events_log as e left join users as u on u.id = e.user_id WHERE e.user_id = '"+ result.user +"' and e.module = 'Slides' and e.is_prompt = '0'";
      //           userModel.query(sQuery,function(err, rows) {
      //               if(err){
      //                   reject("getOnDemandRows"); 
      //               }
      //               else{
      //                   result.records = rows;
      //                   resolve(result); 
      //               }
                    
      //           });
                
      //       });    
      //   }

      //   function getPromptRows(result){
      //       return Q.Promise(function(resolve, reject) {
      //           var qd = "SELECT e.id, e.user_id, e.module, e.submodule, e.action, e.prompt_id, e.is_prompt, e.response, convert_tz(e.created_at, '+00:00', '"+result.tz+"') as created_at, u.username, u.first_name, u.last_name, u.window1, u.window2,u.window3, convert_tz(p.created_at, '+00:00', '"+result.tz+"') as prompt_created_at FROM events_log as e inner join prompts as p on e.prompt_id = p.id left join users as u on e.user_id = u.id WHERE e.user_id = '"+ result.user +"' and e.module = 'Slides' and e.is_prompt = '1'";

      //           console.log(qd);

      //           userModel.query(qd,function(err, rows) {
      //               if(err){
      //                   reject("getPromptRows");
      //               }
      //               else{
      //                   if(rows.length > 0) {
      //                       array_merge_sort(result.records, rows);
      //                   }
      //                   resolve(result);    
      //               } 
      //           });
      //       });    
      //   }

      //   function getPromptMissRows(result){
      //       return Q.Promise(function(resolve, reject) {
      //           var qd1 = "SELECT  p.id, p.user_id, p.contact_type,p.intervention, p.event, p.response, p.responded, convert_tz(p.received_at, '+00:00', '"+result.tz+"') as received_at, convert_tz(p.sending_at, '+00:00', '"+result.tz+"') as created_at, u.username, u.first_name, u.last_name, u.window1, u.window2,u.window3 from prompts as p  left join users as u on p.user_id = u.id WHERE p.user_id = '"+ result.user +"' and p.response = '0'";
                
                

      //           userModel.query(qd1,function(err, mrows) {
      //               if(err){
      //                   reject("getPromptMissRows");
      //               }   
      //               else{
      //                   result.missed_prompts = []; 
      //                   if(mrows.length > 0) {
      //                       mrows.forEach(function(mrow){
      //                           var obj = {
      //                               username : mrow.username,
      //                               first_name : mrow.first_name,
      //                               last_name : mrow.last_name,
      //                               created_at : dateFormat(new Date(mrow.created_at), "yyyy-mm-dd HH:MM:ss"),
      //                               responded_at : (mrow.received_at == null) ? mrow.received_at : dateFormat(new Date(mrow.received_at), "yyyy-mm-dd HH:MM:ss"),
      //                               intervention_module : mrow.intervention,
      //                               answer_identifier : '',
      //                               contact_type : 'Prompt',
      //                               feedback_type : mrow.responded
      //                           }
      //                           if( obj.intervention_module ==  mrow.window1 || obj.intervention_module ==  mrow.window2 || obj.intervention_module ==  mrow.window3){
      //                               obj.module_assigned = '1';
      //                           }else{
      //                               obj.module_assigned = '0';
      //                           }
      //                           result.missed_prompts.push(obj);
      //                       });
      //                   }
      //                   resolve(result);
      //               } 
                    
      //           });
      //       });
      //   }
        
      //   function getToolboxLog(result){
      //       return Q.Promise(function(resolve, reject) {
      //           var toolboxLog = {
      //               "count" : 0,
      //               "Introduction" : 0,
      //               "MoodSupport" : 0,
      //               "SocialBoost" : 0, 
      //               "ThoughtChallenges" : 0,
      //               "Relax" : 0
      //           };

      //           var qd = "SELECT * from events_log left join users on users.id = events_log.user_id WHERE user_id = '"+ result.user +"' and module ='Toolbox' and submodule != '' and action = 'clicked'";

      //           //var qd = "SELECT * FROM events_log WHERE user_id='"+getId+"' AND module ='Toolbox' and submodule != '' and action = 'clicked'";
                
      //           userModel.query(qd,function(err, trows) {
      //               if(err){
      //                   reject("getToolboxLog");   
      //               }else{
                        
      //                   if(trows.length > 0) {
      //                       toolboxLog["count"] = trows.length; 
      //                       trows.forEach( function(row){
      //                           if(row.submodule == "Introduction"){
      //                              toolboxLog["Introduction"] += 1;      
      //                           }else if(row.submodule == "Mood Support"){
      //                               toolboxLog["MoodSupport"] += 1; 
      //                           }else if(row.submodule == "Social Boost"){
      //                               toolboxLog["SocialBoost"] += 1; 
      //                           }else if(row.submodule == "Thought Challenges"){
      //                               toolboxLog["ThoughtChallenges"] += 1; 
      //                           }else if(row.submodule == "Relax"){
      //                               toolboxLog["Relax"] += 1; 
      //                           }
      //                       });           
      //                       var toolboxFeedbaack = "Introduction = " + toolboxLog["Introduction"];
      //                       toolboxFeedbaack += ", Mood Support = " + toolboxLog["MoodSupport"];
      //                       toolboxFeedbaack += ", Social boost = " + toolboxLog["SocialBoost"];
      //                       toolboxFeedbaack += ", Thought Challenges = " + toolboxLog["ThoughtChallenges"];
      //                       toolboxFeedbaack += ", Relax = " + toolboxLog["Relax"];
      //                       var user_toolbox_record = {};
      //                       user_toolbox_record.username = trows[0].username;
      //                       user_toolbox_record.first_name = trows[0].first_name;
      //                       user_toolbox_record.last_name = trows[0].last_name;
      //                       user_toolbox_record.created_at = '';
      //                       user_toolbox_record.responded_at = '';
      //                       user_toolbox_record.intervention_module = 'Toolbox';
      //                       user_toolbox_record.answer_identifier = '';
      //                       user_toolbox_record.contact_type = '';
      //                       user_toolbox_record.feedback_type = toolboxFeedbaack;
      //                       result.records.push(user_toolbox_record);  
      //                   }
      //                   resolve(result);
      //               }        
      //           });
      //       });       
      //   }

      //   function prepareData(result){
      //       return Q.Promise(function(resolve, reject) {    
      //           try{
      //       		var _results = [];	
      //               if(result.records.length > 0){
      //                   _.each(result.records, function(row){
      //                       if( row.submodule == 'Medication:assessment1' || 
      //                           row.submodule == 'Voices:assessment1' || 
      //                           row.submodule == 'Mood:assessment1' || 
      //                           row.submodule == 'Social:assessment1' || 
      //                           row.submodule == 'Sleep:assessment1'
      //                       ){
                                
      //                           var record = {
      //                               username : '',
      //                               first_name : '',
      //                               last_name : '',
      //                               created_at : '',
      //                               responded_at : '',
      //                               intervention_module : '',
      //                               answer_identifier : '',
      //                               contact_type : '',
      //                               feedback_type : '',
      //                               module_assigned : ''    
      //                           }

      //                           // Populate Record
                                
                        
      //                           record.username = row.username;
      //                           record.first_name = row.first_name;
      //                           record.last_name = row.last_name;
                                
      //                           if(row.is_prompt == '1'){
      //                               record.contact_type = 'Prompt';  
      //                               record.created_at = dateFormat(new Date(row.prompt_created_at), "yyyy-mm-dd HH:MM:ss"); 
      //                               record.responded_at = dateFormat(new Date(row.created_at), "yyyy-mm-dd HH:MM:ss");
      //                           }else{
      //                              record.contact_type = 'On Demand'; 
      //                              record.created_at = dateFormat(new Date(row.created_at), "yyyy-mm-dd HH:MM:ss");
      //                              record.responded_at = dateFormat(new Date(row.created_at), "yyyy-mm-dd HH:MM:ss");
      //                           }
                                
      //                           if(row.submodule == 'Medication:assessment1'){  
      //                               record.intervention_module = 'Medication';
      //                           }else if(row.submodule == 'Voices:assessment1'){   
      //                               record.intervention_module = 'Voices'; 
      //                           }else if(row.submodule == 'Mood:assessment1'){
      //                               record.intervention_module = 'Mood';
      //                           }else if(row.submodule == 'Social:assessment1'){
      //                               record.intervention_module = 'Social';
      //                           }else if(row.submodule == 'Sleep:assessment1'){
      //                               record.intervention_module = 'Sleep';
      //                           }

      //                           if( record.intervention_module ==  row.window1 || 
      //                               record.intervention_module ==  row.window2 || 
      //                               record.intervention_module ==  row.window3
      //                           ){
      //                               record.module_assigned = '1';
      //                           }else{
      //                               record.module_assigned = '0';
      //                           }

      //                           record.answer_identifier = row.response.replace('response', '');

      //                           _results.push(record); 
      //                       }
      //                       else if(resultcsv.length > 0){
      //                           var last_record = resultcsv.pop();
      //                           if(row.action == 'Clicked Video'){
      //                               if(last_record.feedback_type){
      //                                   last_record.feedback_type = 'Video';   
      //                               }
      //                           }else if(row.action == 'Clicked Words Only'){
      //                               if(last_record.feedback_type){
      //                                   last_record.feedback_type = 'Text';   
      //                               }
      //                           }
      //                           _results.push(last_record);  
      //                       }     
      //                   });
      //               }
      //               if(result.missed_prompts.length > 0){
      //                   for( i in result.missed_prompts){
      //                       _results.push(result.missed_prompts[i]);
      //                   }
      //               }
      //               _results.sort(function (a, b) {
      //                   return new Date(a.created_at) - new Date(b.created_at);    
      //               })

      //               result.records = _results;
      //               resolve(result);
      //           }catch(e){
      //               reject(e);
      //           }   
      //       });
      //   }

      //   function createCSV(){
      //       return Q.Promise(function(resolve, reject) {    
      //           try{
      //           	var resultcsv = [];
      //               if(results.length > 1){  
      //                   if(resultcsv_head){
      //                       resultcsv.push(resultcsv_head);     
      //                   }
      //                   _.each(results, function(result) {
      //                   	_.each(result, function(_result) {
	     //                    	resultcsv.push(_result);
	     //                    });
      //                   });
                        
      //               }else{
      //                  resultcsv.push({"No Data Available":""}); 
      //               }
      //               resolve(resultcsv);    
      //           }catch(e){
      //               reject(e.message);
      //           }   
      //       });
      //   }

      //   function array_merge_sort(arr1, arr2){
      //       for( i in arr2){
      //           arr1.push(arr2[i]);
      //       }

      //       arr1.sort(function(a, b){
      //           return a.id - b.id;   
      //       });
      //   }

      //   var qd = "SELECT id FROM users ORDER BY id DESC LIMIT 0, 100";
      //   userModel.query(qd, usersCallback);    
        
      //   var results = [];
      //   function usersCallback(err, rows){    
      //       var i=0;
      //       Q.loop(
      //           () => { return i < rows.length},
      //           () => { 
      //               return getTimezone(rows[i].id)
      //               .then(function(result){
      //                   return getOnDemandRows(result);
      //               })
      //               .then(function(result){
      //                   return getPromptRows(result);
      //               })
      //               .then(function(result){
      //                   return getPromptMissRows(result);
      //               })
      //               .then(function(result){
						// return prepareData(result);
      //               })
      //               .then(function(result){

						// return getToolboxLog(result);
      //               })
      //               .then(function(result){
      //               	//res.send(result.records);
      //                   results.push(result.records);
      //                   i++;
      //               })
      //       })
      //       .then(function(){
      //       	//res.send(results);		
      //           return createCSV();
      //           //res.send({results : results});
      //       })        
      //       .then(function(resultCSV){
      //           res.csv(resultCSV);
      //           //res.send(resultcsv);
      //       })
      //       .catch(function(err){
      //           // req.session.error="Sorry! Unable to generate CSV. Please try again.";
      //           // res.redirect('/admin/users');
      //           res.send({err:err});
      //       })
      //   }    
    },
    
    exports_view_log: function(req, res, next){  
        
       var userId = req.params.id; 
       var user_tz = "+00:00";

        var resultcsv = [{
            username : 'Username',
            first_name : 'First Name',
            last_name : 'Last Name',
            module : 'Module',
            submodule : 'Submodule',
            action : 'Action',
            created_at : 'Created At'
        }];

		if(typeof userId!=='undefined') {

        	getTimezone(req, res, next);

            function getTimezone(req, res, next){
                var tzQuery = "SELECT timezone FROM common_settings";
                userModel.query(tzQuery, function(err, rows) {
                    if(rows){
                        user_tz = rows[0].timezone; 
                    }
                    getViewLogRows(req, res, next);
                }); 
            }

            function getViewLogRows(req, res, next){

	            var qd =  "SELECT  u.username, u.first_name, u.last_name, e.module, e.submodule, e.action,convert_tz(e.created_at, '+00:00', '"+user_tz+"') as created_at from events_log as e left join users as u on u.id = e.user_id WHERE e.user_id = '"+ userId +"'";

                userModel.query(qd,function(err, rows) {
	                if(rows.length > 0) {
	                	rows.forEach(function(row){
                            row.created_at = dateFormat(new Date(row.created_at), "yyyy-mm-dd HH:MM:ss"); 

	                   		resultcsv.push(row); 	
	                   	});
	                	res.csv(resultcsv);   		

	                }else{
	                    res.redirect('/admin/users');
	                } 
	            });
	        }    
        }
        else {
            res.redirect('/admin/users');
        } 

    },
    
    exports_users_view_log: function(req, res, next){  
    	var user_tz = "+00:00";

        var resultcsv = [{
            username : 'Username',
            first_name : 'First Name',
            last_name : 'Last Name',
            module : 'Module',
            submodule : 'Submodule',
            action : 'Action',
            created_at : 'Created At'
        }];

        var qd =  "SELECT * from users";

		userModel.query(qd,function(err, records) {
            if(records.length > 0) {
	            records.forEach(function(record, index){
	            	var userId = record.id;

		 			getTimezone(req, res, next, index, userId);
                });

                function getTimezone(req, res, next, index, userId){
                    var tzQuery = "SELECT timezone FROM common_settings";
                    userModel.query(tzQuery, function(err, rows) {
                        if(rows){
                            user_tz = rows[0].timezone; 
                        }
                        getViewLogRows(req, res, next, index, userId);
                    }); 
                }
                function getViewLogRows(req, res, next, index, userId){

                    var qd1 =  "SELECT  u.username, u.first_name, u.last_name, e.module, e.submodule, e.action,convert_tz(e.created_at, '+00:00', '"+user_tz+"') as created_at from events_log as e left join users as u on u.id = e.user_id WHERE e.user_id = '"+ userId +"'";

                    userModel.query(qd1,function(err, rows) {
                        if(rows.length > 0) {
                            rows.forEach(function(row){
                                row.created_at = dateFormat(new Date(row.created_at), "yyyy-mm-dd HH:MM:ss");
                                resultcsv.push(row);    
                            });
                        }

                        if(records.length == index + 1){
                            exportCSV();
                        }
                    });
                }    
                function exportCSV(){
                    res.csv(resultcsv);
                }
            }else{
	        	res.redirect('/admin/users'); 
	        }   	 	

	    });   
	},

    send_notification: function(req, res, next){   
        var userId = req.params.id; 
        var params = { "data": {
            "title":"FOCUS",
            "message":"Can you check in with FOCUS right now?",
            "notId":1,
            "promptLocation":"Voices"
        }};

        var insertPrompt = function(urows) {

            var guid = guidCreate();

            var query2 = "INSERT INTO prompts set udid = '"+ guid  +"', user_id = '"+userId+"',intervention='Voices',contact_type='prompt',event='prompt',sending_at = now(), prompt_status = '1' ";
            userModel.query(query2, function(err, result) {
                if(! err){  
                    params.data.promptId = result.insertId;
                    params.data.promptGuid = guid;  
                    
                    if(urows[0].device_type == "Android"){
                        sendAndroidPush({deviceId : urows[0].device_id,  params: params}, function (response) {
                            setPromptResponse(result.insertId, response);
                        });
                    }else{
                        sendIosPush({deviceId : urows[0].device_id,  params: params}, function (response) {
                            setPromptResponse(result.insertId, response);
                        }); 
                    }    
                }       
            });    
        }
        var setPromptResponse = function (notificationId, response) {
            var query = "UPDATE prompts SET push_response = '" + JSON.stringify(response) + "' WHERE id = '"+notificationId+"'"; 
            userModel.query(query, function(err, result) {
                if(err)
                    console.log(err);
                else
                    console.log(result);
                res.redirect('/admin/users');
            });
        }

        if(typeof userId!=='undefined') {
            var query3 = "SELECT device_type, device_id FROM users WHERE id = '" + userId + "' AND device_id != ''";
            userModel.query(query3, function(err, urows) {
                if(urows.length > 0){
                    insertPrompt(urows);
                }else{
                    res.redirect('/admin/users');    
                }     
            });
        }else{
           res.redirect('/admin/users'); 
        }    
    },

}; 