const mysql = require('mysql');
const inquirer = require('inquirer');

let currentDept;
let userTotal;


const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'password1',
	database: 'bamazon'
});

connection.connect(function(err) {
	if (err) throw err;
	console.log('We have a connection!');
	seeWhatIsAvailable();
});

function seeWhatIsAvailable() {
	console.log('\n***  ***  ***  Welcome to BAM!-azon  ***  ***  ***\n');
	console.log('Where you get more bang for your buck!\n');
	inquirer.prompt([
		{
			type: 'confirm',
			name: 'confirm',
			message: "Would you like to see what is in stock?",
			default: true
		}
	]).then(function(answers) {
		if (answers.confirm) {
			showAllProducts();
		} else {
			console.log('\nHope to see you again soon! \n\nHave a BAM!ming day!\n');
			connection.end();
		}
	});
}

function promptUserInput() {
	inquirer.prompt([
		{	//add function to validate that user input is a number
			type: 'input',
			name: 'item',
			message: 'Which item would you like to view? Please select by ID number.',
			validate: function checkForIntegers(item) {
						const reg = /^\d+$/;
						return reg.test(item) || 'Please enter a numerical value for the ID.';
					}
		},

		{
			type: 'input',
			name: 'itemQuantity',
			message: 'How many would you like to purchase?',
			validate: function checkForIntegers(itemQuantity) {
						const reg = /^\d+$/;
						return reg.test(itemQuantity) || 'Please enter a numerical value for your amount.';
					}
		}
	]).then(function(answers) {

		let sql = 'SELECT ?? FROM ?? WHERE ?? = ?';
		let values = ['*', 'products', 'item_id', answers.item];
		sql = mysql.format(sql, values);
		connection.query(sql, function(err, results) {
			if (answers.itemQuantity <= results[0].stock_quantity) {
				console.log('\nGreat choice!\n');
				
				//update database
				let userQuantity = results[0].stock_quantity - answers.itemQuantity;
				let query = connection.query(
					'UPDATE products SET ? WHERE ?',
						[
							{
								stock_quantity: userQuantity
							},
							{
								item_id: results[0].item_id
							}
						],
					function(err, results) {
						console.log(`${results.affectedRows} product updated!`);
						promptAgain();
					}
				);

				//give user total 
				userTotal = parseFloat((results[0].price * answers.itemQuantity).toFixed(2));
				console.log(`Your total is $${userTotal}\n`);
				
				//currentDept = results[0].department_name;
				
				
			} else {
				console.log('\nNot enough in stock. \nPlease pick another item or another amount.\n');
				promptUserInput();
			}
		});		
	});
}

function showAllProducts() {
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

function promptAgain() {
	inquirer.prompt([
		{
			type: 'confirm',
			name: 'orderAgain',
			message: 'Would you like to place another order?',
			default: true
		}
	]).then(function(answers) {
		if (answers.orderAgain) {
			showAllProducts();
		} else {
			console.log('Hope to see you again! Have a BAM!-tabulous day!');
			connection.end();
		}
	});
}

