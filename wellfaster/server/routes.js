const express 		= require('express');
const controllers 	= require('./controllers').admin;
const fn 			= require('./helpers/functions');
const router 		= express.Router();

/**
 *  Follwing routes for user registration,user login,
 *  user authentication, token verification, email varification
 *  create user, edit user, delete user, get users
 */


/******************************************************
 *  		USE ROUTER MIDDLEWARE                     *
 ******************************************************/

	
	router.use(function(req, res, next){
		//res.locals.session = req.session.admin_user_id ? req.session : '';
		res.locals.session = req.session;
		next();
	});


	/*router.use(function(req, res, next){
		if(req.path !== "/")
			if(fn.isSet(req.session.admin_user_id))
				fn.varifySessionHash(req.session.admin_user_id, req.session.admin_user_usersmac)
				?  next() : res.redirect('/admin/logout');
			else res.redirect('/admin');
		else next();
	});*/

/******************************************************
 *  			 USE ROUTER PATHS                     *
 ******************************************************/	
	
	router.get('/', 							controllers.admin.home);
	router.post('/', 							controllers.admin.authenticate);
	
	router.get('/dashboard',					controllers.admin.dashboard);
	
	router.get('/change-admin-password',		controllers.admin.change_admin_password);
	router.post('/change-admin-password',		controllers.admin.change_admin_password);
	
	router.get('/change-admin-password/:id/',	controllers.admin.change_admin_password);
	router.post('/change-admin-password/:id/',	controllers.admin.change_admin_password);

	router.get('/admin-users',					controllers.admin.index); 					// retrieve all admin users	

	router.get('/edit-admin/:id/',				controllers.admin.edit);					// get update admin user form
	router.post('/edit-admin/:id/',				controllers.admin.update);					// update admin user form
	
	router.get('/edit-admin',					controllers.admin.edit);
	router.post('/edit-admin',					controllers.admin.update);
	
	router.post('/admin-users/delete/:id/',		controllers.admin.delete);


	router.get('/users',						controllers.user.index);
	router.get('/edit-user/:id/',				controllers.user.edit);
	router.post('/edit-user/:id/',				controllers.user.update);
	router.get('/edit-user/',					controllers.user.edit);
	router.post('/edit-user/', 					controllers.user.update);
	router.get('/users/delete/:id/', 			controllers.user.delete);
	router.get('/change-password/:id/', 		controllers.user.change_password);
	router.post('/change-password/:id/', 		controllers.user.change_password);
	router.get('/edit-cycle/:id/',				controllers.user.cycle);
	router.post('/edit-cycle/:id/',				controllers.user.update_cycle);


	router.get('/admin_users_ajax',				controllers.data.admin_users);	
	router.get('/users_ajax',					controllers.data.users_ajax);


	/*PAGES ROUTES*/
	router.get('/pages',						controllers.page.index);
	router.get('/edit-page',					controllers.page.edit);
	router.get('/edit-page/:id',				controllers.page.edit);

	router.post('/pages',						controllers.page.update);
	router.post('/edit-page',					controllers.page.update);
	router.post('/edit-page/:id',				controllers.page.update);
	
	router.post('/pages/delete/:id',			controllers.page.delete);

	/* BANNER ROUTES*/
	router.get('/banners',						controllers.banner.index);
	router.get('/banner',						controllers.banner.edit);
	router.get('/banner/:id',					controllers.banner.edit);

	router.post('/banner',						controllers.banner.update);
	router.post('/banner/:id',					controllers.banner.update);
	router.post('/banners/delete/:id',			controllers.banner.delete);


	router.get('/table/banners',				controllers.data.banners);
	router.get('/table/admins',					controllers.data.admins);


	router.get('/setting',						controllers.setting.index);
	router.post('/setting',						controllers.setting.edit);
	router.post('/setting/edit',				controllers.setting.edit);
	router.post('/setting/reset',				controllers.setting.reset);


	//router.get('/common-settings',				controllers.setting.index);
	//router.post('/common-settings',				controllers.setting.update);



	router.get('/logout', function(req, res) {
		delete req.session.admin_user_usersmac;
		delete req.session.admin_user_id;
		delete req.session.admin_user_name;		
		res.redirect('/admin');
	});

module.exports = router;