# BAM!azon
Amazon-like storefront, powered by MySQL, Node JS, and Inquirer.


# Description

An online storefront that queries a MySQL database for inventory and updates the database in real-time, based off of the user's input, utilizing the Inquirer NPM.

Functionality is handled by JavaScript and contained in two files: 
* **bamazonCustomer.js** (which handles the customer side of the store) 
* **bamazonManager.js** (which handles the manager side).

Each file can be called in the CLI using *node* followed by either *bamazonCustomer.js* or *bamazonManager.js*


# Customer Side (*bamazonCustomer.js*)

CLI asks the user if the user would like to view what is available at the store and make a purchase, then requests a yes or no confirmation.

*If no*, the CLI wishes the user to have a BAM!tabulous day and the connection ends.

*If yes*, the CLI reveals what is available at the store by item ID, name, and price, then prompts the user to enter an ID number and an amount to purchase.

*If there is not enough of the product in stock*, the CLI informs the user of that fact, then prompts the user to enter a new item or a new quantity.

*If there is enough product in stock*, the app fulfills the user's purchase by updating the MySQL database and posing a purchase cost to the user.


# Manager Side (*bamazonManager.js*)

CLI greets the manager and gives the following options:

* *View Products for Sale*: Reveals all products in the inventory, including item IDs, names, departments, prices, and quantities in stock.

* *View Low Inventory*: Shows any item that has a quantity <5 in stock.

* *Add To Inventory*: Allows the manager to add to the product's stock_quantity total in the database.

* *Add New Product*: Allows the manager to create a new product and update the database with it.

* *Exit Manager Mode*: Allows the manager to close the program and ends the connection.



# Technologies Used

JavaScript

[Node JS] (https://nodejs.org/en/)

[Inquirer NPM] (https://www.npmjs.com/package/inquirer)

[MySQL NPM] (https://www.npmjs.com/package/mysql)

Visual Studio Code

Sublime Text 3


# Video To Illustrate How To Use the App

[BAM!azon -- A Real-Time MySQL Store-Front (YouTube)] (https://youtu.be/wIhAOWZz8r0)
