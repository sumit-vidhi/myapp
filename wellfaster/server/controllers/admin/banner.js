const Promise = require('bluebird');
const appPaths = require('../../config').paths;
const fn = require('../../helpers/functions')

const bannerModel = require(appPaths.models + 'banner');

let model = new bannerModel();

let onError = function(err){
	console.log(err);
}

module.exports = {
	index : function(req, res, next){
		/*return new Promise(function(resolve, reject){
			model.findAll(function(err, rows){
				if(err) reject(err);
				else resolve(rows); 
			})
		})
		.then(function(results){
			return new Promise(function(resolve, reject){
				model.findAll(function(err, rows){
					if(err) reject(err);
					else resolve(rows); 
				})
			});	
		})
		.then(function(results){
			res.render('admin/banners', {
				results : results
			});
		})
		.catch(function(err){
			res.render('admin/banners', {
				errors : err
			});
		});*/

		res.render('admin/banners', { messages: req.flash()});
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
			res.render('admin/edit-banner', {
				result : result
			});
		})
		.catch(function(err){
			res.render('admin/edit-banner', {
				errors : err
			});
		});
	},
	update : function(req, res, next){
		let file = fn.uploadFile().getFileByName('photo');
			return new Promise(function(resolve, reject){
			file(req, res, function(err){
				if(err) reject(err);
				else resolve(req.file);
			});
		})
		.then(function(file){
			return new Promise(function(resolve, reject){
				if(file){
					let image 		= fn.getImage(req.file);
					let filePath	= appPaths.uploads + 'banners/';
					let fileName 	= 'banner_' + fn.time() + '.' + image.ext();
					filePath 	   	+= fileName;

					let imageArgs = { x : 0, y : 0, w : 1200, h : 400, nw : 1500, nh : 500};
				
					if(fn.isSet(req.body.image_data)){
						let data  = JSON.parse(req.body.image_data);
						imageArgs.x = parseInt(data.x); 
						imageArgs.y = parseInt(data.y); 
						imageArgs.w = parseInt(data.width); 
						imageArgs.h = parseInt(data.height); 
					}

					image.save(filePath, imageArgs , function(err, stdout){
						if(err) {
							reject(err);
						}
						else{
							if(req.body.old_photo){
								fn.unlinkSync(appPaths.uploads + 'banners/' + req.body.old_photo);
							}
							resolve(fileName);
						} 
					});
				}else{
					return (req.body.old_photo) ? resolve(req.body.old_photo) : reject(new Error('No image provided'));
				}	
			});			
		})
		.then(function(fileName){
			return new Promise(function(resolve, reject){
				req.body.photo = fileName;
				if(model.load(req.body) && model.validate()){
					model.save(function(err, row){
						if(err) reject(err);
						else resolve(row); 
					});
				}else{
					reject(new Error('Validation Error'));
				}
			});	
		})
		.then(function(row){
			console.log('success================');
			req.flash('success', "banner created successfully");
			res.redirect('/admin/banners');
		})
		.catch(function(err){
			console.log('error================', err.message);
			req.flash('error', "banner not created. Please try again");
			res.render('admin/edit-banner', {
				result : req.body
			});
		});
		
	},
	delete : function(req, res, next){
		return new Promise(function(resolve, reject){
			if(req.params.id){
				model.findOne(req.params.id, function(err, rows){
					if(err) reject(err);
					else resolve(rows); 
				})
			}else{
				reject(new Error('No id provieded')); 
			} 
		})
		.then(function(result){
			return new Promise(function(resolve, reject){
				let filePath = appPaths.uploads + 'banners/'+ result.photo;
				model.delete(result.id, function(err, result){
					if(err) {
						reject(err);
					}else {
						fn.unlinkSync(filePath);
						resolve(reject); 
					}	
				});
			});	
		})
		.then(function(result){
			req.flash('success', 'Banner has been deleted successfully');
			res.redirect('/admin/banners');
		})
		.catch(function(err){
			req.flash('error','Sorry! banner not deleted. Please try again');
			res.redirect('/admin/banners');
		});
	}
}