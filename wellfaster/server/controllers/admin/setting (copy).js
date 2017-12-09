var MyAppModel = require('../../models/dbconnection');
settingsModel = new MyAppModel({tableName: "common_settings"});

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
    update: function(req, res, next) {
    	var post = req.body;       
    	if(post && post.submit=='Submit') {
    		//VALIDATE FORM
		    req.assert('email', 'A valid email is required').isEmail();  //Validate username
		    req.assert('phone', 'Phone is required').notEmpty();           //Validate password
		    var errors = req.validationErrors(); 		   
		    if(!errors){
                var q = "UPDATE common_settings SET email='"+post.email+"',phone='"+post.phone+"', timezone='"+ post.timezone +"' WHERE id='1'";
                settingsModel.query(q,function(err, rows) {
                    if(err) {
                       res.render('admin/settings.ejs',{ message: 'Sorry! record not updated. Please try again.',errors: {},username: post.username});
                    }
                    else {
                        req.session.success="Record updated successfully.";
                        res.redirect('/admin/dashboard');
                    }
                });
		    	
		    }
		    else {
		    	res.render('admin/settings.ejs',{ message: '',errors: errors,username: post.username,timezones : timeZones});
		    }
    	}
    	else {
    		res.redirect('/admin/dashboard');
    	}
    },     

    index: function(req, res, next){        
        settingsModel.read('1', function(err, rows) {
            if(rows) {
                res.render('admin/settings.ejs',{message: '',errors: {},result:rows, timezones : timeZones});
            }
            else {
                res.redirect('/admin/dashboard');
            }      
        });
    },
}; 