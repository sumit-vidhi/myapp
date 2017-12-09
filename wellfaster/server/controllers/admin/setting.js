const AdminModel                = require('../../models/admin');
const EditAdminForm             = require('../../models/edit-admin-form');
const ChangeAdminPasswordForm   = require('../../models/change-admin-password-form');
const fn                        = require('../../helpers/functions');

var timeZones = [
        {"value":"-12:00","label":"[UTC - 12] Baker Island Time"},
        {"value":"-11:00","label":"[UTC - 11] Niue Time, Samoa Standard Time"},
        {"value":"-10:00","label":"[UTC - 10] Hawaii-Aleutian Standard Time, Cook Island Time"},
        {"value":"-9:30","label":"[UTC - 9:30] Marquesas Islands Time"},
        {"value":"-9:00","label":"[UTC - 9] Alaska Standard Time, Gambier Island Time"},
        {"value":"-8:00","label":"[UTC - 8] Pacific Standard Time"},
        {"value":"-7:00","label":"[UTC - 7] Mountain Standard Time"},
        {"value":"-6:00","label":"[UTC - 6] Central Standard Time"},
        {"value":"-5:00","label":"[UTC - 5] Eastern Standard Time"},
        {"value":"-4:00","label":"[UTC - 4] Atlantic Standard Time"},
        {"value":"-3:30","label":"[UTC - 3:30] Newfoundland Standard Time"},
        {"value":"-3:00","label":"[UTC - 3] Amazon Standard Time, Central Greenland Time"},
        {"value":"-2:00","label":"[UTC - 2] Fernando de Noronha Time, South Georgia &amp; the South Sandwich Islands Time"},
        {"value":"-1:00","label":"[UTC - 1] Azores Standard Time, Cape Verde Time, Eastern Greenland Time"},
        {"value":"+0:00","label":"[UTC] Western European Time, Greenwich Mean Time"},
        {"value":"+1:00","label":"[UTC + 1] Central European Time, West African Time"},
        {"value":"+2:00","label":"[UTC + 2] Eastern European Time, Central African Time"},
        {"value":"+3:00","label":"[UTC + 3] Moscow Standard Time, Eastern African Time"},
        {"value":"+3:30","label":"[UTC + 3:30] Iran Standard Time"},
        {"value":"+4:00","label":"[UTC + 4] Gulf Standard Time, Samara Standard Time"},
        {"value":"+4:30","label":"[UTC + 4:30] Afghanistan Time"},
        {"value":"+5:00","label":"[UTC + 5] Pakistan Standard Time, Yekaterinburg Standard Time"},
        {"value":"+5:30","label":"[UTC + 5:30] Indian Standard Time, Sri Lanka Time"},
        {"value":"+5:45","label":"[UTC + 5:45] Nepal Time"},
        {"value":"+6:00","label":"[UTC + 6] Bangladesh Time, Bhutan Time, Novosibirsk Standard Time"},
        {"value":"+6:30","label":"[UTC + 6:30] Cocos Islands Time, Myanmar Time"},
        {"value":"+7:00","label":"[UTC + 7] Indochina Time, Krasnoyarsk Standard Time"},
        {"value":"+8:00","label":"[UTC + 8] Chinese Standard Time, Australian Western Standard Time, Irkutsk Standard Time"},
        {"value":"+8:45","label":"[UTC + 8:45] Southeastern Western Australia Standard Time"},
        {"value":"+9:00","label":"[UTC + 9] Japan Standard Time, Korea Standard Time, Chita Standard Time"},
        {"value":"+9:30","label":"[UTC + 9:30] Australian Central Standard Time"},
        {"value":"+10:00","label":"[UTC + 10] Australian Eastern Standard Time, Vladivostok Standard Time"},
        {"value":"+10:30","label":"[UTC + 10:30] Lord Howe Standard Time"},
        {"value":"+11:00","label":"[UTC + 11] Solomon Island Time, Magadan Standard Time"},
        {"value":"+11:30","label":"[UTC + 11:30] Norfolk Island Time"},
        {"value":"+12:00","label":"[UTC + 12] New Zealand Time, Fiji Time, Kamchatka Standard Time"},
        {"value":"+12:45","label":"[UTC + 12:45] Chatham Islands Time"},
        {"value":"+13:00","label":"[UTC + 13] Tonga Time, Phoenix Islands Time"},
        {"value":"+14:00","label":"[UTC + 14] Line Island Time"}
];

module.exports = {   
    index: function(req, res, next){        
        let adminId = 1;
        let model = new AdminModel();
        model.findOne(adminId, function(err, user){
            res.render('admin/setting', {
                result : user,
                admin_id : adminId,
                message : req.flash('info')
            });
        });
    },

    edit: function(req, res, next) {
        let adminId = 1;
        let model = new EditAdminForm();
        if(model.load(req.body) && model.validate()){
            return new Promise(function(resolve, reject){
                let adminModel = new AdminModel();
                adminModel.findByUsername( model.get('username'), function(err, rows){
                    if(err) reject(err);
                    else if(rows && rows.length > 0 && rows[0].id != adminId) {
                        reject(new Error('Email Already used'));
                    }else{
                        if(adminModel.load(model.get()) && adminModel.validate()){
                            adminModel.save(function(err, newAdmin){
                                if(err) reject(err);
                                else resolve(newAdmin);
                            });   

                        }else{
                            reject(new Error('Internal Error'));
                        } 
                    }
                });  

            })
            .then(function(user){
                req.flash('info', 'Admin details updated successfully.');
                res.redirect('/admin/setting');
            })
            .catch(function(err){
                res.render('admin/setting',{ 
                    admin_id: adminId, 
                    message: err.message, 
                    errors: [],
                    result:req.body
                });
            });

        }else{
            console.log(model.getErrors());
            res.render('admin/setting',{ 
                admin_id: adminId, 
                message: '', 
                errors: model.getErrors(),
                result:req.body
            });
        }

    },

    reset : function(req, res, next) {
        let adminId = 1;
        let model = new ChangeAdminPasswordForm();
        
        if(fn.isSet(req.body)){
            if(model.load(req.body) && model.validate()){
                return new Promise(function(resolve, reject){
                    let adminModel = new AdminModel();
                    adminModel.findOne(adminId, function(err, admin){
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
                    req.flash('info', 'Password changed successfully.');
                    res.redirect('/admin/setting');
                })
                .catch(function(err){
                    req.flash('info', err.message);
                    res.redirect('/admin/setting');
                })    
            }else{
                req.flash('info', 'Validation Error');
                res.redirect('/admin/setting');
            }
        }else{
            req.flash('info', 'Validation Error');
            res.redirect('/admin/setting');
        }
    },    
}; 