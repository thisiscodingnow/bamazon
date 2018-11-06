var inquirer = require('inquirer');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'root',
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    itemsList();
});


function itemsList() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        res.forEach(row => {
            console.log(`ID: ${row.item_id}\n Name: ${row.product_name}\n Department: ${row.department_name}\n Price: $${row.price}\n Quantity: ${row.stock_quantity}\n`)
        });
        question();
    })
}

function question() {
    inquirer.prompt([
        {
            message: "Please type the product ID number for what you would like to order.",
            type: "integer",
            name: "proId"
        }, {
            message: "Please input the number of iteams you would like to purchase",
            type: "integer",
            name: "proQ"
        }
    ]).then(function (ans) {
        var proId = ans.proId;
        var proQ = ans.proQ;
        takeaway(proId, proQ);
    });
}

function takeaway(proId, proQ) {
    connection.query('SELECT * FROM products', function (err, res) {
        if (err) throw err;
        var order;
        for (var i = 0; i < res.length; i++) {
            if (res[i].item_id == proId) {
                order = res[i];
            }
        }
        console.log("Your item has been found");
        if (order.stock_quantity >= proQ) {
            process(order, proId, proQ)
            console.log("Order has been placed")
            connection.end()
        } else {
            console.log("Order has been cancelled, please try again with a smaller quantity");
            connection.end();
        }
    })
};

function process(order, proId, proQ) {
    var newQ = order.stock_quantity - proQ;
    var q1 = "UPDATE products SET stock_quantity = ? where ?";
    connection.query(q1, [newQ, { item_id: proId }], function (err, res) {

    })
}