const dbConfig = require('../config').db; 
exports.getDb2 = function(){
	return new Sequelize( dbConfig, dbConfig, dbConfig, {
  		host: dbConfig,
  		dialect: 'mysql',
		pool: {
    		max: 5,
    		min: 0,
    		idle: 10000
  		}
	});
}