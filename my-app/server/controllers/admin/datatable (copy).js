const Promise 		= require('bluebird');
const appPaths 		= require('../../config').paths;
const fn 			= require(appPaths.helpers + 'functions')

const bannerModel   = require(appPaths.models + 'banner');

var MyAppModel = require('../../models/dbconnection');
var dateFormat = require('dateformat');

let model = new bannerModel();


var isset = function(str){
	if (typeof str != 'undefined') {
		return true;
	}
	return false;
}

var trim = function(str){	
	return str.trim();
}

var substr_replace = function(str, replace, start, length){	
	if (start < 0) { // start position in str
		start = start + str.length;
	}
	length = length !== undefined ? length : str.length;
	if (length < 0) {
		length = length + str.length - start;
	}
	return str.slice(0, start) + replace.substr(0, length) + replace.slice(length) + str.slice(start + length);
}

var addslashes = function(str){	
	return (str + '')
    .replace(/[\\"']/g, '\\$&')
    .replace(/\u0000/g, '\\0');
}


module.exports = {
	admin_users: function(req, res, next){	
		adminModel = new MyAppModel({tableName: "admin"});
		request = req.query;		
		var aColumns = ['username', 'first_name', 'last_name', 'created','id'];
		var sIndexColumn = "id";
		var sTable = "admin";

		var sLimit = "";
		if(request['start'] && request['length'] != -1)	{
			sLimit = 'LIMIT ' +request['start']+ ', ' +request['length']
		}

		//Ordering
		var sOrder = "ORDER BY id DESC";
	    if ( isset(request['order'] ) && isset(request['order'][0]['dir']) && trim(request['order'][0]['dir'])!=='')
	    {
	       sOrder = "ORDER BY "+aColumns[request['order'][0]['column']]+" "+ request['order'][0]['dir'];  
	    }


	    /*
	     * Filtering
	     * NOTE this does not match the built-in DataTables filtering which does it
	     * word by word on any field. It's possible to do here, but concerned about efficiency
	     * on very large tables, and MySQL's regex functionality is very limited
	    */

	    var sWhere = "";
		if ( isset(request['search']['value']) && request['search']['value'] != "" ) {
			flArray = aColumns;
			sWhere = "WHERE (";
			for ( var i=0 ; i<flArray.length ; i++ ){
				sWhere += flArray[i]+" LIKE '%"+addslashes( request['search']['value'] )+"%' OR ";
			}
			sWhere =substr_replace(sWhere, "", -3 );
			sWhere += ')';
		}

		/* Individual column filtering */
	    for ( i=0 ; i<aColumns.length ; i++ )
	    {
	        if ( isset(request['columns']) && request['columns'][i]['searchable'] == "true" && request['columns'][i]['search']['value'] != '' )
	        {
	            if ( sWhere == "" )
	            {
	                sWhere = "WHERE ";
	            }
	            else
	            {
	                sWhere += " AND ";
	            }
	            sWhere += aColumns[i]+" LIKE '%"+addslashes(request['columns'][i]['search']['value'])+"%' ";
	        }
	    }

	    /*
	     * SQL queries
	     * Get data to display
	     */
	    var sQuery = "SELECT " +aColumns.join(',')+ " FROM " +sTable+" "+sWhere+" "+sOrder+" "+sLimit +"";
		var rResult = {};
		var rResultFilterTotal = {};
		var aResultFilterTotal = {};
		var iFilteredTotal = {};
		var iTotal = {};
		var rResultTotal = {};
		var aResultTotal = {};
		//console.log(sQuery);
	    adminModel.query(sQuery, function(err, rows) {		
			if(err) {
				res.send(err);
			}
			else {
				rResult = rows;
				sQuery = "SELECT " +aColumns.join(',')+ " FROM " +sTable+" "+sWhere+" "+sOrder+"";
				adminModel.query(sQuery, function(err, rows) {	
					if(err) {
						res.send(err);
					}
					else {
						iFilteredTotal=rows.length;

						sQuery = "SELECT COUNT("+sIndexColumn+") as total  FROM " +sTable+"";
						adminModel.query(sQuery, function(err, rows) {
							if(err) {
								res.send(err);
							}
							else {
								iTotal = rows[0]['total'];
								//Output
						        var output = {};
						        var temp = [];
						        output.sEcho = parseInt(request['sEcho']);
						        output.iTotalRecords = iTotal;
						        output.iTotalDisplayRecords = iFilteredTotal;
						        output.aaData = [];

						        var aRow = rResult;
						        var row = [];
						        var editUrl='';
						        for(var i in aRow)
						        {
									for(Field in aRow[i])
									{
										if(Field == "id") {
											continue;
										}
										else if(Field == "created") {
							               var created =dateFormat(aRow[i]['created'], "mmmm dS, yyyy, h:MM:ss TT");
							               temp.push(created);
							            }
							            else {
							            	if(!aRow[i].hasOwnProperty(Field)) continue; 
											temp.push(aRow[i][Field]);
							            }
										
									}
									editUrl='<a href="edit-admin/'+aRow[i]['id']+'" title="Update"><i class="btn btn-primary btn-xs fa fa-pencil"></i></a>&nbsp;';	
									editUrl +='<a href="admin-users/delete/'+aRow[i]['id']+'" title="Delete"  onclick="javascript: return confirmDelete();"><i class="btn btn-danger btn-xs fa fa-trash-o"></i></a>';
									temp.push(editUrl);
						        	output.aaData.push(temp);
						         	temp = [];
						        }
						        res.send(output);							       				        
							}
						});
					}
				});
			}		
		}); 
    },
    
    users_ajax: function(req, res, next){	
		userModel = new MyAppModel({tableName: "users"});
		request = req.query;		
		var aColumns = ['username', 'first_name', 'last_name', 'created','id'];
		var sIndexColumn = "id";
		var sTable = "users";

		var sLimit = "";
		if(request['start'] && request['length'] != -1)	{
			sLimit = 'LIMIT ' +request['start']+ ', ' +request['length']
		}

		//Ordering
		var sOrder = "ORDER BY id DESC";
	    if ( isset(request['order'] ) && isset(request['order'][0]['dir']) && trim(request['order'][0]['dir'])!=='')
	    {
	       sOrder = "ORDER BY "+aColumns[request['order'][0]['column']]+" "+ request['order'][0]['dir'];  
	    }


	    /*
	     * Filtering
	     * NOTE this does not match the built-in DataTables filtering which does it
	     * word by word on any field. It's possible to do here, but concerned about efficiency
	     * on very large tables, and MySQL's regex functionality is very limited
	    */

	    var sWhere = "";
		if ( isset(request['search']['value']) && request['search']['value'] != "" ) {
			flArray = aColumns;
			sWhere = "WHERE (";
			for ( var i=0 ; i<flArray.length ; i++ ){
				sWhere += flArray[i]+" LIKE '%"+addslashes( request['search']['value'] )+"%' OR ";
			}
			sWhere =substr_replace(sWhere, "", -3 );
			sWhere += ')';
		}

		/* Individual column filtering */
	    for ( i=0 ; i<aColumns.length ; i++ )
	    {
	        if ( isset(request['columns']) && request['columns'][i]['searchable'] == "true" && request['columns'][i]['search']['value'] != '' )
	        {
	            if ( sWhere == "" )
	            {
	                sWhere = "WHERE ";
	            }
	            else
	            {
	                sWhere += " AND ";
	            }
	            sWhere += aColumns[i]+" LIKE '%"+addslashes(request['columns'][i]['search']['value'])+"%' ";
	        }
	    }

	    /*
	     * SQL queries
	     * Get data to display
	     */
	    var sQuery = "SELECT " +aColumns.join(',')+ " FROM " +sTable+" "+sWhere+" "+sOrder+" "+sLimit +"";
		var rResult = {};
		var rResultFilterTotal = {};
		var aResultFilterTotal = {};
		var iFilteredTotal = {};
		var iTotal = {};
		var rResultTotal = {};
		var aResultTotal = {};

	    userModel.query(sQuery, function(err, rows) {		
			if(err) {
				res.send(err);
			}
			else {
				rResult = rows;
				sQuery = "SELECT " +aColumns.join(',')+ " FROM " +sTable+" "+sWhere+" "+sOrder+"";
				userModel.query(sQuery, function(err, rows) {	
					if(err) {
						res.send(err);
					}
					else {
						iFilteredTotal=rows.length;

						sQuery = "SELECT COUNT("+sIndexColumn+") as total  FROM " +sTable+"";
						userModel.query(sQuery, function(err, rows) {
							if(err) {
								res.send(err);
							}
							else {
								iTotal = rows[0]['total'];
								//Output
						        var output = {};
						        var temp = [];
						        output.sEcho = parseInt(request['sEcho']);
						        output.iTotalRecords = iTotal;
						        output.iTotalDisplayRecords = iFilteredTotal;
						        output.aaData = [];

						        var aRow = rResult;
						        var row = [];
						        var editUrl='';
						        for(var i in aRow)
						        {
									for(Field in aRow[i])
									{
										if(Field == "id") {
											continue;
										}
										else if(Field == "created") {
							               var created =dateFormat(aRow[i]['created'], "mmmm dS, yyyy, h:MM:ss TT");
							               temp.push(created);
							            }
							            else {
							            	if(!aRow[i].hasOwnProperty(Field)) continue; 
											temp.push(aRow[i][Field]);
							            }
										
									}
									var rePass=parseInt(new Date().getTime().toString().substring(0, 10)); 
									editUrl='<a href="edit-user/'+aRow[i]['id']+'" title="Update"><i class="btn btn-primary btn-xs fa fa-pencil"></i></a>&nbsp;&nbsp;&nbsp;';	
									//editUrl +='<a href="users/delete/'+aRow[i]['id']+'" title="Delete"  onclick="javascript: return confirmDelete(event, '+"'" + aRow[i]['id']+"'" + ');"><i class="btn btn-danger btn-xs fa fa-trash-o"></i></a>&nbsp;&nbsp;&nbsp;';
									editUrl +='<a title="Delete"  onclick="confirmDelete(event, '+"'" + aRow[i]['id']+"'" + ');"><i class="btn btn-danger btn-xs fa fa-trash-o"></i></a>&nbsp;&nbsp;&nbsp;';
									//editUrl +='<a href="mood-rater-graph/'+aRow[i]['id']+'/'+rePass+'" title="MOOD RATER GRAPH"><i class="btn btn-success btn-xs  fa fa-bar-chart-o"></i></a>&nbsp;&nbsp;&nbsp;';
									//editUrl +='<a href="daily-review-graph/'+aRow[i]['id']+'/'+rePass+'1" title="DAILY REVIEW GRAPH"><i class="btn btn-success btn-xs fa fa-dashboard"></i></a>&nbsp;&nbsp;&nbsp;';
									editUrl +='<a href="users/logs/'+aRow[i]['id']+'" title="View Logs"><i class="btn btn-success btn-xs fa fa-database"></i></a>&nbsp;&nbsp;&nbsp;';
									editUrl +='<a href="users/exports-view-log/'+aRow[i]['id']+'/log.csv?rs='+rePass+ '" title="Export View Log"><i class="btn btn-info btn-xs  fa fa-download"></i></a>&nbsp;&nbsp;&nbsp;';
									editUrl +='<a href="users/prompts/'+aRow[i]['id']+'" title="View Prompts"><i class="btn btn-success btn-xs  fa fa-bar-chart-o"></i></a>&nbsp;&nbsp;&nbsp;';
									editUrl +='<a href="users/exports-log/'+aRow[i]['id']+'/log.csv?rs='+rePass+ '" title="Export Log"><i class="btn btn-success btn-xs  fa fa-download"></i></a>&nbsp;&nbsp;&nbsp;';
									editUrl +='<a href="edit-cycle/'+aRow[i]['id']+'" title="Manage Reminder Cycle"><i class="btn btn-warning btn-xs fa fa-clock-o"></i></a>&nbsp;&nbsp;&nbsp;';									
									editUrl +='<a href="users/send-notification/'+aRow[i]['id']+'" title="Send Notification"><i class="btn btn-warning btn-xs fa fa-paper-plane-o"></i></a>';
									

									temp.push(editUrl);
						        	output.aaData.push(temp);
						         	temp = [];
						        }
						        res.send(output);							       				        
							}
						});
					}
				});
			}		
		}); 
    },

    banners : function(req, res, next){
    	return new Promise(function(resolve, reject){
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
			res.json({
	    		code : 200,
	    		data : results
	    	});
		})
		.catch(function(err){
			res.json({
	    		code : 100,
	    		data : []
	    	});
		});    	
    }      
}; 