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
			managerView();
		} else if (answers.managerList === 'View Low Inventory') {
			viewLowInventory();
		} else if (answers.managerList === 'Add to Inventory') {
			viewInventoryAgain();
		} else if (answers.managerList === 'Add New Product') {
			addNewProduct();
		}
	});
}

function exitMode() {
	console.log('\nSee ya later, Boss!');
	connection.end();
}

function managerView() {
	viewProducts();
	promptManager();
}

function viewProducts() {
	console.log('\n***  ***  Current Inventory ***  ***\n');
	let sql = 'SELECT ?? FROM ??';
	let values = ['*', 'products'];
	sql = mysql.format(sql, values);
	connection.query(sql, function(err, results, fields) {
		if (err) throw err;
		for (let i = 0; i < results.length; i++) {
			console.log(` \nItem ID: ${results[i].item_id}     Name: ${results[i].product_name}     Price: ${results[i].price}     In Stock: ${results[i].stock_quantity} \n-------------------------------------------------------------------------------------- \n`);
		}
	});
}

function viewLowInventory() {
	console.log('\n***  ***  ***  ***  ***\n');
	console.log('Check Low Inventory Mode');
	console.log('\n***  ***  ***  ***  ***\n');
	
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
		//console.log(lowInventoryArr);
		
		if (lowInventoryArr.length <= 0) {
			console.log('\nNo Low Inventory! Get to selling!\n');
		} else {
			for (let i = 0; i < lowInventoryArr.length; i++) {
				console.log(`\nItem ID: ${lowInventoryArr[i].item_id}     Name: ${lowInventoryArr[i].product_name}     Price: ${lowInventoryArr[i].price}     In Stock: ${lowInventoryArr[i].stock_quantity} \n-------------------------------------------------------------------------------------- \n`);
			}
		}
		
		console.log('\n***  End of Low Inventory Report  ***\n');
		promptManager();
	
	});
}

function viewInventoryAgain() {
	inquirer.prompt([
		{
			type: 'confirm',
			name: 'confirmView',
			message: 'Would you like to view the inventory again?',
			default: true
		}
	]).then(function(answers){
		if (answers.confirmView) {
			viewProducts();
			addInventory();
		} else {
			addInventory();
		}
	});
}

function addInventory() {
	console.log('\n***  ***  ***  ***  ***\n');
	console.log('Add to Inventory Mode');
	console.log('\n***  ***  ***  ***  ***\n');

	inquirer.prompt([
		{
			type: 'input',
			name: 'item',
			message: 'Please enter the ID number of the item you would like to update.',
			validate: function checkForIntegers(item) {
						const reg = /^\d+$/;
						return reg.test(item) || 'Please enter a numerical value for the ID.';
					}
		},

		{
			type: 'input',
			name: 'amount',
			message: 'How much has been added to stock?',
			validate: function checkForIntegers(amount) {
						const reg = /^\d+$/;
						return reg.test(amount) || 'Please enter a numerical value.';
					}
		}
	]).then(function(answers) {
		console.log('\nUpdating product...\n');

		let sql = 'SELECT ?? FROM ?? WHERE ?? = ?';
		let values = ['*', 'products', 'item_id', answers.item];
		sql = mysql.format(sql, values);
		connection.query(sql, function(err, results) {
			let updatedAmount = results[0].stock_quantity + parseInt(answers.amount);

			let query = connection.query(
			'UPDATE products SET ? WHERE ?',
				[
					{
						stock_quantity: updatedAmount
					},

					{
						item_id: results[0].item_id
					}
				],
				function(err, results) {
					console.log('Product updated!');
					promptManager();
				}
			);
		});
	});
}

function addNewProduct() {
	console.log('\n***  ***  ***  ***  ***\n');
	console.log('Create New Product Mode');
	console.log('\n***  ***  ***  ***  ***\n');

	inquirer.prompt([
			{
				type: 'input',
				name: 'productName',
				message: "What is the product's name?"
			},

			{
				type: 'list',
				name: 'productDept',
				message: 'Which department does this product belong to?',
				choices: ['Grocery', 'Beauty', 'Sports/Gear', 'Toys', 'Entertainment']
			},

			{
				type: 'input',
				name: 'productPrice',
				message: 'What is the price of this product?'
			},

			{
				type: 'input',
				name: 'productQuantity',
				message: 'How much of this product do we have in stock?',
				validate: function checkForIntegers(productQuantity) {
						const reg = /^\d+$/;
						return reg.test(productQuantity) || 'Please enter a numerical value for inventory.';
					}
			}
		]).then(function(answers) {
			let query = connection.query(
				'INSERT INTO products SET ?',
					{
						product_name: answers.productName,
						department_name: answers.productDept,
						price: answers.productPrice,
						stock_quantity: answers.productQuantity
					},
					function(err, results) {
						console.log(`\n${results.affectedRows} product created!\n`);
						promptManager();
					} 
				);
		});
}
