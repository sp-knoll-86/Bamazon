var inquirer = require("inquirer");
var mysql = require("mysql");
require("dotenv").config();

var connection = mysql.createConnection({
    host: process.env.BAMAZON_HOST,
    port: 3306,
    user: process.env.BAMAZON_USER,
    password: process.env.BAMAZON_PASSWORD,
    database: "bamazon"
})

connection.connect(function (err) {
    if (err) throw err;
    validateInput();
});

console.log("Welcome to Bamazon");

function displayInventory() {
    queryStr = "SELECT * FROM products";

    connection.query(queryStr, function (err, data) {
        if (err) throw err;

        console.log("Current Inventory: ");
        console.log("---------------------------\n");

        for (var i = 0; i < data.length; i++) {
            var strOut = "";
            strOut += (" Product ID: " + data[i].product_id + " // ");
            strOut += (" Product Name: " + data[i].product_name + " // ");
            strOut += (" Department: " + data[i].department + " // ");
            strOut += (" Price: " + data[i].price + " // ");

            console.log(strOut);
        }
        console.log("---------------------------\n");
        promptPurchase();
    })
}

function promptPurchase() {
    inquirer.prompt([{
        type: "input",
        name: "product_id",
        message: "Please enter the item ID you would like to purchase.",
        validate: validateInput,
        filter: Number
    },
    {
        type: "input",
        name: "quantity",
        message: "How many items do you need?",
        validate: validateInput,
        filter: Number
    }
    ]).then(function (input) {
        var item = input.product_id;
        var quantity = input.quantity;

        var queryStr = "SELECT * FROM products WHERE ?";

        connection.query(queryStr, {
            product_id: item
        }, function (err, data) {
            if (err) throw err;

            if (data.length === 0) {
                console.log("\n Error: Please select valid item ID\n");
                displayInventory();
            } else {
                var productData = data[0];

                if (quantity <= productData.stock_quantity) {
                    console.log("\n Item in stock. Ordering now!\n");
                    var updateQueryStr = "UPDATE products SET stock_quantity = " + (productData.stock_quantity - quantity) + " WHERE product_id = " + item;

                    connection.query(updateQueryStr, function (err, data) {
                        if (err) throw err;

                        console.log(" Your total is $" + truncateNumber(productData.price * quantity, 2));
                        console.log("\n Thank you for shopping with Bamazon.");
                        console.log("---------------------------\n");
                        connection.end()
                    });
                } else {
                    console.log("\n Sorry, your cannot be placed. There is not enough product in stock.\n");
                    console.log(" Please modify your order.");
                    console.log("---------------------------\n");

                    displayInventory();
                }
            }
        })
    })
}

function truncateNumber(num, precision) {
    let c = Math.pow(10, precision);
    return Math.trunc(num * c) / c;
}

function validateInput(val) {
    var integer = Number.isInteger(parseFloat(val));
    var sign = Math.sign(val);

    if (integer && (sign === 1)) {
        return true;
    } else {
        return "Please enter a whole number greater than zero"
    }
}

displayInventory();