const Promise                   = require('bluebird');
const AdminModel                = require('../../models/admin');
const AdminLoginModel           = require('../../models/admin-login');
const CreateAdminForm           = require('../../models/create-admin-form');
const EditAdminForm             = require('../../models/edit-admin-form');
const ChangeAdminPasswordForm   = require('../../models/change-admin-password-form');
const fn                        = require('../../helpers/functions');

const MyAppModel = require('../../models/dbconnection');
adminModel = new MyAppModel({tableName: "admin"});


module.exports = {
    home: function(req, res, next){     
        if (req.session.admin_user_id) {
           res.redirect('/admin/dashboard');
        }

        res.render('admin/index.ejs', { 
            message: req.flash(),
            errors: {},
            username:''
        });
    },

    authenticate: function(req, res, next) {
        let post = req.body;
        if(post && post.loginsubmit=='login') {
            let model = new AdminLoginModel();
            
            if(model.load(post) && model.validate()){
                return new Promise(function(resolve, reject){
                    let adminModel = new AdminModel();
                    
                    adminModel.findByUsername( model.get('username'), function(err, rows){
                         
                        if(err) reject(err);

                        else if(rows && rows.length > 0){
                            let user = rows[0], 
                                pass = model.get('password');

                            fn.validateHashSync(pass, user.password) ? 
                                resolve(user) : reject(new Error('Oops! Wrong password')); 
                        }else{
                            reject(new Error('A valid username is required'));
                        } 

                    });    
                })
                .then(function(user){
                    //SET SESSION VARIABLES
                    req.session.admin_user_usersmac =   fn.getSessionHash(user.id);
                    req.session.admin_user_id       =   user.id;
                    req.session.admin_user_name     =   user.first_name +" "+ user.last_name;

                    res.redirect('/admin/dashboard');
                })
                .catch(function(err){
                    res.render('admin/index.ejs', { 
                        message : err.message,
                        errors  : {},
                        username: post.username
                    });
                })

            }     
            else {
 
                res.render('admin/index.ejs', { 
                    message : '',
                    errors  : model.getErrors(),
                    username: post.username
                });
            }
        }else{
            res.redirect('/admin');
        }    
    },
    
    dashboard: function(req, res, next){    
        var message ='';
        if(req.session.success) {
            message=req.session.success;
            delete req.session.success;
        }        

        res.render('admin/dashboard.ejs',{ 
            message: message
        });
    },  

    index: function(req, res, next){              
        res.render('admin/admin-users.ejs',{ 
            messages : req.flash()
        });
    },

    edit: function(req, res, next){          
        var getId = req.params.id;     
        let adminModel = new AdminModel();   
        if(typeof getId!=='undefined') {
            adminModel.findOne(getId, function(err, rows) {
                if(rows) {
                    res.render('admin/add-admin-user.ejs',{admin_id:getId,message: '',errors: {},result:rows});
                }
                else {
                    res.redirect('/admin/admin-users');
                }      
            });
        }
        else {
            res.render('admin/add-admin-user.ejs',{ admin_id:'',message: '',errors: {},result:{}});
        }       
    },
    
    delete: function(req, res, next){          
        var getId = req.params.id;
        let adminModel = new AdminModel();

        if(typeof getId!=='undefined') {
            adminModel.findOne(getId, function(err, rows) {   
                if(rows) {
                    if(rows.is_protected == 'yes' ) {
                        req.flash('error', 'Sorry! you can not delete default admin.');
                        res.redirect('/admin/admin-users');
                    }
                    else {
                        adminModel.delete(getId,function(err, rows) {
                            if(err) {
                                req.flash('error', 'Sorry! user not deleted. Please try again');
                                res.redirect('/admin/admin-users');
                            }
                            else {
                                req.flash('success', 'User deleted successfully');   
                                res.redirect('/admin/admin-users');
                            }
                        });
                    }
                }   
            });
        }
        else {
            res.redirect('/admin/admin-users');
        }       
    },
    
    change_admin_password: function(req, res, next) {
        let getId = fn.isSet(req.params.id) ? req.params.id : req.session.admin_user_id;
        let model = new ChangeAdminPasswordForm();
        
        if(fn.isSet(req.body)){
            if(model.load(req.body) && model.validate()){
                return new Promise(function(resolve, reject){
                    let adminModel = new AdminModel();
                    adminModel.findOne(getId, function(err, admin){
                       if(err) reject(err);
                        let pass = model.get('old_password');
                        if(fn.validateHashSync(pass, admin.password)){
                            adminModel.set('password', fn.getHashSync(model.get('new_password')));
                            adminModel.save(function(err, admin){
                                if(err) reject(err);
                                else resolve(admin);
                            })
                        }else{
                            reject(new Error('Oops! Wrong password')); 
                        }
                    });
                })
                .then(function(user){
                    req.session.success="Password updated successfully.";
                    res.redirect('/admin/dashboard');
                })
                .catch(function(err){
                    console.log(err);
                    res.render('admin/change-admin-password',{ 
                        message: err.message, 
                        errors: [],
                        result:req.body
                    });
                })    
            }else{
                console.log(model.getErrors());
                res.render('admin/change-admin-password',{ 
                    message: '', 
                    errors: model.getErrors()
                });
            }
        }else{
            res.render('admin/change-admin-password',{ 
                message: '', 
                errors: {}
            });
        }
                
    },
    update: function(req, res, next) {        
        
        let model = (fn.isSet(req.params.id)) ? new EditAdminForm() : new CreateAdminForm();
        
        if(model.load(req.body) && model.validate()){
            return new Promise(function(resolve, reject){
                let adminModel = new AdminModel();
                adminModel.findByUsername( model.get('username'), function(err, rows){
                    if(err) reject(err);
                    else if(rows && rows.length > 0 && rows[0].id != req.params.id) {
                        reject(new Error('Email Already used'));
                    }else{
                        if(adminModel.load(model.get()) && adminModel.validate()){
                            if(fn.isSet(adminModel.get('password')))
                                adminModel.set('password', fn.getHashSync(adminModel.get('password')));

                            adminModel.save(function(err, newAdmin){
                                if(err) reject(err);
                                else resolve(newAdmin);
                            });   

                        }else{
                            console.log(adminModel.getErrors());
                            reject(new Error('Internal Error'));
                        } 
                    }
                });  

            })
            .then(function(user){
                var success =   (fn.isSet(req.params.id)) 
                                ? "Admin user updated successfully." : "Admin user created successfully.";

                console.log('success=========', success);                
                req.flash('success', success);                
                res.redirect('/admin/admin-users');
            })
            .catch(function(err){

                console.log(err.message);

                res.render('admin/add-admin-user.ejs',{ 
                    admin_id: req.params.id, 
                    message: err.message, 
                    errors: [],
                    result:req.body
                });
            });

        }else{

            console.log(model.getErrors());


            res.render('admin/add-admin-user.ejs',{ 
                admin_id: req.params.id, 
                message: '', 
                errors: model.getErrors(),
                result:req.body
            });
        }
    },
}; 

