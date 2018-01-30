const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'pharley9',
	database: 'bamazon'
});

connection.connect(function(err) {
	if (err) throw err;
	console.log('We have a connection!');
	seeWhatIsAvailable();
});

function seeWhatIsAvailable() {
	console.log('\n***  ***  ***  Welcome to Bamazon  ***  ***  ***\n');
	console.log('Like Amazon (But less expensive.  We promise.)\n');
	inquirer.prompt([
		{
			type: 'confirm',
			name: 'confirm',
			message: "Would you like to see what is in stock?",
			default: true
		}
	]).then(function(answers) {
		if (answers.confirm) {
			let sql = 'SELECT ?? FROM ??';
			let values = ['*', 'products'];
			sql = mysql.format(sql, values);

			connection.query(sql, function(err, results, fields) {
				if (err) throw err;
				for (let i = 0; i < results.length; i++) {
					console.log('\n' + results[i].item_id, results[i].product_name, results[i].price + '\n');
				}
				promptUserInput();
			});
		}
	});
}

function promptUserInput() {
	inquirer.prompt([
		{
			type: 'input',
			name: 'item',
			message: 'Which item would you like to view? Please select by ID number.'
		},
		{
			type: 'input',
			name: 'itemQuantity',
			message: 'How many would you like to purchase?'
		}
	]).then(function(answers) {
		let sql = 'SELECT ?? FROM ?? WHERE ?? = ?';
		let values = ['*', 'products', 'item_id', answers.item];
		sql = mysql.format(sql, values);
		connection.query(sql, function(err, results) {
			if (answers.itemQuantity <= results[0].stock_quantity) {
				console.log(`Updating all ${results[0].product_name} quantities... ... ...`);
				connection.end();
			} else {
				console.log('\nNot enough in stock. \nPlease pick another item or another amount.\n');
				promptUserInput();
			}
		});
	});
}
