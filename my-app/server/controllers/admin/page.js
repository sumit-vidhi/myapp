let Promise = require('bluebird');
let PageModel = require('../../models/page');

let model = new PageModel();

module.exports = {
	index : function(req, res, next){
		return new Promise(function(resolve, reject){
			model.findAll(function(err, rows){
				if(err) reject(err);
				else resolve(rows); 
			})
		})
		.then(function(results){
			res.render('admin/pages', {
				messages : req.flash(),
				results : results
			});
		})
		.catch(function(err){
			res.render('admin/pages', {
				messages : req.flash(),
				errors : err
			});
		});
	},
	edit : function(req, res, next){
		return new Promise(function(resolve, reject){
			if(req.params.id){
				model.findOne(req.params.id, function(err, rows){
					if(err) reject(err);
					else resolve(rows); 
				})
			}else{
				resolve(); 
			} 
		})
		.then(function(result){
			res.render('admin/page', {
				result : result
			});
		})
		.catch(function(err){
			res.render('admin/page', {
				errors : err
			});
		});
	},
	update : function(req, res, next){
		return new Promise(function(resolve, reject){
			if(req.params.id && req.params.id != req.body.id ){
				if(err) reject(err);
			}
			if(model.load(req.body) && model.validate()){
				model.save(function(err, row){
					if(err) reject(err);
					else resolve(row); 
				});
			}else{
				reject(new Error('Validation Error'));
			}
		})
		.then(function(row){
			req.flash('success', "Page created successfully");
			res.redirect('/admin/pages');
		})
		.catch(function(row){
			req.flash('error', "Page not created. Please try again");
			res.render('/admin/page');
		});
		
		
	},
	delete : function(req, res, next){
		var getId = req.params.id;
        let pageModel = new PageModel();

        if(typeof getId!=='undefined') {
            pageModel.findOne(getId, function(err, rows) {   
                if(rows) {
                    if(rows.is_protected == 'yes' ) {
                        req.flash('error', 'Sorry! you can not delete default admin.');
                        res.redirect('/admin/pages');
                    }
                    else {
                        pageModel.delete(getId,function(err, rows) {
                            if(err) {
                                req.flash('error', 'Sorry! user not deleted. Please try again');
                                res.redirect('/admin/pages');
                            }
                            else {
                                req.flash('success', 'User deleted successfully');   
                                res.redirect('/admin/pages');
                            }
                        });
                    }
                }   
            });
        }
        else {
            res.redirect('/admin/admin-users');
        }
	}
}