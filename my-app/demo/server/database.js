// config/database.js
module.exports = {
    'connection': {
		'host'     : 'localhost',
		'user'     : 'root',
		'password' : '123456',
		'database' : 'wellfaster',
		'dateStrings' :true,
		'port' : '8080',
    },
    'mailer': {
		'host'     : 'smtp.gmail.com',//SMTP HOST
		'user'     : 'kuldeep@wegile.com',//SMTP USER EMAIL
		'password' : '09111987',//SMTP PASSWORD
		'from' : 'Kuldeep@wegile.com ',//SMTP FROM USER EMAIL
		'port' : '465',
    }
};

