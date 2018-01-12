const mysql = require('mysql');


exports.insertQuery = function (table, obj){
	let sql = "INSERT INTO ?? SET ?";
	let inserts = [table, obj];
	return mysql.format(sql, inserts);
};

exports.findQuery = function (table, columns, conditions){
	let sql = "SELECT * FROM ?? WHERE ";
	let inserts = [table];
	
	if(columns == "" || columns == "null" || columns == "undefined")
		columns = '1';

	if(conditions == "" || conditions == "null" || conditions == "undefined")
		conditions = '1';

	if( typeof conditions === 'string' ) {
	    sql += conditions;
	}else{
		sql += " ?";
		inserts.push(conditions);
	}
	return mysql.format(sql, inserts); 
};

exports.selectQuery = function (table, columns, conditions){
	let sql = "SELECT * FROM ?? WHERE ";
	let inserts = [table];
	
	if(columns == "" || columns == "null" || columns == "undefined")
		columns = '1';

	if(conditions == "" || conditions == "null" || conditions == "undefined")
		conditions = '1';

	if( typeof conditions === 'string' ) {
	    sql += conditions;
	}else{
		sql += " ?";
		inserts.push(conditions);
	}
	return mysql.format(sql, inserts); 
};

exports.selectAllQuery = function (table, columns, conditions){
	let sql = "SELECT * FROM ?? WHERE ";
	let inserts = [table];
	
	if(columns == "" || columns == "null" || columns == "undefined")
		columns = '1';

	if(conditions == "" || conditions == "null" || conditions == "undefined")
		conditions = '1';

	if( typeof conditions === 'string' ) {
	    sql += conditions;
	}else{
		sql += " ?";
		inserts.push(conditions);
	}
	return mysql.format(sql, inserts); 
};

exports.selectColumns = function(table){
	let sql = "SHOW COLUMNS FROM ?? WHERE 1";
	let inserts = [table];
	return mysql.format(sql, inserts); 
}

exports.saveQuery = function(table, data){
	if(data.id){
		let sql = "UPDATE ?? SET ? WHERE ?? = ?";
		let inserts = [table, data, 'id', data.id];
		return mysql.format(sql, inserts); 
	}else{
		let sql = "INSERT INTO ?? SET ?"
		let inserts = [table, data];
		return mysql.format(sql, inserts); 
	}
}

exports.innerJoinQuery = function(table, jointable, oncond, where, fields){
	let sql = "SELECT "
	if(! fields)
		fields = "*";
	sql += fields + " FROM " + table;
	sql += " INNER JOIN " + jointable;
	sql += " ON " + oncond;
	sql += " WHERE " + where;
	return sql;
}