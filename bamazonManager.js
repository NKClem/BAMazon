const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'password1',
	database: 'bamazon'
});

connection.connect(function(err) {
	if (err) throw err;
	console.log('We have a connection!\n');
	console.log('\n***  ***  ***  ***  ***\n');
	console.log('\nGreetings, Boss! \n');
	console.log('\n***  ***  ***  ***  ***\n');
	promptManager();
});

function promptManager() {
	inquirer.prompt([
		{
			type: 'list',
			name: 'managerList',
			message: 'What would you like to do today?',
			choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Exit Manager Mode']
		}
	]).then(function(answers) {
		if (answers.managerList === 'Exit Manager Mode') {
			exitMode();
		} else if (answers.managerList === 'View Products for Sale') {
			viewProducts();
		} else if (answers.managerList === 'View Low Inventory') {
			viewLowInventory();
		}
	});
}

function exitMode() {
	console.log('\nSee ya later, Boss!');
	connection.end();
}

function viewProducts() {
	let sql = 'SELECT ?? FROM ??';
	let values = ['*', 'products'];
	sql = mysql.format(sql, values);
	connection.query(sql, function(err, results, fields) {
		if (err) throw err;
		for (let i = 0; i < results.length; i++) {
			console.log(` \nItem ID: ${results[i].item_id}     Name: ${results[i].product_name}     Price: ${results[i].price}     In Stock: ${results[i].stock_quantity} \n-------------------------------------------------------------------------------------- \n`);
		}
		promptManager();
	});
}

function viewLowInventory() {
	console.log('\n  ***  ***  ***  ***  ***  \n');
	console.log(' Current Low Inventory ');
	console.log('\n  ***  ***  ***  ***  ***  \n');
	
	let lowInventoryArr = [];
	
	let sql = 'SELECT ?? FROM ??';
	let values = ['*', 'products'];
	sql = mysql.format(sql, values);
	connection.query(sql, function(err, results, fields) {
		if (err) throw err;
		for (let i = 0; i < results.length; i++) {
			if (results[i].stock_quantity < 5) {
				lowInventoryArr.push(results[i]);
			}
		}

		if (lowInventoryArr = []) {
			console.log('\nNo Low Inventory! Get to selling!\n');
		} else {
			for (let i = 0; i < lowInventoryArr.length; i++) {
				console.log(`\nItem ID: ${results[i].item_id}     Name: ${results[i].product_name}     Price: ${results[i].price}     In Stock: ${results[i].stock_quantity} \n-------------------------------------------------------------------------------------- \n`);
			}
		}
		
		console.log('\n***  End of Low Inventory Report  ***\n');
		promptManager();
	});
}
